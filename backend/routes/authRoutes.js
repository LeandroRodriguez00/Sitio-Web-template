import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword);

export default router;
