import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
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
      <Button variant="contained" onClick={handleOpen}>
        Ajustar Stock
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajustar Stock</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              margin="normal"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              helperText="Ingrese la cantidad a ajustar (positiva o negativa)"
            />
            <TextField
              label="Detalle del Movimiento"
              type="text"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Ingrese el detalle del movimiento"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdjustStockForm;
