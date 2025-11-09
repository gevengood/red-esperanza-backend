/**
 * @file auth.controller.js
 * @description Controlador de autenticación con registro, login, logout y perfil.
 * Maneja hashing de contraseñas con bcrypt, generación de JWT y validación de credenciales.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../config/supabase');
const config = require('../config/config');

/**
 * Registrar nuevo usuario
 * @function register
 * @description Crea un nuevo usuario con contraseña hasheada y genera JWT automáticamente.
 * Valida email único, formato correcto y longitud mínima de contraseña.
 * 
 * @route POST /api/v1/auth/register
 * @access Public
 * 
 * @param {Object} req.body - Datos del nuevo usuario
 * @param {string} req.body.nombre - Nombre completo del usuario
 * @param {string} req.body.correo - Email único
 * @param {string} req.body.password - Contraseña (mínimo 6 caracteres)
 * @param {string} [req.body.telefono] - Teléfono opcional
 * 
 * @returns {Object} 201 - Usuario creado con token JWT
 * @returns {Object} 400 - Validación fallida
 * @returns {Object} 409 - Email ya registrado
 * @returns {Object} 500 - Error del servidor
 * 
 * @example
 * // Request
 * POST /api/v1/auth/register
 * {
 *   "nombre": "Juan Pérez",
 *   "correo": "juan@example.com",
 *   "password": "securepass123",
 *   "telefono": "+57 300 123 4567"
 * }
 * 
 * // Response 201
 * {
 *   "success": true,
 *   "message": "Usuario registrado exitosamente",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "usuario": { "id_usuario": 1, "nombre": "Juan Pérez", ... }
 * }
 */
exports.register = async (req, res, next) => {
  try {
    const { nombre, correo, password, telefono } = req.body;

    // Validar datos requeridos
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, correo y contraseña son obligatorios'
      });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de correo inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('correo')
      .eq('correo', correo.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'El correo ya está registrado'
      });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Crear usuario en Supabase
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert([
        {
          nombre: nombre.trim(),
          correo: correo.toLowerCase().trim(),
          password_hash,
          telefono: telefono || null,
          es_administrador: false
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear usuario:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Error al registrar usuario'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id_usuario: newUser.id_usuario,
        correo: newUser.correo,
        es_administrador: newUser.es_administrador
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        usuario: {
          id_usuario: newUser.id_usuario,
          nombre: newUser.nombre,
          correo: newUser.correo,
          telefono: newUser.telefono,
          es_administrador: newUser.es_administrador,
          fecha_registro: newUser.fecha_registro
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar sesión de usuario
 * @function login
 * @description Autentica usuario con email y contraseña, genera JWT si las credenciales son válidas.
 * Compara contraseña con bcrypt y retorna datos del usuario con token.
 * 
 * @route POST /api/v1/auth/login
 * @access Public
 * 
 * @param {Object} req.body - Credenciales de login
 * @param {string} req.body.correo - Email del usuario
 * @param {string} req.body.password - Contraseña sin hashear
 * 
 * @returns {Object} 200 - Login exitoso con token JWT
 * @returns {Object} 400 - Falta email o contraseña
 * @returns {Object} 401 - Credenciales inválidas
 * @returns {Object} 500 - Error del servidor
 * 
 * @example
 * // Request
 * POST /api/v1/auth/login
 * {
 *   "correo": "juan@example.com",
 *   "password": "securepass123"
 * }
 * 
 * // Response 200
 * {
 *   "success": true,
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "usuario": { "id_usuario": 1, "nombre": "Juan Pérez", ... }
 * }
 */
exports.login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    // Validar datos
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        error: 'Correo y contraseña son obligatorios'
      });
    }

    // Buscar usuario por correo
    const { data: user, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('correo', correo.toLowerCase().trim())
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id_usuario: user.id_usuario,
        correo: user.correo,
        es_administrador: user.es_administrador
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      success: true,
      data: {
        token,
        usuario: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          telefono: user.telefono,
          es_administrador: user.es_administrador,
          fecha_registro: user.fecha_registro
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario actual (requiere autenticación)
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, correo, telefono, es_administrador, fecha_registro')
      .eq('id_usuario', req.user.id_usuario)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (en el cliente se elimina el token)
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    // En JWT no hay logout del lado del servidor
    // El cliente debe eliminar el token
    res.json({
      success: true,
      message: 'Sesión cerrada correctamente'
    });
  } catch (error) {
    next(error);
  }
};
