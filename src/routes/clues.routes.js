/**
 * @file clues.routes.js
 * @description Rutas de pistas/clues de casos de desaparición.
 * Define endpoints para consulta, creación, verificación y rechazo de pistas.
 * Pistas verificadas son públicas, pendientes solo visibles para admin.
 * @author Jorge Steven Doncel Bejarano
 * @date 2025-11-09
 */

const express = require('express');
const router = express.Router();
const cluesController = require('../controllers/clues.controller');
const { auth, isAdmin } = require('../middleware/auth.middleware');

/**
 * @route   GET /api/clues/case/:caseId
 * @desc    Obtener pistas de un caso
 * @access  Public (solo verificadas), Private (todas si es admin)
 */
router.get('/case/:caseId', auth(false), cluesController.getCluesByCase);

/**
 * @route   GET /api/clues/pending
 * @desc    Obtener pistas pendientes de revisión
 * @access  Private (solo admin)
 */
router.get('/pending', auth(), isAdmin, cluesController.getPendingClues);

/**
 * @route   GET /api/clues/user/:userId
 * @desc    Obtener pistas de un usuario
 * @access  Private
 */
router.get('/user/:userId', auth(), cluesController.getCluesByUser);

/**
 * @route   GET /api/clues/:id
 * @desc    Obtener una pista por ID
 * @access  Public (si está verificada), Private (cualquiera si es admin/dueño)
 */
router.get('/:id', auth(false), cluesController.getClueById);

/**
 * @route   POST /api/clues
 * @desc    Crear una nueva pista
 * @access  Private
 */
router.post('/', auth(), cluesController.createClue);

/**
 * @route   PUT /api/clues/:id
 * @desc    Actualizar una pista
 * @access  Private (dueño para editar, admin para cambiar estado)
 */
router.put('/:id', auth(), cluesController.updateClue);

/**
 * @route   DELETE /api/clues/:id
 * @desc    Eliminar una pista
 * @access  Private (dueño o admin)
 */
router.delete('/:id', auth(), cluesController.deleteClue);

module.exports = router;
