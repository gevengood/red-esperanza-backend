const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../config/supabase');
const config = require('../config/config');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
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
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
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
