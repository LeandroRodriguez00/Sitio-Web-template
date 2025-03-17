import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const AdjustStockForm = ({ productId, token, onStockAdjusted }) => {
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setQuantity(0);
    setDescription('');
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Llama al endpoint para ajustar stock
      const response = await axios.patch(
        `http://localhost:5000/api/products/${productId}/adjust-stock`,
        { quantity, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Callback para actualizar el estado del stock en el componente padre
      if (onStockAdjusted) onStockAdjusted(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al ajustar stock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          backgroundColor: '#f50057',
          color: '#fff',
          '&:hover': { backgroundColor: '#c51162' }
        }}
      >
        Ajustar Stock
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid #fff',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajustar Stock</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Cantidad"
              type="number"
              variant="filled"
              fullWidth
              margin="normal"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              helperText="Ingrese la cantidad a ajustar (positiva o negativa)"
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: 1,
                border: '1px solid #fff',
                '& .MuiInputLabel-root': { color: '#fff' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
                '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' }
              }}
            />
            <TextField
              label="Detalle del Movimiento"
              type="text"
              variant="filled"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Ingrese el detalle del movimiento"
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: 1,
                border: '1px solid #fff',
                '& .MuiInputLabel-root': { color: '#fff' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
                '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
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
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#f50057',
                color: '#fff',
                '&:hover': { backgroundColor: '#c51162' }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdjustStockForm;
