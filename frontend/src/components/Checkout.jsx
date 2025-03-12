import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  Grid,
  Paper
} from '@mui/material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Calcula el costo total
  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    // Validación básica de campos requeridos
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.zip ||
      !shippingInfo.country
    ) {
      setError('Por favor, completa todos los campos obligatorios de envío.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: cartItems,
        total: totalCost,
        shippingInfo,
        paymentMethod,
      };

      // Simulación de llamada al endpoint de órdenes
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      // Limpiar carrito y redirigir a confirmación
      clearCart();
      navigate('/order-confirmation', { state: { order: response.data } });
    } catch (err) {
      setError('Error al procesar el pago. Por favor, inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 4 }, 
        backgroundColor: '#000', 
        color: '#fff', 
        minHeight: '100vh' 
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Checkout
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Tu carrito está vacío.</Typography>
      ) : (
        <Grid container spacing={4}>
          {/* Resumen de la Orden */}
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: '#111', 
                color: '#fff', 
                border: '1px solid #444' 
              }}
              elevation={3}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Resumen de la Orden
              </Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem 
                    key={item._id} 
                    sx={{ borderBottom: '1px solid #444' }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`}
                      primaryTypographyProps={{ sx: { color: '#fff' } }}
                      secondaryTypographyProps={{ sx: { color: '#ccc' } }} 
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${totalCost.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          {/* Formulario de Envío y Pago */}
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: '#111', 
                color: '#fff', 
                border: '1px solid #444' 
              }} 
              elevation={3}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Detalles de Envío
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre Completo"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ciudad"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Estado/Provincia"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Código Postal"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="País"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Teléfono"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                    sx={{
                      backgroundColor: '#222',
                      input: { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#aaa' },
                      '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Método de Pago
              </Typography>
              <TextField
                label="Método de Pago"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                fullWidth
                variant="filled"
                sx={{
                  backgroundColor: '#222',
                  input: { color: '#fff' },
                  '& .MuiInputLabel-root': { color: '#aaa' },
                  '& .MuiFilledInput-root:hover': { backgroundColor: '#333' }
                }}
              />

              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                color="secondary"  // Botón con color secundario
                fullWidth
                onClick={handleCheckout}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'CONFIRMAR Y PAGAR'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Checkout;
