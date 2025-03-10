// src/components/ContactModal.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Fade, 
  Modal, 
  Backdrop 
} from '@mui/material';
import { keyframes } from '@emotion/react';
import axios from 'axios';

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

// Efecto de neón blanco para el borde
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

const ContactModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Se envía la información del formulario a un endpoint configurado para enviar el email.
      // El endpoint deberá encargarse de enviar el email a un destinatario predefinido.
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
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
          {success ? (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                ¡Mensaje Enviado!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Nos pondremos en contacto contigo pronto.
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Contáctanos
              </Typography>
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate 
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <TextField 
                  fullWidth
                  variant="filled"
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />
                <TextField 
                  fullWidth
                  variant="filled"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />
                <TextField 
                  fullWidth
                  variant="filled"
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />
                <TextField 
                  fullWidth
                  variant="filled"
                  label="Mensaje"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </Box>
              {error && (
                <Typography variant="body2" sx={{ mt: 2, color: '#f44336' }}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ContactModal;
