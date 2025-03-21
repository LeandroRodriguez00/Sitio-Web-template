import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Fade,
  Modal,
  Backdrop
} from '@mui/material';
import { keyframes } from '@emotion/react';

// Animación de zoom para la entrada del modal
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

// Efecto de neón blanco para el borde (aplicado al contenedor principal)
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await registerUser(formData);
      setError('');
      setOpenModal(true); // Abre el modal de registro exitoso

      // Limpia el formulario
      setFormData({ name: '', email: '', password: '' });

      // Después de 4 segundos, cierra el modal y redirige al login
      setTimeout(() => {
        setOpenModal(false);
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                Registro
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
                  value={formData.name}
                  onChange={handleChange}
                  variant="filled"
                  sx={{
                    backgroundColor: '#111',
                    color: '#fff',
                    borderRadius: 1,
                    border: '1px solid #fff',
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                    '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                    '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                    '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
                    '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="filled"
                  sx={{
                    backgroundColor: '#111',
                    color: '#fff',
                    borderRadius: 1,
                    border: '1px solid #fff',
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                    '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                    '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                    '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
                    '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="filled"
                  sx={{
                    backgroundColor: '#111',
                    color: '#fff',
                    borderRadius: 1,
                    border: '1px solid #fff',
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                    '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                    '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                    '& .MuiFilledInput-root:hover': { backgroundColor: '#222' },
                    '& .Mui-focused .MuiFilledInput-root': { backgroundColor: '#222' }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    mt: 1,
                    alignSelf: 'flex-start',
                    transition: 'transform 0.3s'
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                  ) : (
                    'Registrarse'
                  )}
                </Button>
              </Box>
              {error && (
                <Typography variant="body2" sx={{ mt: 2, color: '#f44336' }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Modal de Registro Exitoso con diseño neón blanco */}
      <Modal
        open={openModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }}
      >
        <Fade in={openModal} timeout={600}>
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
              🎉 Registro Exitoso! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              Serás redirigido al inicio de sesión en unos segundos.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default RegisterForm;
