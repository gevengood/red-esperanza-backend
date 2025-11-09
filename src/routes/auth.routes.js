/**
 * @file auth.routes.js
 * @description Rutas de autenticación (registro, login, logout, perfil).
 * Define endpoints públicos y privados para gestión de autenticación JWT.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario actual
 * @access  Private
 */
router.get('/me', auth(), authController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', auth(), authController.logout);

module.exports = router;
