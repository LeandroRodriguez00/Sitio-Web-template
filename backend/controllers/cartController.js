// controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    // Usar req.user.id
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Verificar que el producto exista
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Buscar o crear el carrito usando req.user.id
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Buscar si el producto ya existe en el carrito
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      // Si existe, incrementar la cantidad
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Si no existe, agregar el producto
      cart.items.push({ product: productId, quantity });
    }

    // Guardar el carrito
    await cart.save();

    // RE-POPULAR para devolver datos completos (name, price, images)
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images');

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      // RE-POPULAR para devolver datos completos
      const updatedCart = await Cart.findById(cart._id)
        .populate('items.product', 'name price images');

      res.status(200).json(updatedCart);
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto del carrito:', error);
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    // RE-POPULAR para devolver datos completos
    const updatedCart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images');

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito' });
  }
};
