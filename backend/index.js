import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; // Ruta de contacto
import stockMovementRoutes from './routes/stockMovementRoutes.js'; // Nueva ruta de movimientos de stock
import cartRoutes from './routes/cartRoutes.js'; // <-- Importa tus rutas de carrito
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Servir archivos estáticos de la carpeta "uploads"
app.use('/uploads', express.static('uploads'));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error de conexión a MongoDB:", err));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', contactRoutes); // Endpoint de contacto
app.use('/api/stock-movements', stockMovementRoutes); // Endpoint de movimientos de stock

// MONTAR RUTAS DEL CARRITO
app.use('/api/cart', cartRoutes); // <-- Asegúrate de llamar aquí a cartRoutes

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
