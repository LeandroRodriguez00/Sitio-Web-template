// src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // Ajusta la URL según tu entorno

// Obtener todos los productos (endpoint público)
export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Retorna un arreglo de productos
  } catch (error) {
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un producto (requiere autenticación de admin)
export const createProduct = async (productData, token) => {
  try {
    // OJO: No fijes 'Content-Type': 'application/json' si estás subiendo archivos
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Retorna el producto creado
  } catch (error) {
    throw error;
  }
};

// Actualizar un producto
export const updateProduct = async (productId, productData, token) => {
  try {
    // También quitamos 'Content-Type' para que Axios use multipart/form-data si usas FormData
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (productId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
