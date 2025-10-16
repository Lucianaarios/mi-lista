 Agenda Diaria
Una aplicación web moderna para organizar tu día, construida con Angular. Permite planificar actividades por hora y llevar un control de tu progreso diario.

✨ Características
Planificación de actividades por hora específica

Sistema de categorías (trabajo, estudio, salud, etc.)

Niveles de prioridad (alta, media, baja)

Seguimiento de progreso del día

Diseño responsive y moderno

Estadísticas en tiempo real

🚀 Tecnologías

### Frontend
Angular 19+

TypeScript 5.7+

CSS3

HTML5

RxJS

### Backend
Node.js

Express.js

JSON file storage

📦 Instalación

### Opción 1: Inicio Rápido

Ver [INICIO_RAPIDO.md](INICIO_RAPIDO.md) para una guía detallada paso a paso.

### Opción 2: Instalación Manual

bash
# Clonar el repositorio
git clone https://github.com/Lucianaarios/mi-lista.git

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Terminal 1 - Iniciar backend
cd backend && npm start

# Terminal 2 - Iniciar frontend
ng serve

La aplicación estará disponible en http://localhost:4200
El backend API estará en http://localhost:3000

🎯 Uso
Agregar actividades: Completa hora, título, categoría y descripción

Organizar: Las actividades se ordenan automáticamente por hora

Seguimiento: Marca actividades como completadas y revisa tu progreso

📝 Comandos

### Frontend
bash
# Desarrollo
ng serve

# Build producción
ng build

# Tests
ng test

### Backend
bash
# Servidor normal
cd backend && npm start

# Servidor con auto-reload
cd backend && npm run dev

### API Endpoints
- GET /api/agenda - Obtener todas las actividades
- POST /api/agenda - Crear actividad
- PUT /api/agenda/:id - Actualizar actividad
- DELETE /api/agenda/:id - Eliminar actividad

Ver [backend/README.md](backend/README.md) para documentación completa de la API.
