/**
 * @file server.js
 * @description Servidor principal de la API REST de Red Esperanza.
 * Configura Express con middlewares de seguridad, CORS, rate limiting y rutas.
 * Maneja autenticación JWT, casos de desaparición, pistas y usuarios.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 * @course Diseño y Arquitectura de Software - Universidad de la Sabana
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./src/config/config');

// Importar rutas
const casesRoutes = require('./src/routes/cases.routes');
const usersRoutes = require('./src/routes/users.routes');
const cluesRoutes = require('./src/routes/clues.routes');
const authRoutes = require('./src/routes/auth.routes');

// Crear aplicación Express
const app = express();

// ========================================
// MIDDLEWARES GLOBALES
// ========================================

// Seguridad con Helmet
app.use(helmet());

// CORS
app.use(cors(config.cors));

// Compresión de respuestas
app.use(compression());

// Logging de peticiones
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parseo de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
  },
});
app.use('/api/', limiter);

// ========================================
// RUTAS
// ========================================

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Red Esperanza API está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido a Red Esperanza API',
    version: config.server.apiVersion,
    documentation: '/api/docs',
  });
});

// Rutas API
const API_PREFIX = `/api/${config.server.apiVersion}`;
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/cases`, casesRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/clues`, cluesRoutes);

// ========================================
// MANEJO DE ERRORES
// ========================================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.server.env === 'development' && { stack: err.stack }),
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║      🔴 RED ESPERANZA - BACKEND API       ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${config.server.env}`);
  console.log(`📡 API Version: ${config.server.apiVersion}`);
  console.log('');
  console.log('📚 Endpoints disponibles:');
  console.log(`   GET  /health - Health check`);
  console.log(`   POST ${API_PREFIX}/auth/login - Login`);
  console.log(`   POST ${API_PREFIX}/auth/register - Registro`);
  console.log(`   GET  ${API_PREFIX}/cases - Listar casos`);
  console.log(`   POST ${API_PREFIX}/cases - Crear caso`);
  console.log(`   GET  ${API_PREFIX}/clues - Listar pistas`);
  console.log('');
  console.log('🛑 Presiona CTRL+C para detener el servidor');
  console.log('');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

module.exports = app;
