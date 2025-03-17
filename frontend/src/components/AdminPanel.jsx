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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  Button,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import EditMovementModal from './EditMovementModal';

// Estilo para campos de texto (Buscar, Desde, Hasta, Tipo y Orden) usando variante "filled"
const customFieldSx = {
  backgroundColor: '#111',
  borderRadius: 1,
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    color: '#fff',
    '&:hover': { backgroundColor: '#222' },
    '&.Mui-focused': { backgroundColor: '#222' },
    '&:after': { borderBottomColor: '#fff' }
  },
  '& .MuiInputLabel-root': { color: '#fff' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' }
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

  // Función para eliminar movimiento
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
              variant="filled"
              fullWidth
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              sx={customFieldSx}
            />
          </Grid>

          {/* Tipo */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="filled" sx={customFieldSx}>
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
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
              variant="filled"
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
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={customFieldSx}
            />
          </Grid>

          {/* Orden */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="filled" sx={customFieldSx}>
              <InputLabel>Orden</InputLabel>
              <Select
                label="Orden"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="desc">Más Reciente</MenuItem>
                <MenuItem value="asc">Más Antiguo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Botón Refrescar */}
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              onClick={fetchMovements}
              sx={{
                height: '60px',
                backgroundColor: '#f50057',
                color: '#fff',
                '&:hover': { backgroundColor: '#c51162' }
              }}
            >
              Refrescar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen estadístico */}
      <Card sx={{ mb: 4, p: 2, backgroundColor: '#1e1e1e' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
          Resumen de Movimientos
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ color: '#fff' }}>
            <strong>Total Movimientos:</strong> {totalMovements}
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff' }}>
            <strong>Total Ingresos:</strong> {totalIngresos}
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff' }}>
            <strong>Total Egresos:</strong> {totalEgresos}
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff' }}>
            <strong>Cambio Neto:</strong> {netChange}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleDownloadXLS}
            sx={{
              backgroundColor: '#f50057',
              color: '#fff',
              '&:hover': { backgroundColor: '#c51162' }
            }}
          >
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
                <TableCell sx={{ color: mov.type === 'egreso' ? '#ff5252' : '#69f0ae' }}>
                  {mov.quantity}
                </TableCell>
                <TableCell sx={{ color: '#fff' }}>{mov.type}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{mov.description}</TableCell>
                <TableCell sx={{ color: '#fff' }}>
                  {mov.user?.name || mov.user || 'N/A'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Ícono Editar */}
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: '#f50057',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#c51162' }
                      }}
                      onClick={() => handleOpenEdit(mov)}
                    >
                      <EditIcon />
                    </IconButton>

                    {/* Ícono Borrar */}
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: '#f50057',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#c51162' }
                      }}
                      onClick={() => handleDelete(mov._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
