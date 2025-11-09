/**
 * @file cases.controller.js
 * @description Controlador de casos de desaparición con CRUD completo.
 * Maneja creación, consulta, actualización y eliminación de casos, con filtros,
 * paginación, gestión de estados y subida de fotos a Supabase Storage.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const { supabaseAdmin } = require('../config/supabase');

/**
 * Obtener todos los casos con filtros
 * @function getAllCases
 * @description Lista casos con opción de filtrar por estado y paginación.
 * Usuarios normales ven solo casos ACTIVOS, administradores ven todos.
 * 
 * @route GET /api/v1/cases
 * @access Public (casos ACTIVOS) / Private (todos los estados para admin)
 * 
 * @param {Object} req.query - Parámetros de búsqueda
 * @param {string} [req.query.estado] - Filtrar por estado (ACTIVO, PENDIENTE_REVISION, etc.)
 * @param {number} [req.query.limite=50] - Cantidad de resultados por página
 * @param {number} [req.query.pagina=1] - Número de página
 * 
 * @returns {Object} 200 - Lista de casos con paginación
 * @returns {Object} 500 - Error del servidor
 * 
 * @example
 * // Request
 * GET /api/v1/cases?estado=ACTIVO&limite=10&pagina=1
 * 
 * // Response 200
 * {
 *   "success": true,
 *   "data": [{ "id_caso": 1, "nombre_desaparecido": "María", ... }],
 *   "pagination": { "pagina": 1, "limite": 10, "total": 25 }
 * }
 */
exports.getAllCases = async (req, res, next) => {
  try {
    const { estado, limite = 50, pagina = 1 } = req.query;

    let query = supabaseAdmin
      .from('casos')
      .select(`
        *,
        usuario_reportero:usuarios!casos_id_usuario_reportero_fkey(
          id_usuario,
          nombre,
          correo
        )
      `)
      .order('fecha_creacion', { ascending: false });

    // Filtrar por estado si se especifica
    if (estado) {
      query = query.eq('estado_caso', estado.toUpperCase());
    } else {
      // Por defecto, solo mostrar casos activos al público
      if (!req.user || !req.user.es_administrador) {
        query = query.eq('estado_caso', 'ACTIVO');
      }
    }

    // Paginación
    const offset = (parseInt(pagina) - 1) * parseInt(limite);
    query = query.range(offset, offset + parseInt(limite) - 1);

    const { data: casos, error, count } = await query;

    if (error) {
      console.error('Error al obtener casos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener casos'
      });
    }

    res.json({
      success: true,
      data: casos,
      pagination: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total: count
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/cases/:id
 * @desc    Obtener un caso específico por ID
 * @access  Public
 */
exports.getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: caso, error } = await supabaseAdmin
      .from('casos')
      .select(`
        *,
        usuario_reportero:usuarios!casos_id_usuario_reportero_fkey(
          id_usuario,
          nombre,
          telefono
        ),
        pistas(
          id_pista,
          mensaje,
          url_foto_pista,
          estado_pista,
          fecha_creacion,
          usuario:usuarios!pistas_id_usuario_que_aporta_fkey(
            id_usuario,
            nombre
          )
        )
      `)
      .eq('id_caso', id)
      .single();

    if (error || !caso) {
      return res.status(404).json({
        success: false,
        error: 'Caso no encontrado'
      });
    }

    // Filtrar pistas según permisos
    if (!req.user || !req.user.es_administrador) {
      caso.pistas = caso.pistas.filter(p => p.estado_pista === 'VERIFICADA');
    }

    res.json({
      success: true,
      data: caso
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cases
 * @desc    Crear un nuevo caso
 * @access  Private
 */
exports.createCase = async (req, res, next) => {
  try {
    const {
      nombre_desaparecido,
      edad_desaparecido,
      sexo_desaparecido,
      descripcion_fisica,
      descripcion_ropa,
      descripcion_hechos,
      fecha_desaparicion,
      ubicacion_latitud,
      ubicacion_longitud,
      direccion_texto,
      nombre_contacto,
      telefono_contacto,
      correo_contacto,
      parentesco,
      url_foto_1,
      url_foto_2,
      url_foto_3
    } = req.body;

    // Validaciones
    if (!nombre_desaparecido || !edad_desaparecido || !sexo_desaparecido ||
        !descripcion_hechos || !fecha_desaparicion || 
        !ubicacion_latitud || !ubicacion_longitud || !direccion_texto ||
        !nombre_contacto || !telefono_contacto || !correo_contacto || !parentesco) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos obligatorios deben ser completados'
      });
    }

    // Validar edad (0-18 años)
    if (edad_desaparecido < 0 || edad_desaparecido > 18) {
      return res.status(400).json({
        success: false,
        error: 'La edad debe estar entre 0 y 18 años'
      });
    }

    // Validar sexo
    const sexosValidos = ['MASCULINO', 'FEMENINO', 'OTRO'];
    if (!sexosValidos.includes(sexo_desaparecido.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Sexo inválido'
      });
    }

    // Crear caso
    const { data: nuevoCaso, error: insertError } = await supabaseAdmin
      .from('casos')
      .insert([
        {
          id_usuario_reportero: req.user.id_usuario,
          nombre_desaparecido: nombre_desaparecido.trim(),
          edad_desaparecido: parseInt(edad_desaparecido),
          sexo_desaparecido: sexo_desaparecido.toUpperCase(),
          descripcion_fisica: descripcion_fisica?.trim() || null,
          descripcion_ropa: descripcion_ropa?.trim() || null,
          descripcion_hechos: descripcion_hechos.trim(),
          fecha_desaparicion: new Date(fecha_desaparicion).toISOString(),
          ubicacion_latitud: parseFloat(ubicacion_latitud),
          ubicacion_longitud: parseFloat(ubicacion_longitud),
          direccion_texto: direccion_texto.trim(),
          nombre_contacto: nombre_contacto.trim(),
          telefono_contacto: telefono_contacto.trim(),
          correo_contacto: correo_contacto.toLowerCase().trim(),
          parentesco: parentesco.trim(),
          url_foto_1: url_foto_1 || null,
          url_foto_2: url_foto_2 || null,
          url_foto_3: url_foto_3 || null,
          estado_caso: 'PENDIENTE_REVISION'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear caso:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Error al crear el caso'
      });
    }

    res.status(201).json({
      success: true,
      data: nuevoCaso,
      message: 'Caso creado exitosamente. Será revisado por un administrador.'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/cases/:id
 * @desc    Actualizar un caso
 * @access  Private (dueño o admin)
 */
exports.updateCase = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el caso existe
    const { data: casoExistente, error: fetchError } = await supabaseAdmin
      .from('casos')
      .select('id_usuario_reportero')
      .eq('id_caso', id)
      .single();

    if (fetchError || !casoExistente) {
      return res.status(404).json({
        success: false,
        error: 'Caso no encontrado'
      });
    }

    // Verificar permisos (solo el dueño o admin pueden actualizar)
    if (casoExistente.id_usuario_reportero !== req.user.id_usuario && 
        !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para actualizar este caso'
      });
    }

    // Actualizar caso
    const camposActualizables = {
      descripcion_fisica: req.body.descripcion_fisica,
      descripcion_ropa: req.body.descripcion_ropa,
      descripcion_hechos: req.body.descripcion_hechos,
      telefono_contacto: req.body.telefono_contacto,
      correo_contacto: req.body.correo_contacto,
      url_foto_1: req.body.url_foto_1,
      url_foto_2: req.body.url_foto_2,
      url_foto_3: req.body.url_foto_3
    };

    // Solo admins pueden cambiar el estado
    if (req.user.es_administrador && req.body.estado_caso) {
      camposActualizables.estado_caso = req.body.estado_caso.toUpperCase();
      
      // Si se marca como resuelto, agregar fecha
      if (camposActualizables.estado_caso === 'RESUELTO') {
        camposActualizables.fecha_resolucion = new Date().toISOString();
      }
    }

    // Filtrar campos no definidos
    const datosActualizar = Object.fromEntries(
      Object.entries(camposActualizables).filter(([_, v]) => v !== undefined)
    );

    const { data: casoActualizado, error: updateError } = await supabaseAdmin
      .from('casos')
      .update(datosActualizar)
      .eq('id_caso', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar caso:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar el caso'
      });
    }

    res.json({
      success: true,
      data: casoActualizado,
      message: 'Caso actualizado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cases/:id
 * @desc    Eliminar un caso
 * @access  Private (solo admin)
 */
exports.deleteCase = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Solo admins pueden eliminar
    if (!req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'Solo administradores pueden eliminar casos'
      });
    }

    const { error } = await supabaseAdmin
      .from('casos')
      .delete()
      .eq('id_caso', id);

    if (error) {
      console.error('Error al eliminar caso:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar el caso'
      });
    }

    res.json({
      success: true,
      message: 'Caso eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/cases/user/:userId
 * @desc    Obtener casos de un usuario específico
 * @access  Private
 */
exports.getCasesByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verificar permisos (solo el usuario o admin)
    if (userId !== req.user.id_usuario && !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para ver estos casos'
      });
    }

    const { data: casos, error } = await supabaseAdmin
      .from('casos')
      .select('*')
      .eq('id_usuario_reportero', userId)
      .order('fecha_creacion', { ascending: false });

    if (error) {
      console.error('Error al obtener casos del usuario:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener casos'
      });
    }

    res.json({
      success: true,
      data: casos
    });

  } catch (error) {
    next(error);
  }
};
