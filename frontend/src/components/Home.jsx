import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Fade
} from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import ContactModal from './ContactModal';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Animación de borde neón blanco
const neonBorderWhite = keyframes`
  0% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
  50% { box-shadow: 0 0 15px #ffffff, 0 0 25px #ffffff, 0 0 35px #ffffff; }
  100% { box-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff; }
`;

// Animación de pulso para el ícono de WhatsApp
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Home = () => {
  const [openContact, setOpenContact] = useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  return (
    <>
      <Fade in={true} timeout={1000}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Sección Hero con borde neón animado */}
          <Box
            sx={{
              background: 'url(/hero-image.jpg) no-repeat center center',
              backgroundSize: 'cover',
              height: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              textAlign: 'center',
              p: 4,
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              border: '2px solid #ffffff',
              animation: `${neonBorderWhite} 1.5s infinite alternate`
            }}
          >
            <Box>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bienvenido a TiendaX
              </Typography>
              <Typography variant="h5" component="p" gutterBottom>
                Descubre productos innovadores y de alta calidad
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mt: 2 }}
              >
                Explorar Productos
              </Button>
            </Box>
          </Box>

          {/* Sección de Características */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              ¿Por qué elegirnos?
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://via.placeholder.com/150"
                    alt="Calidad Superior"
                    sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Calidad Superior
                    </Typography>
                    <Typography variant="body2">
                      Nuestros productos están elaborados con materiales de la más alta calidad.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://via.placeholder.com/150"
                    alt="Innovación"
                    sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Innovación
                    </Typography>
                    <Typography variant="body2">
                      Estamos a la vanguardia en tecnología y diseño para ofrecerte lo mejor.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://via.placeholder.com/150"
                    alt="Atención 24/7"
                    sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Atención 24/7
                    </Typography>
                    <Typography variant="body2">
                      Nuestro equipo de soporte está disponible para ayudarte en todo momento.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sección de Testimonios */}
          <Box sx={{ mt: 6, py: 4, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 2 }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
              Testimonios
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      "TiendaX cambió mi forma de comprar. Los productos son excepcionales y el servicio insuperable."
                    </Typography>
                    <Typography variant="subtitle1" align="right" sx={{ fontWeight: 'bold' }}>
                      - Juan Pérez
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      "La innovación y calidad de TiendaX son de otro nivel. ¡Recomiendo este sitio a todos!"
                    </Typography>
                    <Typography variant="subtitle1" align="right" sx={{ fontWeight: 'bold' }}>
                      - María García
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sección del Mapa Incrustado */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ubicación
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <iframe
                title="Ubicación TiendaX"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0167125041003!2d-58.386334003210415!3d-34.6037389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1741489576374!5m2!1ses!2sar"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>

          {/* Sección de Contacto */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contáctanos
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ¿Tienes alguna pregunta? ¡Estamos aquí para ayudarte!
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpenContact}>
              Enviar Mensaje
            </Button>
          </Box>
        </Container>
      </Fade>
      <ContactModal open={openContact} handleClose={handleCloseContact} />

      {/* Ícono flotante de WhatsApp con animación de pulso */}
      <Box
        component="a"
        href="https://wa.me/+5491167600341" // Reemplaza "1234567890" por tu número en formato internacional
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#25D366',
          borderRadius: '50%',
          padding: 1.5,
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          zIndex: 1000,
          cursor: 'pointer',
          color: '#fff',
          animation: `${pulse} 2s infinite ease-in-out`
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 40 }} />
      </Box>
    </>
  );
};

export default Home;
