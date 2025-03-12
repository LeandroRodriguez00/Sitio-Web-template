// models/Cart.js
import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

// Actualizar la fecha de actualización cada vez que se modifique el carrito
CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
