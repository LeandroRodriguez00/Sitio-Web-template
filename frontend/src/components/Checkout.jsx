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
  Paper,
  CardMedia,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  // Datos de envío y facturación
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  // Método de envío
  const [shippingMethod, setShippingMethod] = useState('standard');
  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');
  // Código de descuento (opcional)
  const [discountCode, setDiscountCode] = useState('');
  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Calcula subtotal sumando el precio * cantidad de cada item
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  // Simulación de costo de envío según método
  const shippingCost = shippingMethod === 'standard' ? 500 : shippingMethod === 'express' ? 900 : 0;

  // Simulación de impuestos (por ejemplo, 21%)
  const taxes = subtotal * 0.21;

  // Descuento ficticio si el código es "PROMO10"
  const discount = discountCode.toUpperCase() === 'PROMO10' ? 0.1 * subtotal : 0;

  // Total final
  const totalCost = subtotal + shippingCost + taxes - discount;

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
        subtotal,
        shippingMethod,
        shippingCost,
        taxes,
        discount,
        total: totalCost,
        shippingInfo,
        paymentMethod,
      };

      // Asegúrate de tener el endpoint /api/orders implementado en tu backend
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

  // Si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <Box sx={{ p: 4, backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        <Typography variant="h5">Tu carrito está vacío.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh'
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Resumen de Productos */}
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
              {cartItems.map((item) => {
                const product = item.product;
                const price = product?.price || 0;
                const subtotalItem = price * item.quantity;
                const imageUrl = product?.images?.[0]
                  ? `http://localhost:5000/uploads/${product.images[0]}`
                  : 'https://via.placeholder.com/100';

                return (
                  <ListItem
                    key={item._id}
                    sx={{ borderBottom: '1px solid #444', display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={product?.name || 'Producto'}
                      sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="span" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {product?.name || 'Producto sin nombre'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" sx={{ color: '#ccc' }}>
                            Cantidad: {item.quantity}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span" sx={{ color: '#ccc' }}>
                            Precio Unit.: ${price.toFixed(2)}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span" sx={{ color: '#ccc' }}>
                            Subtotal: ${subtotalItem.toFixed(2)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>

            {/* Resumen de costos */}
            <Typography variant="body1" sx={{ mt: 2 }}>
              Subtotal: ${subtotal.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Impuestos (21%): ${taxes.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Envío: ${shippingCost.toFixed(2)}
            </Typography>
            {discount > 0 && (
              <Typography variant="body1" sx={{ color: '#4caf50' }}>
                Descuento: -${discount.toFixed(2)}
              </Typography>
            )}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${totalCost.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Datos de Envío y Pago */}
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
              Datos de Envío
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre Completo *"
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
                  label="Dirección *"
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
                  label="Ciudad *"
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
                  label="Código Postal *"
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
                  label="País *"
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

            {/* Método de Envío */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Método de Envío
            </Typography>
            <FormControl variant="filled" fullWidth sx={{ backgroundColor: '#222', mb: 2 }}>
              <InputLabel sx={{ color: '#aaa' }}>Método de Envío</InputLabel>
              <Select
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="standard">Envío Estándar ($500)</MenuItem>
                <MenuItem value="express">Envío Express ($900)</MenuItem>
                <MenuItem value="pickup">Retiro en Tienda ($0)</MenuItem>
              </Select>
            </FormControl>

            {/* Método de Pago */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Método de Pago
            </Typography>
            <FormControl variant="filled" fullWidth sx={{ backgroundColor: '#222', mb: 2 }}>
              <InputLabel sx={{ color: '#aaa' }}>Método de Pago</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
              </Select>
            </FormControl>

            {/* Código de Descuento (opcional) */}
            <TextField
              label="Código de Descuento"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
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
              color="secondary"
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
    </Box>
  );
};

export default Checkout;
