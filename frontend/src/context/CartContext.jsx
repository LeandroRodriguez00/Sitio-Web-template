import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Cargar el carrito desde la base de datos cuando hay token
  useEffect(() => {
    if (token) {
      fetchCartFromDB();
    } else {
      setCartItems([]);
    }
  }, [token]);

  // Función para obtener el carrito del backend
  const fetchCartFromDB = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Se espera que el backend devuelva un objeto con { items: [...] }
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    }
  };

  // Función para agregar un producto al carrito, recibiendo "quantity" (por defecto 1)
  const addToCart = async (product, quantity = 1) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart',
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Si la respuesta incluye los ítems actualizados, se actualiza el estado;
      // en caso contrario, se vuelve a obtener el carrito desde el backend.
      if (res.data.items) {
        setCartItems(res.data.items);
      } else {
        await fetchCartFromDB();
      }
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items);
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
    }
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items);
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
    }
  };

  // Función para vaciar el carrito (eliminando uno a uno)
  const clearCart = async () => {
    for (const item of cartItems) {
      await removeFromCart(item.product._id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,        // Se usa addToCart(product, quantity)
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCartFromDB,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
