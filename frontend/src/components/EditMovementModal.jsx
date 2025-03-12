// src/components/EditMovementModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  Box,
  Fade,
  Backdrop,
  Typography,
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const EditMovementModal = ({ open, onClose, movement, onMovementUpdated }) => {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(movement.quantity);
  const [description, setDescription] = useState(movement.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si el movimiento cambia, actualizar los campos locales
  useEffect(() => {
    setQuantity(movement.quantity);
    setDescription(movement.description || '');
  }, [movement]);

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/stock-movements/${movement._id}`,
        { quantity, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Asumimos que el endpoint retorna el movimiento actualizado.
      // Si no es así, podemos crear el objeto actualizado a partir de los datos actuales.
      const updatedMovement = {
        ...movement,
        quantity,
        description,
      };
      onMovementUpdated(updatedMovement);
    } catch (err) {
      console.error('Error al editar movimiento:', err);
      setError(err.response?.data?.message || 'No se pudo editar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 350,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Editar Movimiento
          </Typography>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <TextField
            label="Descripción"
            type="text"
            fullWidth
            sx={{ mb: 2 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleUpdate} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditMovementModal;
