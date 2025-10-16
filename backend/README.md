# Backend API - Agenda Diaria

Backend REST API para la aplicación de Agenda Diaria.

## Instalación

```bash
npm install
```

## Configuración

El archivo `.env` contiene la configuración:
```
PORT=3000
NODE_ENV=development
```

## Ejecución

```bash
# Modo producción
npm start

# Modo desarrollo con auto-reload
npm run dev
```

## Endpoints API

### Base URL
`http://localhost:3000`

### Endpoints

#### GET /
Información general de la API

#### GET /api/agenda
Obtener todas las actividades

**Response**: Array de AgendaItem

#### GET /api/agenda/:id
Obtener una actividad específica

**Params**: `id` - ID de la actividad

**Response**: AgendaItem

#### POST /api/agenda
Crear nueva actividad

**Body**:
```json
{
  "hora": "14:00",
  "titulo": "Título de actividad",
  "descripcion": "Descripción opcional",
  "categoria": "trabajo",
  "prioridad": "media"
}
```

**Response**: AgendaItem creado

#### PUT /api/agenda/:id
Actualizar actividad

**Params**: `id` - ID de la actividad

**Body**: Campos a actualizar (partial)

**Response**: AgendaItem actualizado

#### DELETE /api/agenda/:id
Eliminar actividad

**Params**: `id` - ID de la actividad

**Response**: `{ message: "Actividad eliminada correctamente" }`

## Validaciones

- **hora**: Formato HH:MM requerido
- **titulo**: Campo obligatorio, no vacío
- **categoria**: Debe ser una de: trabajo, estudio, salud, rutina, ocio, compras
- **prioridad**: Debe ser una de: alta, media, baja

## Estructura de Datos

```typescript
interface AgendaItem {
  id: number;
  hora: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  categoria: string;
  prioridad: 'alta' | 'media' | 'baja';
}
```

## Persistencia

Los datos se almacenan en `data/agenda.json`. El archivo se crea automáticamente con datos iniciales si no existe.
