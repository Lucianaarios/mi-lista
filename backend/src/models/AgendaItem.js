const fs = require('fs').promises;
const path = require('path');

class AgendaItem {
  constructor(data) {
    this.id = data.id || Date.now();
    this.hora = data.hora;
    this.titulo = data.titulo;
    this.descripcion = data.descripcion || '';
    this.completado = data.completado || false;
    this.categoria = data.categoria;
    this.prioridad = data.prioridad || 'media';
  }

  validate() {
    const errors = [];

    if (!this.hora || !/^\d{2}:\d{2}$/.test(this.hora)) {
      errors.push('Hora debe estar en formato HH:MM');
    }

    if (!this.titulo || this.titulo.trim() === '') {
      errors.push('Título es requerido');
    }

    const categoriasValidas = ['trabajo', 'estudio', 'salud', 'rutina', 'ocio', 'compras'];
    if (!this.categoria || !categoriasValidas.includes(this.categoria)) {
      errors.push('Categoría inválida');
    }

    const prioridadesValidas = ['alta', 'media', 'baja'];
    if (!this.prioridad || !prioridadesValidas.includes(this.prioridad)) {
      errors.push('Prioridad inválida');
    }

    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      hora: this.hora,
      titulo: this.titulo,
      descripcion: this.descripcion,
      completado: this.completado,
      categoria: this.categoria,
      prioridad: this.prioridad
    };
  }
}

// Data persistence layer
class AgendaRepository {
  constructor() {
    this.dataFile = path.join(__dirname, '../../data/agenda.json');
  }

  async ensureDataFile() {
    try {
      await fs.access(this.dataFile);
    } catch (error) {
      // File doesn't exist, create with initial data
      const initialData = [
        {
          id: 1,
          hora: '07:00',
          titulo: 'Desayuno y planificación del día',
          descripcion: 'Preparar desayuno saludable y revisar agenda',
          completado: true,
          categoria: 'rutina',
          prioridad: 'alta'
        },
        {
          id: 2,
          hora: '09:00',
          titulo: 'Reunión de equipo',
          descripcion: 'Presentación del proyecto nuevo',
          completado: false,
          categoria: 'trabajo',
          prioridad: 'alta'
        },
        {
          id: 4,
          hora: '13:00',
          titulo: 'Almuerzo y descanso',
          descripcion: 'Comida saludable y caminata corta',
          completado: false,
          categoria: 'salud',
          prioridad: 'media'
        },
        {
          id: 6,
          hora: '18:00',
          titulo: 'Gimnasio',
          descripcion: 'Entrenamiento de fuerza 45min',
          completado: false,
          categoria: 'salud',
          prioridad: 'alta'
        },
        {
          id: 7,
          hora: '20:00',
          titulo: 'Tiempo libre',
          descripcion: 'Leer libro o ver película',
          completado: false,
          categoria: 'ocio',
          prioridad: 'baja'
        }
      ];
      await this.saveData(initialData);
    }
  }

  async readData() {
    await this.ensureDataFile();
    const data = await fs.readFile(this.dataFile, 'utf8');
    return JSON.parse(data);
  }

  async saveData(data) {
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2), 'utf8');
  }

  async findAll() {
    const data = await this.readData();
    return data.sort((a, b) => a.hora.localeCompare(b.hora));
  }

  async findById(id) {
    const data = await this.readData();
    return data.find(item => item.id === parseInt(id));
  }

  async create(itemData) {
    const data = await this.readData();
    const newItem = new AgendaItem(itemData);

    const errors = newItem.validate();
    if (errors.length > 0) {
      throw { statusCode: 400, message: errors.join(', ') };
    }

    data.push(newItem.toJSON());
    await this.saveData(data);
    return newItem.toJSON();
  }

  async update(id, itemData) {
    const data = await this.readData();
    const index = data.findIndex(item => item.id === parseInt(id));

    if (index === -1) {
      throw { statusCode: 404, message: 'Actividad no encontrada' };
    }

    const updatedItem = new AgendaItem({ ...data[index], ...itemData, id: parseInt(id) });

    const errors = updatedItem.validate();
    if (errors.length > 0) {
      throw { statusCode: 400, message: errors.join(', ') };
    }

    data[index] = updatedItem.toJSON();
    await this.saveData(data);
    return updatedItem.toJSON();
  }

  async delete(id) {
    const data = await this.readData();
    const filteredData = data.filter(item => item.id !== parseInt(id));

    if (data.length === filteredData.length) {
      throw { statusCode: 404, message: 'Actividad no encontrada' };
    }

    await this.saveData(filteredData);
    return true;
  }
}

module.exports = { AgendaItem, AgendaRepository };
