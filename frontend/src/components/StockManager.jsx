import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';

const StockManager = ({ productId, currentStock, onStockUpdate }) => {
  const [adjustment, setAdjustment] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdjustmentChange = (e) => {
    setAdjustment(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdateStock = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      // Convertir adjustment a número
      const quantity = Number(adjustment);

      const response = await axios.patch(
        `http://localhost:5000/api/products/${productId}/stock`,
        { quantity, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage(response.data.message);
      if (onStockUpdate) onStockUpdate(response.data.stock);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar el stock');
    } finally {
      setLoading(false);
      setAdjustment('');
      setDescription('');
    }
  };

  return (
    <Card
      sx={{
        mt: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
        maxWidth: 360
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          Gestión de Stock
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Stock actual: <strong>{currentStock}</strong>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Ajuste de stock"
            type="number"
            value={adjustment}
            onChange={handleAdjustmentChange}
            variant="outlined"
            fullWidth
            helperText="Cantidad a sumar (+) o restar (-)"
          />

          <TextField
            label="Detalle del movimiento"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            variant="outlined"
            fullWidth
            helperText="Breve descripción o motivo del ajuste"
          />

          <Button
            variant="contained"
            onClick={handleUpdateStock}
            disabled={loading}
            sx={{ alignSelf: 'flex-start' }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Actualizar Stock'
            )}
          </Button>
        </Box>

        {message && (
          <Typography variant="body2" sx={{ mt: 2, color: '#00796b' }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StockManager;
