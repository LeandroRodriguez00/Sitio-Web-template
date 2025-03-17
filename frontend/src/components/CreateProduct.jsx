import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Fade,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';

// Animación de borde neón blanco para el contenedor
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Maneja los cambios en los campos de texto
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Captura el archivo seleccionado
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Elimina la imagen seleccionada
  const handleRemoveImage = () => {
    setImageFile(null);
  };

  // Cancela la creación y vuelve a la lista de productos
  const handleCancel = () => {
    navigate('/products');
  };

  // Envía los datos usando FormData para incluir el archivo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Crear un objeto FormData para enviar datos y archivo
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('description', formData.description);
      dataToSend.append('price', formData.price);
      dataToSend.append('category', formData.category);
      dataToSend.append('available', formData.available);

      if (imageFile) {
        dataToSend.append('images', imageFile);
      }

      const newProduct = await createProduct(dataToSend, token);
      setSuccess(`Producto creado: ${newProduct.name}`);
      setError('');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true,
      });
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear producto');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Estilos comunes para los TextField
  const textFieldStyles = {
    backgroundColor: 'transparent',
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      color: '#fff',
      '&:before': { borderBottomColor: '#fff' },
      '&:after': { borderBottomColor: '#fff' },
      '&:hover:before': { borderBottomColor: '#fff' },
      '&.Mui-focused:before': { borderBottomColor: '#fff' },
      '&.Mui-focused:after': { borderBottomColor: '#fff' },
      // No se modifica el fondo al enfocarse:
      '&.Mui-focused': { backgroundColor: 'transparent' },
    },
    '& .MuiInputLabel-root': { color: '#fff' },
    '& .MuiFormHelperText-root': { color: '#e0e0e0' },
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
        <Card
          sx={{
            width: { xs: '100%', sm: 500 },
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
              Crear Producto
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="filled"
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="filled"
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="filled"
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                label="Categoría"
                name="category"
                value={formData.category}
                onChange={handleChange}
                variant="filled"
                sx={textFieldStyles}
              />
              <Button
                variant="contained"
                component="label"
                color="secondary"
                sx={{ mt: 1, alignSelf: 'flex-start' }}
              >
                Subir Imagen
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              
              {imageFile && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2">
                    Archivo seleccionado: {imageFile.name}
                  </Typography>
                  <IconButton onClick={handleRemoveImage} sx={{ ml: 1 }}>
                    <CloseIcon sx={{ color: '#f44336' }} />
                  </IconButton>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                  ) : (
                    'Crear Producto'
                  )}
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

export default CreateProduct;
