require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const agendaRoutes = require('./routes/agenda.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API de Agenda Diaria',
    version: '1.0.0',
    endpoints: {
      'GET /api/agenda': 'Obtener todas las actividades',
      'GET /api/agenda/:id': 'Obtener una actividad por ID',
      'POST /api/agenda': 'Crear nueva actividad',
      'PUT /api/agenda/:id': 'Actualizar actividad',
      'DELETE /api/agenda/:id': 'Eliminar actividad'
    }
  });
});

app.use('/api/agenda', agendaRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Entorno: ${process.env.NODE_ENV}`);
});

module.exports = app;
