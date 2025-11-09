/**
 * @file config.js
 * @description Configuración centralizada de la aplicación backend.
 * Carga variables de entorno y exporta configuraciones para servidor, base de datos,
 * autenticación, CORS, rate limiting y upload de archivos.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

require('dotenv').config();

/**
 * Objeto de configuración global de la aplicación
 * @constant {Object}
 * @property {Object} server - Configuración del servidor Express
 * @property {Object} supabase - Credenciales de Supabase (PostgreSQL + Storage)
 * @property {Object} jwt - Configuración de JSON Web Tokens
 * @property {Object} cors - Configuración de Cross-Origin Resource Sharing
 * @property {Object} rateLimit - Configuración de limitación de peticiones
 * @property {Object} logging - Nivel de logs
 * @property {Object} upload - Configuración de subida de archivos
 */
module.exports = {
  // Configuración del servidor
  server: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Configuración de Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  // Configuración JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Configuración CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Configuración de Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Configuración de Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Configuración de archivos
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
};
