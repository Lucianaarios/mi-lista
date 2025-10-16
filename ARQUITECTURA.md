# Arquitectura del Proyecto - Agenda Diaria

## Visión General

Este es un proyecto full-stack que combina Angular (frontend) con Node.js/Express (backend) para crear una aplicación de gestión de agenda diaria.

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO                           │
│               (Navegador Web)                       │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND (Angular)                     │
│              Puerto: 4200                           │
├─────────────────────────────────────────────────────┤
│  • AppComponent (UI Principal)                      │
│  • AgendaService (HTTP Client)                      │
│  • RxJS Observables                                 │
│  • Template-driven Forms                            │
└────────────────────┬────────────────────────────────┘
                     │
                     │ REST API Calls
                     │ (http://localhost:3000)
                     ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Express)                      │
│              Puerto: 3000                           │
├─────────────────────────────────────────────────────┤
│  • server.js (Express App)                          │
│  • agenda.routes.js (REST Endpoints)                │
│  • AgendaRepository (Data Layer)                    │
│  • AgendaItem Model (Validation)                    │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Read/Write
                     ▼
┌─────────────────────────────────────────────────────┐
│          PERSISTENCIA (File System)                 │
│          backend/data/agenda.json                   │
└─────────────────────────────────────────────────────┘
```

## Frontend - Angular

### Estructura de Componentes

```
AppComponent (src/app/app.component.ts)
├── Header (Título y fecha)
├── Loading/Error States
├── Statistics Cards
│   ├── Total Activities
│   ├── Pending Tasks
│   ├── Completed Tasks
│   └── Next Activity
├── Category Filters
├── Add Activity Form
│   ├── Time Input
│   ├── Title Input
│   ├── Category Select
│   ├── Priority Select
│   └── Description Textarea
└── Activity Timeline
    └── Activity Items
        ├── Time Display
        ├── Priority Badge
        ├── Checkbox (toggle completion)
        ├── Title & Category
        └── Delete Button
```

### Servicios

**AgendaService** (src/app/services/agenda.service.ts)
- Encapsula todas las llamadas HTTP al backend
- Métodos:
  - `getAll()`: Observable<AgendaItem[]>
  - `getById(id)`: Observable<AgendaItem>
  - `create(item)`: Observable<AgendaItem>
  - `update(id, item)`: Observable<AgendaItem>
  - `delete(id)`: Observable<{ message: string }>

### Flujo de Datos

1. **Carga Inicial**:
   ```
   ngOnInit() → cargarItems() → agendaService.getAll() → agendaItems[]
   ```

2. **Crear Actividad**:
   ```
   User Input → agregarItem() → agendaService.create() →
   Success → Update local array → Reset form
   ```

3. **Marcar Completada**:
   ```
   Checkbox Click → toggleCompletado() → agendaService.update() →
   Success → Update item.completado
   ```

4. **Eliminar Actividad**:
   ```
   Delete Button → eliminarItem() → agendaService.delete() →
   Success → Filter array
   ```

## Backend - Node.js/Express

### Estructura de Archivos

```
backend/
├── src/
│   ├── server.js              # Punto de entrada, config Express
│   ├── routes/
│   │   └── agenda.routes.js   # Definición de endpoints REST
│   ├── models/
│   │   └── AgendaItem.js      # Modelo + Repository + Validación
│   └── middleware/
│       └── errorHandler.js    # Manejo centralizado de errores
├── data/
│   └── agenda.json            # Almacenamiento de datos
├── .env                       # Variables de entorno
└── package.json
```

### API REST Endpoints

| Método | Endpoint | Descripción | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /api/agenda | Lista todas las actividades | - | AgendaItem[] |
| GET | /api/agenda/:id | Obtiene una actividad | - | AgendaItem |
| POST | /api/agenda | Crea nueva actividad | AgendaItem (sin id) | AgendaItem |
| PUT | /api/agenda/:id | Actualiza actividad | Partial<AgendaItem> | AgendaItem |
| DELETE | /api/agenda/:id | Elimina actividad | - | { message } |

### Capa de Datos

**AgendaRepository** (backend/src/models/AgendaItem.js)
- Abstrae la persistencia de datos
- Métodos:
  - `findAll()`: Lee todas las actividades del JSON
  - `findById(id)`: Busca actividad por ID
  - `create(itemData)`: Valida y crea nueva actividad
  - `update(id, itemData)`: Valida y actualiza actividad
  - `delete(id)`: Elimina actividad del JSON
- Funciones helper:
  - `ensureDataFile()`: Crea archivo con datos iniciales si no existe
  - `readData()`: Lee y parsea JSON
  - `saveData(data)`: Escribe datos al JSON

### Validación

**AgendaItem Model** (backend/src/models/AgendaItem.js)
```javascript
validate() {
  // Valida:
  - Formato de hora (HH:MM)
  - Título no vacío
  - Categoría válida (trabajo, estudio, salud, rutina, ocio, compras)
  - Prioridad válida (alta, media, baja)

  // Retorna: array de errores (vacío si es válido)
}
```

### Middleware Stack

```
Request
  ↓
CORS (permite requests desde localhost:4200)
  ↓
body-parser (parsea JSON)
  ↓
Logging (registra requests)
  ↓
Routes (agenda.routes.js)
  ↓
Error Handler (captura errores)
  ↓
Response
```

## Persistencia de Datos

### Formato JSON (backend/data/agenda.json)

```json
[
  {
    "id": 1,
    "hora": "07:00",
    "titulo": "Desayuno y planificación del día",
    "descripcion": "Preparar desayuno saludable y revisar agenda",
    "completado": true,
    "categoria": "rutina",
    "prioridad": "alta"
  }
]
```

### Características:
- **Lectura**: Síncrona en cada request
- **Escritura**: Inmediata después de cada modificación
- **Formato**: Pretty-printed (2 espacios de indentación)
- **Backup**: No implementado (considera versionarlo con Git)
- **Concurrencia**: No hay locks (suficiente para uso single-user)

## Comunicación Frontend-Backend

### CORS Configuration

```javascript
// backend/src/server.js
cors({
  origin: 'http://localhost:4200',  // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

### Error Handling

**Frontend**:
```typescript
agendaService.create(item).subscribe({
  next: (item) => { /* success */ },
  error: (err) => { /* mostrar mensaje de error */ }
})
```

**Backend**:
```javascript
try {
  // operación
} catch (error) {
  next(error);  // pasa al error handler
}
```

## Flujo de Desarrollo

### Agregar Nueva Funcionalidad

1. **Backend**:
   - Definir endpoint en `agenda.routes.js`
   - Agregar lógica en `AgendaRepository`
   - Agregar validación en `AgendaItem`

2. **Frontend**:
   - Agregar método en `AgendaService`
   - Implementar UI en `AppComponent`
   - Actualizar template HTML
   - Agregar estilos en CSS

3. **Pruebas**:
   - Probar endpoints con `test-api.http`
   - Probar UI en navegador
   - Verificar manejo de errores

## Mejoras Futuras Posibles

### Corto Plazo:
- [ ] Agregar paginación en la lista de actividades
- [ ] Implementar búsqueda/filtro por texto
- [ ] Agregar notificaciones de éxito/error más elegantes
- [ ] Exportar agenda a PDF o Excel

### Mediano Plazo:
- [ ] Autenticación de usuarios (JWT)
- [ ] Múltiples agendas/calendarios
- [ ] Recordatorios y notificaciones
- [ ] Vista de calendario (mensual/semanal)

### Largo Plazo:
- [ ] Migrar a base de datos (PostgreSQL/MongoDB)
- [ ] API GraphQL
- [ ] Aplicación móvil (Ionic/React Native)
- [ ] Sincronización en tiempo real (WebSockets)
- [ ] Colaboración multi-usuario

## Performance y Escalabilidad

### Estado Actual:
- ✅ Adecuado para uso personal/pequeño equipo
- ✅ Respuesta rápida (< 50ms por request)
- ⚠️ Sin paginación (puede ser lento con > 1000 items)
- ⚠️ Sin cache (lee JSON en cada request)

### Recomendaciones para Escalar:
1. Implementar cache en memoria (Redis)
2. Migrar a base de datos relacional
3. Agregar índices para búsquedas rápidas
4. Implementar paginación en API y UI
5. Comprimir responses (gzip)
6. Rate limiting para prevenir abuso

## Seguridad

### Implementado:
- ✅ Validación de datos en backend
- ✅ CORS configurado correctamente
- ✅ Sanitización de inputs

### Por Implementar:
- ⚠️ Autenticación/Autorización
- ⚠️ HTTPS en producción
- ⚠️ Rate limiting
- ⚠️ Input sanitization más robusta
- ⚠️ Logs de auditoría

## Deployment

### Desarrollo:
- Frontend: `ng serve` (puerto 4200)
- Backend: `npm start` (puerto 3000)

### Producción (sugerido):
- Frontend: Build (`ng build`) → Servir desde Nginx/Apache
- Backend: PM2 para gestión de procesos
- Reverse proxy (Nginx) para routear requests
- HTTPS con Let's Encrypt
- Variables de entorno para configuración
