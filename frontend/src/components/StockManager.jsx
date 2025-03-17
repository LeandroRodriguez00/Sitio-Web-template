// src/components/StockManager.jsx
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
    setMessage('');
    // Convertir adjustment a número
    const quantity = Number(adjustment);

    // Validar que el ajuste no deje el stock negativo
    if (currentStock + quantity < 0) {
      setMessage('La cantidad a descontar supera el stock disponible.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
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
        backgroundColor: '#111',
        borderRadius: 2,
        boxShadow: '0 1px 5px rgba(0,0,0,0.5)',
        maxWidth: 360,
        border: '1px solid #fff'
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#fff' }}>
          Gestión de Stock
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, color: '#fff' }}>
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
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{
              backgroundColor: '#222',
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#fff' },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#f50057' }
              },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' }
            }}
          />

          <TextField
            label="Detalle del movimiento"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            variant="outlined"
            fullWidth
            helperText="Breve descripción o motivo del ajuste"
            InputLabelProps={{ style: { color: '#fff' } }}
            sx={{
              backgroundColor: '#222',
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: '#fff' },
                '&:hover fieldset': { borderColor: '#fff' },
                '&.Mui-focused fieldset': { borderColor: '#f50057' }
              },
              '& .MuiFormHelperText-root': { color: '#e0e0e0' }
            }}
          />

          <Button
            variant="contained"
            onClick={handleUpdateStock}
            disabled={loading}
            sx={{
              alignSelf: 'flex-start',
              backgroundColor: '#f50057',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#c51162'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Actualizar Stock'
            )}
          </Button>
        </Box>

        {message && (
          <Typography variant="body2" sx={{ mt: 2, color: '#e0e0e0' }}>
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StockManager;
