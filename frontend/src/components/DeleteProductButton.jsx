// src/components/DeleteProductButton.jsx
import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../context/AuthContext';

const DeleteProductButton = ({ productId, onDelete }) => {
  const { token } = useContext(AuthContext); // Obtener el token de contexto

  const handleDelete = async () => {
    if (!token) {
      console.error('No hay token de autenticación.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Enviar el token en la cabecera
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error al eliminar producto:', errorMessage);
        return;
      }

      onDelete(); // Actualizar la lista de productos
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <IconButton
      onClick={handleDelete}
      sx={{
        color: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.15)',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.3)',
        },
        transition: '0.3s',
        borderRadius: '12px',
        p: 1.2
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteProductButton;
