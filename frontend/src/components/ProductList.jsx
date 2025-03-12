// src/components/ProductList.jsx
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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import DeleteProductButton from './DeleteProductButton';
import EditIcon from '@mui/icons-material/Edit';
import ProductDetails from './ProductDetails'; // Modal de detalles
import StockManager from './StockManager'; // Componente para gestionar stock

// Animación para la entrada (fade in + slide up)
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

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

const itemsPerPage = 6;

const ProductList = () => {
  // Estados de productos y carga
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Estados para filtros y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para modales
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
  const [addToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);

  // Obtener productos desde el servicio
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

  // Extraer categorías dinámicamente
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  // Filtros y ordenamiento
  useEffect(() => {
    let result = [...products];
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (sortOption === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alphaAsc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'alphaDesc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOption, products]);

  // Paginación
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Abrir modal de detalles
  const handleOpenDetails = (productId) => {
    setSelectedProductId(productId);
    setDetailsOpen(true);
  };

  // Función para agregar al carrito con modal de confirmación
  const handleAddToCart = (product) => {
    if (!user) {
      setLoginAlertOpen(true);
      return;
    }
    addToCart(product);
    setAddedProduct(product);
    setAddToCartModalOpen(true);
  };

  if (loading) {
    return (
      <CircularProgress
        sx={{ color: '#fff', display: 'block', margin: '0 auto', mt: 4 }}
      />
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Container sx={{ py: 4 }}>
        {/* Filtros y Ordenamiento */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <TextField
            label="Buscar"
            variant="filled"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: '#111',
              color: '#fff',
              borderRadius: 1,
              border: '1px solid #fff',
              '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
              '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' },
            }}
          />

          <FormControl
            variant="filled"
            size="small"
            sx={{
              minWidth: 150,
              backgroundColor: '#111',
              borderRadius: 1,
              border: '1px solid #fff',
              '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
              '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' },
            }}
          >
            <InputLabel>Categoría</InputLabel>
            <Select
              label="Categoría"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ color: '#fff' }}
              MenuProps={{
                sx: {
                  '&& .MuiPaper-root': { backgroundColor: '#111 !important' },
                  '&& .MuiMenuItem-root': { color: '#fff' },
                  '&& .MuiMenuItem-root:hover': { backgroundColor: '#222 !important' },
                  '&& .Mui-selected': { backgroundColor: '#333 !important' },
                  '&& .Mui-selected:hover': { backgroundColor: '#444 !important' },
                },
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="filled"
            size="small"
            sx={{
              minWidth: 150,
              backgroundColor: '#111',
              borderRadius: 1,
              border: '1px solid #fff',
              '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
              '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' },
            }}
          >
            <InputLabel>Ordenar Por</InputLabel>
            <Select
              label="Ordenar Por"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              sx={{ color: '#fff' }}
              MenuProps={{
                sx: {
                  '&& .MuiPaper-root': { backgroundColor: '#111 !important' },
                  '&& .MuiMenuItem-root': { color: '#fff' },
                  '&& .MuiMenuItem-root:hover': { backgroundColor: '#222 !important' },
                  '&& .Mui-selected': { backgroundColor: '#333 !important' },
                  '&& .Mui-selected:hover': { backgroundColor: '#444 !important' },
                },
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>
              <MenuItem value="priceAsc">Precio: Menor a Mayor</MenuItem>
              <MenuItem value="priceDesc">Precio: Mayor a Menor</MenuItem>
              <MenuItem value="alphaAsc">Nombre: A-Z</MenuItem>
              <MenuItem value="alphaDesc">Nombre: Z-A</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Título */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              border: '1px solid #fff',
              borderRadius: 1,
              px: 3,
              py: 1,
              display: 'inline-block',
              animation: `${fadeInUp} 1s ease-out forwards`,
              opacity: 0,
            }}
          >
            Productos Disponibles
          </Typography>
        </Box>

        {/* Lista de Productos */}
        <Grid container spacing={4} justifyContent="center">
          {currentProducts.map((product, index) => {
            const imageUrl =
              product.images && product.images.length > 0
                ? `http://localhost:5000/uploads/${product.images[0]}`
                : 'https://via.placeholder.com/300';

            return (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleOpenDetails(product._id)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#111',
                      border: '1px solid #fff',
                      boxShadow: 'none',
                      transition: 'box-shadow 0.3s ease',
                      animation: `${fadeInUp} 1s ease-out forwards`,
                      animationDelay: `${index * 0.1}s`,
                      opacity: 0,
                      '&:hover': { boxShadow: '0 0 10px rgba(255,255,255,0.3)' },
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
                      {user && user.role.toLowerCase() === 'admin' ? (
                        <>
                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <IconButton
                              component={Link}
                              to={`/products/update/${product._id}`}
                              sx={{
                                color: '#4caf50',
                                backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.3)' },
                                transition: '0.3s',
                                borderRadius: '12px',
                                p: 1.2,
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <DeleteProductButton
                              productId={product._id}
                              onDelete={fetchProducts}
                            />
                          </Box>
                          {/* Contenedor que evita la propagación del clic al abrir el modal */}
                          <Box onClick={(e) => e.stopPropagation()}>
                            <StockManager
                              productId={product._id}
                              currentStock={product.stock}
                              onStockUpdate={(newStock) => {
                                setProducts((prevProducts) =>
                                  prevProducts.map((p) =>
                                    p._id === product._id ? { ...p, stock: newStock } : p
                                  )
                                );
                              }}
                            />
                          </Box>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Agregar al carrito
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Paginación */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ color: '#fff', borderColor: '#fff' }}
            >
              Anterior
            </Button>
            <Typography variant="body1" sx={{ color: '#fff', alignSelf: 'center' }}>
              Página {currentPage} de {totalPages}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ color: '#fff', borderColor: '#fff' }}
            >
              Siguiente
            </Button>
          </Box>
        )}
      </Container>

      {/* Modal de Detalles del Producto */}
      <ProductDetails
        open={detailsOpen}
        handleClose={() => setDetailsOpen(false)}
        productId={selectedProductId}
        onAddToCart={(prod) => {
          console.log('Agregar al carrito:', prod);
          setDetailsOpen(false);
        }}
      />

      {/* Modal de Aviso para Iniciar Sesión */}
      <Modal
        open={loginAlertOpen}
        onClose={() => setLoginAlertOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 700,
          sx: { backgroundColor: 'rgba(0, 0, 0, 1)', transition: 'background-color 0.7s ease-in-out' },
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
              border: '2px solid #ffffff',
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

      {/* Modal de Confirmación de Producto Agregado */}
      <Modal
        open={addToCartModalOpen}
        onClose={() => setAddToCartModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 700,
          sx: { backgroundColor: 'rgba(0, 0, 0, 1)', transition: 'background-color 0.7s ease-in-out' },
        }}
      >
        <Fade in={addToCartModalOpen} timeout={700}>
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
              border: '2px solid #ffffff',
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
              Producto Agregado
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              {addedProduct && addedProduct.name} se ha agregado al carrito.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setAddToCartModalOpen(false)}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ProductList;
