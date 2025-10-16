# Guía de Inicio Rápido - Agenda Diaria

Esta guía te ayudará a poner en marcha la aplicación completa (frontend + backend).

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (viene con Node.js)

## Instalación Inicial

### 1. Instalar dependencias del Frontend

```bash
npm install
```

### 2. Instalar dependencias del Backend

```bash
cd backend
npm install
cd ..
```

## Ejecución del Proyecto

Necesitas dos terminales abiertas:

### Terminal 1 - Backend (Puerto 3000)

```bash
cd backend
npm start
```

Verás el mensaje: `✅ Servidor corriendo en http://localhost:3000`

### Terminal 2 - Frontend (Puerto 4200)

```bash
ng serve
```

O también:

```bash
npm start
```

## Acceder a la Aplicación

Una vez que ambos servidores estén corriendo:

1. Abre tu navegador
2. Visita: **http://localhost:4200**
3. ¡Listo! Ya puedes usar tu Agenda Diaria

## Verificar que el Backend funciona

Puedes verificar que el backend está corriendo visitando:
- **http://localhost:3000** - Ver información de la API
- **http://localhost:3000/api/agenda** - Ver todas las actividades en formato JSON

## Solución de Problemas

### Error: "No se pudieron cargar las actividades"

**Causa**: El backend no está corriendo o hay un problema de conexión.

**Solución**:
1. Verifica que el servidor backend esté corriendo (Terminal 1)
2. Verifica que esté en el puerto 3000
3. Presiona el botón "Reintentar" en la aplicación

### Error: "Port 3000 is already in use"

**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:
1. Cierra la aplicación que usa el puerto 3000
2. O cambia el puerto en `backend/.env`:
   ```
   PORT=3001
   ```
3. Y actualiza `src/app/services/agenda.service.ts` con el nuevo puerto

### Error: "Port 4200 is already in use"

**Causa**: Ya hay una instancia de Angular corriendo.

**Solución**:
```bash
ng serve --port 4201
```

## Modo Desarrollo

Para desarrollo, puedes usar nodemon en el backend para auto-reload:

```bash
cd backend
npm run dev
```

## Datos

Los datos se almacenan en `backend/data/agenda.json`. Este archivo:
- Se crea automáticamente la primera vez
- Incluye datos de ejemplo iniciales
- Puedes editarlo manualmente si lo necesitas
- Se actualiza automáticamente cuando usas la aplicación

## Estructura del Proyecto

```
mi-lista/
├── src/                      # Frontend Angular
│   ├── app/
│   │   ├── services/         # Servicio HTTP para API
│   │   ├── app.component.*   # Componente principal
│   │   └── app.config.ts     # Configuración (incluye HttpClient)
│   └── ...
├── backend/                  # Backend Node.js/Express
│   ├── src/
│   │   ├── server.js         # Servidor principal
│   │   ├── routes/           # Rutas de la API
│   │   ├── models/           # Modelos y lógica de datos
│   │   └── middleware/       # Middleware de Express
│   ├── data/                 # Almacenamiento de datos
│   └── package.json
└── README.md
```

## Próximos Pasos

- Personaliza las categorías en `src/app/app.component.ts`
- Ajusta los colores en `src/app/app.component.css`
- Agrega nuevas validaciones en `backend/src/models/AgendaItem.js`
- Extiende la API con nuevos endpoints en `backend/src/routes/agenda.routes.js`
