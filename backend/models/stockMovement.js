import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['ingreso', 'egreso'],
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  // Nuevo campo para almacenar el usuario que genera el movimiento
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StockMovement = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);
export default StockMovement;
