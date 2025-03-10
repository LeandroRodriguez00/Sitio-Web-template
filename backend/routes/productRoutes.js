import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas: Solo usuarios autenticados y con rol admin pueden modificar productos
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  upload.single('images'), // Maneja una sola imagen
  createProduct
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  upload.single('images'), // Procesa la imagen si la hay, si no, req.file será undefined
  updateProduct
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
