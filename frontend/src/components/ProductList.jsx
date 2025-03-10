import React, { useState, useEffect, useContext } from 'react';
import { getAllProducts } from '../services/productService';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Fade
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DeleteProductButton from './DeleteProductButton';
import EditIcon from '@mui/icons-material/Edit';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const neonBorder = keyframes`
  0% { box-shadow: 0 0 1px #ffffff, 0 0 2px #ffffff, 0 0 3px #ffffff; }
  50% { box-shadow: 0 0 2px #ffffff, 0 0 3px #ffffff, 0 0 4px #ffffff; }
  100% { box-shadow: 0 0 1px #ffffff, 0 0 2px #ffffff, 0 0 3px #ffffff; }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar productos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.state]);

  if (loading)
    return (
      <CircularProgress
        sx={{ color: '#fff', display: 'block', margin: '0 auto', mt: 4 }}
      />
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Fade in={true} timeout={1000}>
      <Container sx={{ py: 4 }}>
        {/* Título centrado */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              border: '2px solid #ffffff',
              borderRadius: 2,
              px: 3,
              py: 1,
              display: 'inline-block',
              animation: `${neonBorder} 2s infinite alternate`,
            }}
          >
            Productos Disponibles
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {products.map((product, index) => {
            const imageUrl =
              product.images && product.images.length > 0
                ? `http://localhost:5000/uploads/${product.images[0]}`
                : 'https://via.placeholder.com/300';

            return (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                {/* Contenedor que aplica el hover para escalar */}
                <Box
                  sx={{
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '2px solid #ffffff',
                      boxShadow: 'none',
                      transition: 'box-shadow 0.3s ease',
                      animation: `${fadeInUp} 1s ease-out forwards, ${neonBorder} 2s infinite alternate`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      '&:hover': {
                        boxShadow: '0 0 15px rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={product.name}
                      sx={{ height: 200, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, color: '#fff' }}>
                      <Typography gutterBottom variant="h6" component="h2">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Precio: ${product.price}
                      </Typography>
                      <Typography variant="body2">
                        {product.description.substring(0, 100)}...
                      </Typography>
                      {user && user.role.toLowerCase() === 'admin' && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <IconButton
                            component={Link}
                            to={`/products/update/${product._id}`}
                            sx={{
                              color: '#4caf50',
                              backgroundColor: 'rgba(76, 175, 80, 0.15)',
                              '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.3)',
                              },
                              transition: '0.3s',
                              borderRadius: '12px',
                              p: 1.2,
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <DeleteProductButton productId={product._id} onDelete={fetchProducts} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Fade>
  );
};

export default ProductList;
