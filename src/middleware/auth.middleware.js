const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { supabaseAdmin } = require('../config/supabase');

/**
 * Middleware para verificar JWT y autenticar usuario
 * @param {boolean} required - Si es true, el token es obligatorio. Si es false, es opcional.
 */
const auth = (required = true) => {
  return async (req, res, next) => {
    try {
      // Obtener token del header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (required) {
          return res.status(401).json({
            success: false,
            error: 'No autorizado. Token no proporcionado.'
          });
        }
        // Si el token no es requerido, continuar sin autenticar
        return next();
      }

      const token = authHeader.split(' ')[1];

      // Verificar token
      let decoded;
      try {
        decoded = jwt.verify(token, config.jwt.secret);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            error: 'Token expirado'
          });
        }
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      }

      // Verificar que el usuario existe
      const { data: usuario, error } = await supabaseAdmin
        .from('usuarios')
        .select('id_usuario, correo, es_administrador')
        .eq('id_usuario', decoded.id_usuario)
        .single();

      if (error || !usuario) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Agregar usuario al request
      req.user = {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        es_administrador: usuario.es_administrador
      };

      next();
    } catch (error) {
      console.error('Error en auth middleware:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar autenticación'
      });
    }
  };
};

/**
 * Middleware para verificar que el usuario sea administrador
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado'
    });
  }

  if (!req.user.es_administrador) {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }

  next();
};

module.exports = { auth, isAdmin };
