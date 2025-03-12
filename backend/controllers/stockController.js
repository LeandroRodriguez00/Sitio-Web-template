import Product from '../models/Product.js';
import StockMovement from '../models/stockMovement.js';

export const adjustStock = async (req, res) => {
  try {
    // Verificar que req.user esté definido
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado: usuario no autenticado.' });
    }

    // Obtener el ID del usuario de forma segura, dependiendo de cómo se defina en el token
    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado: usuario inválido.' });
    }

    const { id } = req.params;
    const { quantity, description } = req.body; // 'description' es opcional

    // Validar que 'quantity' sea un número
    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'La cantidad debe ser un número' });
    }

    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Validar que el stock no quede negativo
    if (product.stock + quantity < 0) {
      return res.status(400).json({ message: 'La cantidad a descontar supera el stock disponible' });
    }

    // Actualizar el stock de forma atómica
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );

    // Determinar el tipo de movimiento
    const movementType = quantity >= 0 ? 'ingreso' : 'egreso';

    // Registrar el movimiento, incluyendo el usuario que lo genera
    const movement = new StockMovement({
      product: id,
      quantity,
      type: movementType,
      description: description || '',
      user: userId,
    });
    await movement.save();

    res.status(200).json({ message: 'Stock actualizado', stock: updatedProduct.stock });
  } catch (error) {
    console.error('Error al ajustar el stock:', error);
    res.status(500).json({ message: 'Error al actualizar el stock' });
  }
};
