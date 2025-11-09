/**
 * @file users.routes.js
 * @description Rutas de gestión de usuarios.
 * Define endpoints para consulta de perfiles, estadísticas y listado de usuarios.
 * Operaciones protegidas por autenticación y algunas solo para administradores.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Private (solo admin)
 */
router.get('/', auth(), isAdmin, usersController.getAllUsers);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Obtener estadísticas de un usuario
 * @access  Private
 */
router.get('/:id/stats', auth(), usersController.getUserStats);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener perfil de un usuario
 * @access  Private
 */
router.get('/:id', auth(), usersController.getUserProfile);

/**
 * @route   PUT /api/users/:id/password
 * @desc    Cambiar contraseña
 * @access  Private (solo el propio usuario)
 */
router.put('/:id/password', auth(), usersController.changePassword);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar perfil de usuario
 * @access  Private (solo el propio usuario)
 */
router.put('/:id', auth(), usersController.updateUserProfile);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario
 * @access  Private (propio usuario o admin)
 */
router.delete('/:id', auth(), usersController.deleteUser);

module.exports = router;
