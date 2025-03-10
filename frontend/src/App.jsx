import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Modal,
  Backdrop,
  Fade
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { keyframes } from '@emotion/react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import UpdateProduct from './components/UpdateProduct';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Animación para el zoom del modal
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

function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, logout } = useContext(AuthContext);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Definir los enlaces del navbar según el estado del usuario
  let navLinks = [];
  if (!user) {
    navLinks = [
      { title: 'Registro', path: '/register' },
      { title: 'Login', path: '/login' },
      { title: 'Productos', path: '/products' }
    ];
  } else {
    navLinks = [{ title: 'Productos', path: '/products' }];
    if (user.role && user.role.toLowerCase() === 'admin') {
      navLinks.push({ title: 'Crear Producto', path: '/products/create' });
    }
  }

  const drawerList = (
    <Box
      sx={{
        width: 250,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: '100%',
        border: 'none'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem button key={link.title} component={Link} to={link.path}>
            <ListItemText primary={link.title} sx={{ color: '#fff' }} />
          </ListItem>
        ))}
        {user && (
          <ListItem button onClick={logout}>
            <ListItemText primary="Cerrar sesión" sx={{ color: '#fff' }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/abstract-bg2.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000',
        color: '#fff',
        overflowX: 'hidden'
      }}
    >
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                Mi Aplicación Profesional {user ? `- Bienvenido ${user.name}` : ''}
              </Typography>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                  '& .MuiDrawer-paper': { backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }
                }}
              >
                {drawerList}
              </Drawer>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer'
                }}
              >
                Mi Aplicación Profesional {user ? `- Bienvenido ${user.name}` : ''}
              </Typography>
              {navLinks.map((link) => (
                <Button
                  key={link.title}
                  color="inherit"
                  component={Link}
                  to={link.path}
                  sx={{
                    transition: 'transform 0.3s, color 0.3s',
                    '&:hover': { transform: 'scale(1.05)', color: '#bdbdbd' }
                  }}
                >
                  {link.title}
                </Button>
              ))}
              {user && (
                <Button
                  color="inherit"
                  onClick={logout}
                  sx={{
                    transition: 'transform 0.3s, color 0.3s',
                    '&:hover': { transform: 'scale(1.05)', color: '#bdbdbd' }
                  }}
                >
                  Cerrar sesión
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Modal de Bienvenida */}
      <Modal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 700,
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 1)',
            transition: 'background-color 0.7s ease-in-out'
          }
        }}
      >
        <Fade in={showWelcome} timeout={700}>
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
              🎉 Bienvenido a Nuestra Tienda Online 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#e0e0e0' }}>
              Descubre productos increíbles y disfruta de una experiencia única.
            </Typography>
            <Button variant="contained" color="secondary" onClick={() => setShowWelcome(false)}>
              Continuar al sitio
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Rutas de la aplicación */}
      <Container maxWidth="md" disableGutters sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/products/create"
            element={
              <PrivateRoute>
                <CreateProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/update/:id"
            element={
              <PrivateRoute>
                <UpdateProduct />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Corrección de errores de caché en Vite
if (import.meta.hot) {
  import.meta.hot.decline();
}

export default App;
