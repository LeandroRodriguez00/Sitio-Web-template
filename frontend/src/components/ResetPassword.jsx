// src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        password
      });
      setMessage(response.data.message);
      // Redirigir al login después de 4 segundos
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, px: 2 }}>
      <Card
        sx={{
          width: { xs: '100%', sm: 400 },
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(3px)',
          border: '2px solid #ffffff',
          boxShadow: 'none',
          color: '#fff'
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Restablecer Contraseña
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: 1,
                border: '1px solid #fff',
                '& .MuiInputLabel-root': { color: '#fff' },
                '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                '& .MuiFilledInput-root:hover': { backgroundColor: '#222' }
              }}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="filled"
              sx={{
                backgroundColor: '#111',
                color: '#fff',
                borderRadius: 1,
                border: '1px solid #fff',
                '& .MuiInputLabel-root': { color: '#fff' },
                '& .MuiFilledInput-root': { backgroundColor: 'transparent', color: '#fff' },
                '& .MuiFilledInput-underline:after': { borderBottomColor: '#fff' },
                '& .MuiFilledInput-root:hover': { backgroundColor: '#222' }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 1, alignSelf: 'flex-start' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Restablecer Contraseña'}
            </Button>
          </Box>
          {message && (
            <Typography variant="body2" sx={{ mt: 2, color: message.includes('Error') ? '#f44336' : '#4caf50' }}>
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
