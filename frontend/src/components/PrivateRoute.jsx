// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Fade, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ backgroundColor: 'transparent' }}>
        {children}
      </Box>
    </Fade>
  );
};

export default PrivateRoute;
