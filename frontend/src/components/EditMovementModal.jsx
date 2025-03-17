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

// Estilo para los TextField (cantidad y descripción) con variante "filled"
const customFieldSx = {
  backgroundColor: '#111',
  borderRadius: 1,
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    color: '#fff',
    '&:hover': { backgroundColor: '#222' },
    '&.Mui-focused': { backgroundColor: '#222' },
    '&:after': { borderBottomColor: '#fff' }
  },
  '& .MuiInputLabel-root': { color: '#fff' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
};

const EditMovementModal = ({ open, onClose, movement, onMovementUpdated }) => {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(movement.quantity);
  const [description, setDescription] = useState(movement.description || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Actualizar campos locales cuando el movimiento cambie
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
            backgroundColor: '#000', // Fondo opaco
            border: '2px solid #fff',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            color: '#fff'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
            Editar Movimiento
          </Typography>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="filled"
            sx={{ mb: 2, ...customFieldSx }}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <TextField
            label="Descripción"
            type="text"
            fullWidth
            variant="filled"
            sx={{ mb: 2, ...customFieldSx }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <Typography variant="body2" sx={{ mb: 2, color: '#f44336' }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading}
              sx={{
                backgroundColor: '#f50057',
                color: '#fff',
                '&:hover': { backgroundColor: '#c51162' }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditMovementModal;
