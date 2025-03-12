// src/context/CartContext.jsx
import React, { createContext, useState } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  // Estado inicial del carrito: un arreglo vacío
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Buscar si el producto ya existe en el carrito
      const existItem = prevItems.find(item => item._id === product._id);
      if (existItem) {
        // Si ya existe, aumentar la cantidad
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Si no existe, agregarlo con cantidad inicial de 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
