// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { 
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Modal,
  Fade,
  Backdrop
} from '@mui/material';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Animación de zoom para el modal
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

// Animación de borde neón blanco
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // Llamada a la API para enviar el email de recuperación
      const response = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message);
      setOpenModal(true);
      // Redirigir al login después de 4 segundos
      setTimeout(() => {
        setOpenModal(false);
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              Recuperar Contraseña
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
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
                sx={{ mt: 1, alignSelf: 'flex-start' }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Enviar Email'
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

      {/* Modal de Confirmación */}
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
              ¡Email Enviado!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              Se ha enviado un email con instrucciones para recuperar tu contraseña.
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              Serás redirigido al login en unos segundos.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ForgotPassword;
