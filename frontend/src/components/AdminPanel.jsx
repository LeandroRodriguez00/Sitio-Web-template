// src/components/AdminPanel.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import EditMovementModal from './EditMovementModal';

// Estilo para campos "Buscar Producto", "Desde" y "Hasta"
const customFieldSx = {
  backgroundColor: '#fff',
  height: '60px',
  '& .MuiOutlinedInput-root': { height: '60px' },
  '& .MuiFormLabel-root': {
    color: '#fff',
    backgroundColor: '#1e1e1e',
    padding: '0 4px'
  },
  '& .MuiFormLabel-root.MuiInputLabel-shrink': {
    color: '#fff',
    backgroundColor: '#1e1e1e'
  }
};

// Estilo para campos "Tipo" y "Orden" con etiqueta fucsia (#9c27b0)
const fuchsiaFieldSx = {
  backgroundColor: '#fff',
  height: '60px',
  '& .MuiOutlinedInput-root': { height: '60px' },
  '& .MuiFormLabel-root': {
    color: '#9c27b0',
    backgroundColor: '#fff',
    padding: '0 4px'
  },
  '& .MuiFormLabel-root.MuiInputLabel-shrink': {
    color: '#9c27b0',
    backgroundColor: '#fff'
  }
};

const AdminPanel = () => {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  // Filtros y estado para controles
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = más reciente, 'asc' = más antiguo

  // Estados para editar movimiento
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Función para obtener movimientos de stock
  const fetchMovements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/stock-movements', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovements(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener movimientos de stock:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
    // eslint-disable-next-line
  }, []);

  // Filtrar y ordenar movimientos
  useEffect(() => {
    let data = [...movements];
    if (filterType !== 'all') {
      data = data.filter((mov) => mov.type === filterType);
    }
    if (productSearch) {
      data = data.filter((mov) =>
        mov.product?.name.toLowerCase().includes(productSearch.toLowerCase())
      );
    }
    if (startDate) {
      data = data.filter((mov) => new Date(mov.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter((mov) => new Date(mov.createdAt) <= new Date(endDate));
    }
    data.sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setFilteredMovements(data);
  }, [movements, filterType, productSearch, startDate, endDate, sortOrder]);

  // Cálculo de estadísticas
  const totalMovements = filteredMovements.length;
  const totalIngresos = filteredMovements
    .filter((mov) => mov.type === 'ingreso')
    .reduce((sum, mov) => sum + mov.quantity, 0);
  const totalEgresos = filteredMovements
    .filter((mov) => mov.type === 'egreso')
    .reduce((sum, mov) => sum + mov.quantity, 0);
  const netChange = totalIngresos + totalEgresos;

  // Función para descargar el informe XLS
  const handleDownloadXLS = () => {
    const xlsData = filteredMovements.map((mov) => ({
      Fecha: new Date(mov.createdAt).toLocaleString(),
      Producto: mov.product?.name || 'N/A',
      Cantidad: mov.quantity,
      Tipo: mov.type,
      Descripción: mov.description || '',
      Usuario: mov.user?.name || mov.user || 'N/A'
    }));
    const worksheet = XLSX.utils.json_to_sheet(xlsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Movimientos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'movimientos_stock.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para eliminar movimiento (actualización suave)
  const handleDelete = async (movementId) => {
    try {
      await axios.delete(`http://localhost:5000/api/stock-movements/${movementId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovements((prev) => prev.filter((mov) => mov._id !== movementId));
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
    }
  };

  // Funciones para editar movimiento
  const handleOpenEdit = (movement) => {
    setSelectedMovement(movement);
    setEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedMovement(null);
    setEditModalOpen(false);
  };

  // Actualización suave: actualizar el movimiento en el estado local con el objeto actualizado
  const handleMovementUpdated = (updatedMovement) => {
    setMovements((prev) =>
      prev.map((mov) =>
        mov._id === updatedMovement._id ? updatedMovement : mov
      )
    );
    handleCloseEdit();
  };

  if (loading) {
    return (
      <CircularProgress sx={{ display: 'block', margin: '0 auto', mt: 4 }} />
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center', color: '#fff' }}>
        Panel de Administración - Movimientos de Stock
      </Typography>

      {/* Sección de filtros y controles */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e1e1e' }}>
        <Grid container spacing={2} alignItems="center">
          {/* Buscar Producto */}
          <Grid item xs={12} md={3}>
            <TextField
              label="Buscar Producto"
              variant="outlined"
              fullWidth
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              sx={customFieldSx}
            />
          </Grid>

          {/* Tipo con estilo fucsia */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#fff', height: '60px', '& .MuiOutlinedInput-root': { height: '60px' } }}>
              <InputLabel sx={{ lineHeight: '60px', color: '#9c27b0' }}>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                sx={{ height: '60px' }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Egreso</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Desde */}
          <Grid item xs={12} md={2}>
            <TextField
              label="Desde"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={customFieldSx}
            />
          </Grid>

          {/* Hasta */}
          <Grid item xs={12} md={2}>
            <TextField
              label="Hasta"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={customFieldSx}
            />
          </Grid>

          {/* Orden con estilo fucsia */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#fff', height: '60px', '& .MuiOutlinedInput-root': { height: '60px' } }}>
              <InputLabel sx={{ lineHeight: '60px', color: '#9c27b0' }}>Orden</InputLabel>
              <Select
                label="Orden"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{ height: '60px' }}
              >
                <MenuItem value="desc">Más Reciente</MenuItem>
                <MenuItem value="asc">Más Antiguo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botón Refrescar (fucsia) */}
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchMovements}
              sx={{ height: '60px' }}
            >
              Refrescar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen estadístico */}
      <Card sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Resumen de Movimientos
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Typography variant="body1">
            <strong>Total Movimientos:</strong> {totalMovements}
          </Typography>
          <Typography variant="body1">
            <strong>Total Ingresos:</strong> {totalIngresos}
          </Typography>
          <Typography variant="body1">
            <strong>Total Egresos:</strong> {totalEgresos}
          </Typography>
          <Typography variant="body1">
            <strong>Cambio Neto:</strong> {netChange}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleDownloadXLS}>
            Descargar XLS
          </Button>
        </Box>
      </Card>

      {/* Tabla de movimientos */}
      <Paper sx={{ width: '100%', overflow: 'auto', backgroundColor: '#1e1e1e' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#fff' }}>Fecha</TableCell>
              <TableCell sx={{ color: '#fff' }}>Producto</TableCell>
              <TableCell sx={{ color: '#fff' }}>Cantidad</TableCell>
              <TableCell sx={{ color: '#fff' }}>Tipo</TableCell>
              <TableCell sx={{ color: '#fff' }}>Descripción</TableCell>
              <TableCell sx={{ color: '#fff' }}>Usuario</TableCell>
              <TableCell sx={{ color: '#fff' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMovements.map((mov) => (
              <TableRow key={mov._id}>
                <TableCell sx={{ color: '#fff' }}>
                  {new Date(mov.createdAt).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>
                  {mov.product?.name || 'N/A'}
                </TableCell>
                <TableCell
                  sx={{
                    color: mov.type === 'egreso' ? '#ff5252' : '#69f0ae',
                  }}
                >
                  {mov.quantity}
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{mov.type}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{mov.description}</TableCell>
                <TableCell sx={{ color: '#fff' }}>
                  {mov.user?.name || mov.user || 'N/A'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenEdit(mov)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="secondary"
                      onClick={() => handleDelete(mov._id)}
                    >
                      Borrar
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {filteredMovements.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: '#fff' }}>
          No se encontraron movimientos con los filtros aplicados.
        </Typography>
      )}

      {/* Modal para Editar Movimiento */}
      {selectedMovement && (
        <EditMovementModal
          open={editModalOpen}
          onClose={handleCloseEdit}
          movement={selectedMovement}
          onMovementUpdated={handleMovementUpdated}
        />
      )}
    </Container>
  );
};

export default AdminPanel;
