import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../services/productService';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

// Animación de borde neón blanco
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado local: guardamos stock pero NO lo mostramos
  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: '',
    price: '',
    category: '',
    available: true,
    stock: 0, // Se mantendrá internamente
  });

  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar el producto al montar
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        // Asegúrate de que data.stock sea numérico
        // Si en la BD es string, conviértelo a número
        const numericStock = Number(data.stock) || 0;

        setProduct({
          name: data.name,
          description: data.description,
          images: data.images?.[0] || '',
          price: data.price,
          category: data.category,
          available: data.available,
          stock: numericStock,
        });
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Manejo de campos (sin mostrar stock)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setProduct((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo de archivo
  const handleFileChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };
  const handleRemoveNewImage = () => setNewImageFile(null);
  const handleRemoveCurrentImage = () => {
    setProduct((prev) => ({ ...prev, images: '' }));
  };

  // Cancelar
  const handleCancel = () => {
    navigate('/products');
  };

  // Submit con FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const dataToSend = new FormData();
      dataToSend.append('name', product.name);
      dataToSend.append('description', product.description);
      dataToSend.append('price', product.price);
      dataToSend.append('category', product.category);
      dataToSend.append('available', product.available);

      // Asegúrate de enviar stock como número en forma de cadena
      // Ejemplo: '5'
      dataToSend.append('stock', String(product.stock));

      if (newImageFile) {
        dataToSend.append('images', newImageFile);
      } else {
        dataToSend.append('images', product.images.trim());
      }

      const updated = await updateProduct(id, dataToSend, token);
      setSuccess(`Producto actualizado: ${updated.name}`);
      setError('');
      navigate('/products', { state: { refresh: true } });
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError(err.response?.data?.message || 'Error al actualizar el producto');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
        <Card
          sx={{
            width: { xs: '100%', sm: 400 },
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(3px)',
            border: '2px solid #ffffff',
            animation: `${neonBorderWhite} 1.5s infinite alternate`,
            boxShadow: 'none',
            color: '#fff'
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Actualizar Producto
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={product.name}
                onChange={handleChange}
                variant="filled"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={product.description}
                onChange={handleChange}
                variant="filled"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />

              {newImageFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2">
                    Archivo seleccionado: {newImageFile.name}
                  </Typography>
                  <IconButton onClick={handleRemoveNewImage} sx={{ ml: 1 }}>
                    <CloseIcon sx={{ color: '#f44336' }} />
                  </IconButton>
                </Box>
              ) : product.images ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2">
                    Imagen actual: {product.images}
                  </Typography>
                  <IconButton onClick={handleRemoveCurrentImage} sx={{ ml: 1 }}>
                    <CloseIcon sx={{ color: '#f44336' }} />
                  </IconButton>
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    sx={{
                      ml: 1,
                      mt: 0,
                      fontSize: '0.8rem',
                      padding: '6px 12px'
                    }}
                  >
                    Cambiar Imagen
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  color="secondary"
                  sx={{ mt: 1, alignSelf: 'flex-start' }}
                >
                  Subir Imagen
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              )}

              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                variant="filled"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              <TextField
                fullWidth
                label="Categoría"
                name="category"
                value={product.category}
                onChange={handleChange}
                variant="filled"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />

              {/* No mostramos stock, pero se envía */}
              {/* dataToSend.append('stock', String(product.stock)); */}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" color="secondary">
                  Actualizar Producto
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
              </Box>
            </Box>
            {error && (
              <Typography variant="body2" sx={{ mt: 2, color: '#f44336' }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography variant="body2" sx={{ mt: 2, color: '#4caf50' }}>
                {success}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default UpdateProduct;
