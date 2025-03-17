// src/components/ProductDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Fade, 
  Modal, 
  IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

// Animación para el modal (zoom in)
const modalZoomIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

// Animación para el borde neón blanco
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const ProductDetails = ({ open, handleClose, productId, onAddToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Estados para los modales
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [stockAlertOpen, setStockAlertOpen] = useState(false);

  const { user, token } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      getProductById(productId)
        .then((data) => {
          setProduct(data);
          setCurrentImageIndex(0);
          setQuantity(1);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error al cargar el producto:', err);
          setError('Error al cargar el producto');
          setLoading(false);
        });
    }
  }, [open, productId]);

  const handlePrevImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Función que verifica stock en el carrito + lo que se desea agregar
  const handleAddToCartClick = async () => {
    if (!user || !token) {
      setLoginAlertOpen(true);
      return;
    }
    // Verificar cuánto de este producto ya hay en el carrito
    const cartItem = cartItems.find((item) => item.product._id === product?._id);
    const currentCartQuantity = cartItem ? cartItem.quantity : 0;
    // Cuánto más se puede agregar sin exceder el stock total
    const allowedAddition = (product?.stock ?? 0) - currentCartQuantity;

    // Si no hay stock disponible para agregar
    if (allowedAddition <= 0) {
      setStockAlertOpen(true);
      return;
    }

    // Si el usuario intenta agregar más de lo permitido
    if (quantity > allowedAddition) {
      setStockAlertOpen(true);
      return;
    }

    try {
      await addToCart(product, quantity);
      onAddToCart && onAddToCart(product, quantity);
      setConfirmationModalOpen(true);
      handleClose();
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  };

  return (
    <>
      {/* Modal principal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }}
      >
        <Fade in={open} timeout={600}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              maxHeight: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              boxShadow: 24,
              p: 2,
              textAlign: 'center',
              borderRadius: 3,
              animation: `${modalZoomIn} 0.6s ease-out`,
              color: '#fff',
              border: '2px solid #ffffff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <IconButton 
              onClick={handleClose} 
              sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>

            {loading ? (
              <CircularProgress sx={{ color: '#fff' }} />
            ) : error ? (
              <Typography variant="h6">{error}</Typography>
            ) : product ? (
              <>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {product.name}
                </Typography>

                {product.images && product.images.length > 0 && (
                  <Box sx={{ position: 'relative', mb: 2, flexShrink: 0 }}>
                    <img
                      src={`http://localhost:5000/uploads/${product.images[currentImageIndex]}`}
                      alt={product.name}
                      style={{
                        width: '100%',
                        maxHeight: '30vh',
                        objectFit: 'contain',
                        borderRadius: 8
                      }}
                    />
                    {product.images.length > 1 && (
                      <>
                        <Button 
                          onClick={handlePrevImage}
                          variant="contained"
                          color="secondary"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            transform: 'translateY(-50%)',
                            minWidth: 'unset',
                            padding: '4px 8px'
                          }}
                        >
                          ‹
                        </Button>
                        <Button 
                          onClick={handleNextImage}
                          variant="contained"
                          color="secondary"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            right: 0,
                            transform: 'translateY(-50%)',
                            minWidth: 'unset',
                            padding: '4px 8px'
                          }}
                        >
                          ›
                        </Button>
                      </>
                    )}
                  </Box>
                )}

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Precio: ${product.price}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {product.stock > 0
                      ? `Stock disponible: ${product.stock}`
                      : 'Producto agotado'}
                  </Typography>
                </Box>

                {/* Controles de cantidad */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 2,
                    gap: 1
                  }}
                >
                  <IconButton
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    sx={{
                      color: '#fff',
                      backgroundColor: 'rgba(245, 0, 87, 0.15)',
                      border: '1px solid #f50057',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(245, 0, 87, 0.25)',
                        boxShadow: '0 0 8px rgba(245, 0, 87, 0.3)'
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography
                    sx={{
                      minWidth: '40px',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      border: '1px solid #f50057',
                      borderRadius: '8px',
                      px: 1,
                      py: 0.5,
                      backgroundColor: 'rgba(245, 0, 87, 0.15)'
                    }}
                  >
                    {quantity}
                  </Typography>

                  <IconButton
                    onClick={() => {
                      // Si intenta superar el stock total, muestra el modal
                      if (quantity < (product.stock ?? 0)) {
                        setQuantity(quantity + 1);
                      } else {
                        setStockAlertOpen(true);
                      }
                    }}
                    sx={{
                      color: '#fff',
                      backgroundColor: 'rgba(245, 0, 87, 0.15)',
                      border: '1px solid #f50057',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(245, 0, 87, 0.25)',
                        boxShadow: '0 0 8px rgba(245, 0, 87, 0.3)'
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Button 
                  variant="contained" 
                  color="secondary" 
                  sx={{ mt: 2 }}
                  onClick={handleAddToCartClick}
                  disabled={product.stock === 0 || quantity > (product.stock ?? 0)}
                >
                  Agregar al Carrito
                </Button>
              </>
            ) : (
              <Typography variant="h6">Producto no encontrado</Typography>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Confirmación de Producto Agregado */}
      <Modal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 700,
          sx: { backgroundColor: 'rgba(0, 0, 0, 1)', transition: 'background-color 0.7s ease-in-out' }
        }}
      >
        <Fade in={confirmationModalOpen} timeout={700}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              animation: `${modalZoomIn} 0.6s ease-out, ${neonBorderWhite} 1.5s infinite alternate`,
              color: '#fff',
              border: '2px solid #ffffff'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Producto Agregado
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              {product?.name} se ha agregado al carrito.
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => setConfirmationModalOpen(false)}>
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Aviso para Stock Insuficiente */}
      <Modal
        open={stockAlertOpen}
        onClose={() => setStockAlertOpen(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 700,
          sx: { backgroundColor: 'rgba(0, 0, 0, 1)', transition: 'background-color 0.7s ease-in-out' }
        }}
      >
        <Fade in={stockAlertOpen} timeout={700}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              animation: `${modalZoomIn} 0.6s ease-out, ${neonBorderWhite} 1.5s infinite alternate`,
              color: '#fff',
              border: '2px solid #ffffff'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Stock Insuficiente
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              {/* cartItem y allowedAddition para mensaje profesional */}
              {(() => {
                const cartItem = cartItems.find((item) => item.product._id === product?._id);
                const currentCartQuantity = cartItem ? cartItem.quantity : 0;
                const allowedAddition = (product?.stock ?? 0) - currentCartQuantity;
                if (allowedAddition <= 0) {
                  return (
                    `Ya tienes ${currentCartQuantity} unidad(es) en tu carrito, 
                     no puedes agregar más porque superas el stock total de ${product?.stock ?? 0}.`
                  );
                } else {
                  return (
                    `Ya tienes ${currentCartQuantity} unidad(es) en tu carrito. 
                     Solo puedes agregar hasta ${allowedAddition} unidad(es) más (stock total: ${product?.stock ?? 0}).`
                  );
                }
              })()}
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => setStockAlertOpen(false)}>
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de Aviso para Iniciar Sesión */}
      <Modal
        open={loginAlertOpen}
        onClose={() => setLoginAlertOpen(false)}
        closeAfterTransition
        BackdropProps={{
          timeout: 700,
          sx: { backgroundColor: 'rgba(0, 0, 0, 1)', transition: 'background-color 0.7s ease-in-out' }
        }}
      >
        <Fade in={loginAlertOpen} timeout={700}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              animation: `${modalZoomIn} 0.6s ease-out, ${neonBorderWhite} 1.5s infinite alternate`,
              color: '#fff',
              border: '2px solid #ffffff'
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Aviso
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              Debes registrarte o iniciar sesión para realizar la compra.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => {
                setLoginAlertOpen(false);
                navigate("/login");
              }}
            >
              Ir a Login
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ProductDetails;
