const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

/**
 * @route   GET /api/users/:id
 * @desc    Obtener perfil de un usuario
 * @access  Private
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, es_administrador, fecha_registro')
      .eq('id_usuario', id)
      .single();

    if (error || !usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuario
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar perfil de usuario
 * @access  Private (solo el propio usuario)
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario solo actualice su propio perfil
    if (id !== req.user.id_usuario) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para actualizar este perfil'
      });
    }

    const { nombre, telefono, correo } = req.body;

    // Validar que hay datos para actualizar
    if (!nombre && !telefono && !correo) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar al menos un campo para actualizar'
      });
    }

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre.trim();
    if (telefono) datosActualizar.telefono = telefono.trim();
    if (correo) {
      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de correo inválido'
        });
      }

      // Verificar que el correo no esté en uso por otro usuario
      const { data: existingUser } = await supabaseAdmin
        .from('usuarios')
        .select('id_usuario')
        .eq('correo', correo.toLowerCase().trim())
        .neq('id_usuario', id)
        .single();

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'El correo ya está en uso por otro usuario'
        });
      }

      datosActualizar.correo = correo.toLowerCase().trim();
    }

    // Actualizar usuario
    const { data: usuarioActualizado, error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update(datosActualizar)
      .eq('id_usuario', id)
      .select('id_usuario, nombre, correo, telefono, es_administrador, fecha_registro')
      .single();

    if (updateError) {
      console.error('Error al actualizar usuario:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar el perfil'
      });
    }

    res.json({
      success: true,
      data: usuarioActualizado,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/:id/password
 * @desc    Cambiar contraseña
 * @access  Private (solo el propio usuario)
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Verificar que el usuario solo actualice su propia contraseña
    if (id !== req.user.id_usuario) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para cambiar esta contraseña'
      });
    }

    // Validar datos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Contraseña actual y nueva contraseña son obligatorias'
      });
    }

    // Validar longitud de nueva contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener usuario
    const { data: usuario, error: fetchError } = await supabaseAdmin
      .from('usuarios')
      .select('password_hash')
      .eq('id_usuario', id)
      .single();

    if (fetchError || !usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, usuario.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    const { error: updateError } = await supabaseAdmin
      .from('usuarios')
      .update({ password_hash: newPasswordHash })
      .eq('id_usuario', id);

    if (updateError) {
      console.error('Error al cambiar contraseña:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Error al cambiar la contraseña'
      });
    }

    res.json({
      success: true,
      message: 'Contraseña cambiada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar cuenta de usuario
 * @access  Private (solo el propio usuario o admin)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar permisos (solo el usuario o admin)
    if (id !== req.user.id_usuario && !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para eliminar este usuario'
      });
    }

    // Eliminar usuario (cascade eliminará casos y pistas)
    const { error: deleteError } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id_usuario', id);

    if (deleteError) {
      console.error('Error al eliminar usuario:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar el usuario'
      });
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Private (solo admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    // Solo admins
    if (!req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'Solo administradores pueden acceder a esta información'
      });
    }

    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, es_administrador, fecha_registro')
      .order('fecha_registro', { ascending: false });

    if (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener usuarios'
      });
    }

    res.json({
      success: true,
      data: usuarios
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id/stats
 * @desc    Obtener estadísticas de un usuario (casos y pistas)
 * @access  Private
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar permisos
    if (id !== req.user.id_usuario && !req.user.es_administrador) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para ver estas estadísticas'
      });
    }

    // Obtener estadísticas de casos
    const { data: casos, error: casosError } = await supabaseAdmin
      .from('casos')
      .select('estado_caso')
      .eq('id_usuario_reportero', id);

    if (casosError) {
      console.error('Error al obtener casos:', casosError);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }

    // Obtener estadísticas de pistas
    const { data: pistas, error: pistasError } = await supabaseAdmin
      .from('pistas')
      .select('estado_pista')
      .eq('id_usuario_que_aporta', id);

    if (pistasError) {
      console.error('Error al obtener pistas:', pistasError);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }

    // Procesar estadísticas
    const estadisticas = {
      casos: {
        total: casos.length,
        pendientes: casos.filter(c => c.estado_caso === 'PENDIENTE_REVISION').length,
        activos: casos.filter(c => c.estado_caso === 'ACTIVO').length,
        resueltos: casos.filter(c => c.estado_caso === 'RESUELTO').length,
        rechazados: casos.filter(c => c.estado_caso === 'RECHAZADO').length
      },
      pistas: {
        total: pistas.length,
        pendientes: pistas.filter(p => p.estado_pista === 'PENDIENTE_REVISION').length,
        verificadas: pistas.filter(p => p.estado_pista === 'VERIFICADA').length,
        rechazadas: pistas.filter(p => p.estado_pista === 'RECHAZADA').length
      }
    };

    res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    next(error);
  }
};
