const express = require('express');
const router = express.Router();
const { AgendaRepository } = require('../models/AgendaItem');

const repository = new AgendaRepository();

// GET /api/agenda - Obtener todas las actividades
router.get('/', async (req, res, next) => {
  try {
    const items = await repository.findAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// GET /api/agenda/:id - Obtener una actividad por ID
router.get('/:id', async (req, res, next) => {
  try {
    const item = await repository.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST /api/agenda - Crear nueva actividad
router.post('/', async (req, res, next) => {
  try {
    const newItem = await repository.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// PUT /api/agenda/:id - Actualizar actividad
router.put('/:id', async (req, res, next) => {
  try {
    const updatedItem = await repository.update(req.params.id, req.body);
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/agenda/:id - Eliminar actividad
router.delete('/:id', async (req, res, next) => {
  try {
    await repository.delete(req.params.id);
    res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
