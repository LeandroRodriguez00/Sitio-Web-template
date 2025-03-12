// controllers/stockMovementController.js
import StockMovement from '../models/stockMovement.js';

export const getStockMovements = async (req, res) => {
  try {
    // Populamos los datos básicos del producto (nombre y precio) y del usuario (nombre y email)
    const movements = await StockMovement.find()
      .populate('product', 'name price')
      .populate('user', 'name email');
    res.status(200).json(movements);
  } catch (error) {
    console.error('Error al obtener movimientos de stock:', error);
    res.status(500).json({ message: 'Error al obtener movimientos de stock' });
  }
};

export const deleteMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const movement = await StockMovement.findByIdAndDelete(id);
    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.status(200).json({ message: 'Movimiento eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ message: 'Error al eliminar movimiento' });
  }
};

export const updateMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, description } = req.body;
    const movement = await StockMovement.findById(id);
    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    // Actualizamos los campos si se envían
    if (quantity !== undefined) movement.quantity = quantity;
    if (description !== undefined) movement.description = description;
    await movement.save();
    res.status(200).json({ message: 'Movimiento actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    res.status(500).json({ message: 'Error al actualizar movimiento' });
  }
};
