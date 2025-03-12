import express from 'express';
import { getStockMovements, deleteMovement, updateMovement } from '../controllers/stockMovementController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Obtener todos los movimientos (sólo para administradores)
router.get('/', authMiddleware, adminMiddleware, getStockMovements);

// Eliminar un movimiento de stock
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovement);

// Actualizar un movimiento de stock
router.patch('/:id', authMiddleware, adminMiddleware, updateMovement);

export default router;
