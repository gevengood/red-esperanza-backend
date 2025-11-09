/**
 * @file auth.middleware.js
 * @description Middleware de autenticación JWT para proteger rutas de la API.
 * Verifica tokens JWT, valida usuarios y gestiona permisos de administrador.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { supabaseAdmin } = require('../config/supabase');

/**
 * Middleware de autenticación JWT
 * @function auth
 * @description Verifica el token JWT del header Authorization y adjunta el usuario al request.
 * Permite tokens opcionales u obligatorios según el parámetro required.
 * 
 * @param {boolean} [required=true] - Si true, el token es obligatorio; si false, es opcional
 * @returns {Function} Middleware de Express que valida JWT
 * 
 * @example
 * // Ruta protegida (token obligatorio)
 * router.get('/protected', auth(), controller.getData);
 * 
 * @example
 * // Ruta con autenticación opcional
 * router.get('/public', auth(false), controller.getData);
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
 * Middleware de verificación de rol administrador
 * @function isAdmin
 * @description Verifica que el usuario autenticado tenga permisos de administrador.
 * Debe usarse después del middleware auth() en la cadena.
 * 
 * @param {Object} req - Request de Express con req.user adjuntado por auth()
 * @param {Object} res - Response de Express
 * @param {Function} next - Callback de siguiente middleware
 * @returns {void}
 * 
 * @example
 * // Ruta solo para administradores
 * router.delete('/cases/:id', auth(), isAdmin, controller.deleteCase);
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
