// routes/cartRoutes.js
import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener el carrito del usuario autenticado
router.get('/', authMiddleware, getCart);

// Agregar un producto al carrito
router.post('/', authMiddleware, addToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:productId', authMiddleware, updateCartItem);

// Eliminar un producto del carrito
router.delete('/:productId', authMiddleware, removeFromCart);

export default router;
