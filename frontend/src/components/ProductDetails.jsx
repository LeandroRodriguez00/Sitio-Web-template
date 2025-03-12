// src/components/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
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
import { keyframes } from '@emotion/react';
import { getProductById } from '../services/productService';

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

// Componente ProductDetails: muestra detalles completos de un producto
// Props:
// - open: booleano que indica si el modal está abierto
// - handleClose: función para cerrar el modal
// - productId: ID del producto a mostrar
// - onAddToCart: función para agregar el producto al carrito (se puede enviar el producto o una cantidad)
const ProductDetails = ({ open, handleClose, productId, onAddToCart }) => {
  // Estado para almacenar el producto obtenido
  const [product, setProduct] = useState(null);
  // Estado para controlar la carga y posibles errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Estado para el índice de la imagen actual (en caso de múltiples imágenes)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efecto para cargar el producto cuando el modal se abre o cambia el productId
  useEffect(() => {
    if (open && productId) {
      setLoading(true);
      getProductById(productId)
        .then((data) => {
          setProduct(data);
          // Si existen varias imágenes, se inicia en el índice 0
          setCurrentImageIndex(0);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error al cargar el producto:', err);
          setError('Error al cargar el producto');
          setLoading(false);
        });
    }
  }, [open, productId]);

  // Funciones para cambiar de imagen si hay varias
  const handlePrevImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  // Renderizado del modal
  return (
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            animation: `${modalZoomIn} 0.6s ease-out`,
            color: '#fff',
            border: '2px solid #ffffff',
            overflow: 'hidden'
          }}
        >
          {/* Botón para cerrar el modal */}
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
              {/* Nombre del producto */}
              <Typography variant="h4" sx={{ mb: 2 }}>{product.name}</Typography>
              
              {/* Sección de imágenes */}
              {product.images && product.images.length > 0 && (
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <img
                    src={`http://localhost:5000/uploads/${product.images[currentImageIndex]}`}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                  {product.images.length > 1 && (
                    <>
                      <Button 
                        onClick={handlePrevImage}
                        variant="contained"
                        color="secondary"
                        sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', minWidth: 'unset', padding: '4px 8px' }}
                      >
                        ‹
                      </Button>
                      <Button 
                        onClick={handleNextImage}
                        variant="contained"
                        color="secondary"
                        sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', minWidth: 'unset', padding: '4px 8px' }}
                      >
                        ›
                      </Button>
                    </>
                  )}
                </Box>
              )}

              {/* Descripción y precio */}
              <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Precio: ${product.price}</Typography>
              
              {/* Mostrar stock y controlar la disponibilidad */}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Producto agotado'}
              </Typography>
              
              {/* Botón para agregar al carrito */}
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ mt: 2 }}
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
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
  );
};

export default ProductDetails;
