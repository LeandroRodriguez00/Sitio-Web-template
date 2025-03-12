import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  images: {
    type: [String], // Array de URLs de imágenes
    default: [],
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo']
  }
}, {
  timestamps: true // Crea los campos createdAt y updatedAt
});

const Product = mongoose.model('Product', productSchema);
export default Product;
