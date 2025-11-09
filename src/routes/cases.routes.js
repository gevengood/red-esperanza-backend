/**
 * @file cases.routes.js
 * @description Rutas de casos de desaparición (CRUD completo).
 * Define endpoints públicos para consulta y privados para creación/edición.
 * Incluye protección por rol para operaciones de administración.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const express = require('express');
const router = express.Router();
const casesController = require('../controllers/cases.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/cases
 * @desc    Obtener todos los casos (activos públicamente, todos si es admin)
 * @access  Public (con auth opcional para permisos)
 */
router.get('/', auth(false), casesController.getAllCases);

/**
 * @route   GET /api/cases/user/:userId
 * @desc    Obtener casos de un usuario específico
 * @access  Private
 */
router.get('/user/:userId', auth(), casesController.getCasesByUser);

/**
 * @route   GET /api/cases/:id
 * @desc    Obtener un caso por ID
 * @access  Public (con auth opcional para ver datos completos)
 */
router.get('/:id', auth(false), casesController.getCaseById);

/**
 * @route   POST /api/cases
 * @desc    Crear un nuevo caso
 * @access  Private
 */
router.post('/', auth(), casesController.createCase);

/**
 * @route   PUT /api/cases/:id
 * @desc    Actualizar un caso
 * @access  Private (dueño o admin)
 */
router.put('/:id', auth(), casesController.updateCase);

/**
 * @route   DELETE /api/cases/:id
 * @desc    Eliminar un caso
 * @access  Private (solo admin)
 */
router.delete('/:id', auth(), isAdmin, casesController.deleteCase);

module.exports = router;
