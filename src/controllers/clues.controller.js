const { supabaseAdmin } = require('../config/supabase');

/**
 * @route   GET /api/clues/case/:caseId
 * @desc    Obtener todas las pistas de un caso específico
 * @access  Private (dueño del caso ve solo verificadas, admin ve todas)
 */
exports.getCluesByCase = async (req, res, next) => {
  try {
    const { caseId } = req.params;

    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Debes iniciar sesión para ver las pistas'
      });
    }

    // Obtener info del caso para validar que sea el dueño
    const { data: caso, error: casoError } = await supabaseAdmin
      .from('casos')
      .select('id_caso, id_usuario_reportero')
      .eq('id_caso', caseId)
      .single();

    if (casoError || !caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso no encontrado'
      });
    }

    const isAdmin = req.user.es_administrador;
    const isOwner = req.user.id_usuario === caso.id_usuario_reportero;

    // Solo admin o dueño del caso pueden ver pistas
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver estas pistas'
      });
    }

    let query = supabaseAdmin
      .from('pistas')
      .select(`
        *,
        usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
          id_usuario,
          nombre
        ),
        caso:casos!pistas_id_caso_fkey(
          id_caso,
          nombre_desaparecido,
          estado_caso
        )
      `)
      .eq('id_caso', caseId)
      .order('fecha_creacion', { ascending: false });

    // Admin ve todas las pistas, dueño solo las VERIFICADAS
    if (!isAdmin) {
      query = query.eq('estado_pista', 'VERIFICADA');
    }

    const { data: pistas, error } = await query;

    if (error) {
      console.error('Error al obtener pistas:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener pistas'
      });
    }

    res.json({
      success: true,
      data: pistas
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/clues/:id
 * @desc    Obtener una pista específica por ID
 * @access  Public (si está verificada), Private (cualquiera si es admin/dueño)
 */
exports.getClueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: pista, error } = await supabaseAdmin
      .from('pistas')
      .select(`
        *,
        usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
          id_usuario,
          nombre,
          telefono
        ),
        caso:casos!pistas_id_caso_fkey(
          id_caso,
          nombre_desaparecido,
          estado_caso
        )
      `)
      .eq('id_pista', id)
      .single();

    if (error || !pista) {
      return res.status(404).json({
        success: false,
        error: 'Pista no encontrada'
      });
    }

    // Verificar permisos para ver pistas no verificadas
    if (pista.estado_pista !== 'VERIFICADA') {
      if (!req.user || 
          (pista.id_usuario_que_aporta !== req.user.id_usuario && 
           !req.user.es_administrador)) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para ver esta pista'
        });
      }
    }

    res.json({
      success: true,
      data: pista
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/clues
 * @desc    Crear una nueva pista
 * @access  Private
 */
exports.createClue = async (req, res, next) => {
  try {
    const {
      id_caso,
      mensaje,
      url_foto_pista
    } = req.body;

    // Validaciones
    if (!id_caso || !mensaje) {
      return res.status(400).json({
        success: false,
        error: 'El ID del caso y el mensaje son obligatorios'
      });
    }

    // Verificar que el caso existe y está activo
    const { data: caso, error: casoError } = await supabaseAdmin
      .from('casos')
      .select('id_caso, estado_caso')
      .eq('id_caso', id_caso)
      .single();

    if (casoError || !caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso no encontrado'
      });
    }

    if (caso.estado_caso !== 'ACTIVO') {
      return res.status(400).json({
        success: false,
        error: 'Solo se pueden agregar pistas a casos activos'
      });
    }

    // Crear pista
    const { data: nuevaPista, error: insertError } = await supabaseAdmin
      .from('pistas')
      .insert([
        {
          id_caso,
          id_usuario_que_aporta: req.user.id_usuario,
          mensaje: mensaje.trim(),
          url_foto_pista: url_foto_pista || null,
          estado_pista: 'PENDIENTE_REVISION'
        }
      ])
      .select(`
        *,
        usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
          id_usuario,
          nombre
        )
      `)
      .single();

    if (insertError) {
      console.error('Error al crear pista:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Error al crear la pista'
      });
    }

    res.status(201).json({
      success: true,
      data: nuevaPista,
      message: 'Pista enviada exitosamente. Será revisada por un administrador.'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/clues/:id
 * @desc    Actualizar una pista (solo estado para admins)
 * @access  Private (admin para cambiar estado, dueño para editar)
 */
exports.updateClue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado_pista, mensaje, url_foto_pista } = req.body;

    // Verificar que la pista existe
    const { data: pistaExistente, error: fetchError } = await supabaseAdmin
      .from('pistas')
      .select('id_usuario_que_aporta')
      .eq('id_pista', id)
      .single();

    if (fetchError || !pistaExistente) {
      return res.status(404).json({
        success: false,
        error: 'Pista no encontrada'
      });
    }

    // Preparar datos de actualización
    const datosActualizar = {};

    // Solo el dueño puede editar el mensaje y foto
    if (pistaExistente.id_usuario_que_aporta === req.user.id_usuario) {
      if (mensaje !== undefined) datosActualizar.mensaje = mensaje.trim();
      if (url_foto_pista !== undefined) datosActualizar.url_foto_pista = url_foto_pista;
    }

    // Solo admins pueden cambiar el estado
    if (req.user.es_administrador && estado_pista) {
      const estadosValidos = ['PENDIENTE_REVISION', 'VERIFICADA', 'RECHAZADA'];
      if (!estadosValidos.includes(estado_pista.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'Estado de pista inválido'
        });
      }
      datosActualizar.estado_pista = estado_pista.toUpperCase();
    }

    // Verificar que hay algo para actualizar
    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay datos para actualizar'
      });
    }

    // Actualizar pista
    const { data: pistaActualizada, error: updateError } = await supabaseAdmin
      .from('pistas')
      .update(datosActualizar)
      .eq('id_pista', id)
      .select(`
        *,
        usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
          id_usuario,
          nombre
        )
      `)
      .single();

    if (updateError) {
      console.error('Error al actualizar pista:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar la pista'
      });
    }

    res.json({
      success: true,
      data: pistaActualizada,
      message: 'Pista actualizada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/clues/:id
 * @desc    Eliminar una pista
 * @access  Private (dueño o admin)
 */
exports.deleteClue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que la pista existe
    const { data: pistaExistente, error: fetchError } = await supabaseAdmin
      .from('pistas')
      .select('id_usuario_que_aporta')
      .eq('id_pista', id)
      .single();

    if (fetchError || !pistaExistente) {
      return res.status(404).json({
        success: false,
        error: 'Pista no encontrada'
      });
    }

    // Verificar permisos (solo el dueño o admin pueden eliminar)
    if (pistaExistente.id_usuario_que_aporta !== req.user.id_usuario && 
        !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para eliminar esta pista'
      });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('pistas')
      .delete()
      .eq('id_pista', id);

    if (deleteError) {
      console.error('Error al eliminar pista:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar la pista'
      });
    }

    res.json({
      success: true,
      message: 'Pista eliminada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/clues/user/:userId
 * @desc    Obtener todas las pistas de un usuario
 * @access  Private (solo el usuario o admin)
 */
exports.getCluesByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verificar permisos
    if (userId !== req.user.id_usuario && !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para ver estas pistas'
      });
    }

    const { data: pistas, error } = await supabaseAdmin
      .from('pistas')
      .select(`
        *,
        caso:casos!pistas_id_caso_fkey(
          id_caso,
          nombre_desaparecido,
          estado_caso
        )
      `)
      .eq('id_usuario_que_aporta', userId)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error al obtener pistas del usuario:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener pistas'
      });
    }

    res.json({
      success: true,
      data: pistas
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/clues/pending
 * @desc    Obtener todas las pistas pendientes de revisión
 * @access  Private (solo admin)
 */
exports.getPendingClues = async (req, res, next) => {
  try {
    // Solo admins
    if (!req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'Solo administradores pueden acceder a esta información'
      });
    }

    const { data: pistas, error } = await supabaseAdmin
      .from('pistas')
      .select(`
        *,
        usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
          id_usuario,
          nombre,
          correo,
          telefono
        ),
        caso:casos!pistas_id_caso_fkey(
          id_caso,
          nombre_desaparecido,
          estado_caso
        )
      `)
      .eq('estado_pista', 'PENDIENTE_REVISION')
      .order('fecha_creacion', { ascending: true });

    if (error) {
      console.error('Error al obtener pistas pendientes:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener pistas pendientes'
      });
    }

    res.json({
      success: true,
      data: pistas
    });

  } catch (error) {
    next(error);
  }
};
