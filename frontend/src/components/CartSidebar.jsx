// src/components/CartSidebar.jsx
import React, { useContext } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  Button,
  Grid,
  CardMedia
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartSidebar = ({ open, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calcula el costo total sumando el subtotal de cada producto
  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '90%', sm: 400 },
          p: 3,
          backgroundColor: '#000',
          color: '#fff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Encabezado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Tu Carrito</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Lista de Productos */}
        <Box sx={{ flexGrow: 1, mt: 2, overflowY: 'auto' }}>
          {cartItems.length === 0 ? (
            <Typography variant="body1">El carrito está vacío.</Typography>
          ) : (
            <List>
              {cartItems.map((item) => {
                // Definir URL de la imagen (puedes ajustar según tu lógica)
                const imageUrl =
                  item.images && item.images.length > 0
                    ? `http://localhost:5000/uploads/${item.images[0]}`
                    : 'https://via.placeholder.com/100';
                return (
                  <ListItem key={item._id} sx={{ mb: 2, borderBottom: '1px solid #444' }}>
                    <Grid container spacing={1} alignItems="center">
                      {/* Imagen del producto */}
                      <Grid item xs={3}>
                        <CardMedia
                          component="img"
                          image={imageUrl}
                          alt={item.name}
                          sx={{ borderRadius: 1 }}
                        />
                      </Grid>
                      {/* Información del producto */}
                      <Grid item xs={9}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2">
                          Precio: ${item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          Subtotal: ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            sx={{ color: '#fff' }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            sx={{ color: '#fff' }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => removeFromCart(item._id)}
                            sx={{ color: '#f44336', ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Resumen y Acciones Finales */}
        <Box sx={{ mt: 2, borderTop: '1px solid #444', pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Total: ${totalCost.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              onClose(); // Cierra el sidebar
              navigate('/checkout'); // Redirecciona al proceso de pago
            }}
          >
            Proceder a Pago
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={clearCart}
          >
            Vaciar Carrito
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
