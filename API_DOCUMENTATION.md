# 🚀 RED ESPERANZA - API BACKEND

## ✅ Estado del Backend

**Backend completamente funcional** con:
- ✅ Servidor Express corriendo en `http://localhost:5000`
- ✅ Base de datos Supabase configurada y conectada
- ✅ 4 Controllers implementados (Auth, Cases, Clues, Users)
- ✅ Middleware de autenticación JWT funcionando
- ✅ Todas las rutas conectadas y operativas

---

## 📋 Endpoints Disponibles

### 🔐 **Autenticación** (`/api/v1/auth`)

#### 1. Registrar Usuario
```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "nombre": "María García",
  "correo": "maria@gmail.com",
  "password": "password123",
  "telefono": "+57 300 123 4567"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id_usuario": "uuid-aqui",
      "nombre": "María García",
      "correo": "maria@gmail.com",
      "telefono": "+57 300 123 4567",
      "es_administrador": false
    }
  }
}
```

#### 2. Iniciar Sesión
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "correo": "maria@gmail.com",
  "password": "password123"
}
```

#### 3. Obtener Usuario Actual (requiere token)
```http
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer TU_TOKEN_AQUI
```

#### 4. Cerrar Sesión
```http
POST http://localhost:5000/api/v1/auth/logout
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 👶 **Casos** (`/api/v1/cases`)

#### 1. Listar Casos Activos (público)
```http
GET http://localhost:5000/api/v1/cases
```

**Parámetros opcionales:**
- `?estado=ACTIVO` - Filtrar por estado
- `?limite=10` - Cantidad de resultados (default: 50)
- `?pagina=1` - Página actual (default: 1)

#### 2. Obtener Caso por ID
```http
GET http://localhost:5000/api/v1/cases/:id
```

#### 3. Crear Nuevo Caso (requiere autenticación)
```http
POST http://localhost:5000/api/v1/cases
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "nombre_desaparecido": "Juan Pérez",
  "edad_desaparecido": 8,
  "sexo_desaparecido": "MASCULINO",
  "descripcion_fisica": "Cabello castaño, ojos cafés, estatura 1.20m",
  "descripcion_ropa": "Camiseta azul, pantalón jean",
  "descripcion_hechos": "Desapareció el día de ayer cuando salía del colegio...",
  "fecha_desaparicion": "2025-11-07T15:30:00Z",
  "ubicacion_latitud": 4.7110,
  "ubicacion_longitud": -74.0721,
  "direccion_texto": "Calle 72 con Carrera 7, Bogotá",
  "nombre_contacto": "María García",
  "telefono_contacto": "+57 300 123 4567",
  "correo_contacto": "maria@gmail.com",
  "parentesco": "Madre",
  "url_foto_1": "https://supabase.co/storage/foto1.jpg"
}
```

#### 4. Actualizar Caso (dueño o admin)
```http
PUT http://localhost:5000/api/v1/cases/:id
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "descripcion_hechos": "Actualización: Se vio al niño cerca del parque...",
  "telefono_contacto": "+57 300 999 8888"
}
```

#### 5. Eliminar Caso (solo admin)
```http
DELETE http://localhost:5000/api/v1/cases/:id
Authorization: Bearer TU_TOKEN_ADMIN
```

#### 6. Obtener Casos de un Usuario
```http
GET http://localhost:5000/api/v1/cases/user/:userId
Authorization: Bearer TU_TOKEN_AQUI
```

---

### 🔍 **Pistas** (`/api/v1/clues`)

#### 1. Obtener Pistas de un Caso
```http
GET http://localhost:5000/api/v1/clues/case/:caseId
```

#### 2. Crear Nueva Pista (requiere autenticación)
```http
POST http://localhost:5000/api/v1/clues
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "id_caso": "uuid-del-caso",
  "mensaje": "Vi a un niño con esas características en el parque el día de hoy a las 3pm",
  "url_foto_pista": "https://supabase.co/storage/pista1.jpg"
}
```

#### 3. Actualizar Pista (dueño o admin)
```http
PUT http://localhost:5000/api/v1/clues/:id
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "mensaje": "Actualización de la pista..."
}
```

**Admin puede cambiar estado:**
```json
{
  "estado_pista": "VERIFICADA"
}
```

#### 4. Eliminar Pista (dueño o admin)
```http
DELETE http://localhost:5000/api/v1/clues/:id
Authorization: Bearer TU_TOKEN_AQUI
```

#### 5. Obtener Pistas de un Usuario
```http
GET http://localhost:5000/api/v1/clues/user/:userId
Authorization: Bearer TU_TOKEN_AQUI
```

#### 6. Obtener Pistas Pendientes (solo admin)
```http
GET http://localhost:5000/api/v1/clues/pending
Authorization: Bearer TU_TOKEN_ADMIN
```

---

### 👤 **Usuarios** (`/api/v1/users`)

#### 1. Listar Todos los Usuarios (solo admin)
```http
GET http://localhost:5000/api/v1/users
Authorization: Bearer TU_TOKEN_ADMIN
```

#### 2. Obtener Perfil de Usuario
```http
GET http://localhost:5000/api/v1/users/:id
Authorization: Bearer TU_TOKEN_AQUI
```

#### 3. Actualizar Perfil (solo propio perfil)
```http
PUT http://localhost:5000/api/v1/users/:id
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "nombre": "María García López",
  "telefono": "+57 300 999 8888"
}
```

#### 4. Cambiar Contraseña
```http
PUT http://localhost:5000/api/v1/users/:id/password
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "nuevapassword456"
}
```

#### 5. Obtener Estadísticas de Usuario
```http
GET http://localhost:5000/api/v1/users/:id/stats
Authorization: Bearer TU_TOKEN_AQUI
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "casos": {
      "total": 5,
      "pendientes": 1,
      "activos": 3,
      "resueltos": 1,
      "rechazados": 0
    },
    "pistas": {
      "total": 12,
      "pendientes": 2,
      "verificadas": 9,
      "rechazadas": 1
    }
  }
}
```

#### 6. Eliminar Usuario (propio o admin)
```http
DELETE http://localhost:5000/api/v1/users/:id
Authorization: Bearer TU_TOKEN_AQUI
```

---

## 🔒 Autenticación

Todas las rutas **privadas** requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cómo obtener el token:
1. Regístrate con `/api/v1/auth/register`
2. O inicia sesión con `/api/v1/auth/login`
3. Obtendrás un `token` en la respuesta
4. Usa ese token en el header `Authorization: Bearer TOKEN`

---

## 📊 Estados de los Datos

### Estados de Casos:
- `PENDIENTE_REVISION` - Caso recién creado, pendiente de aprobación
- `ACTIVO` - Caso aprobado y visible públicamente
- `RESUELTO` - Niño encontrado
- `RECHAZADO` - Caso rechazado por administrador

### Estados de Pistas:
- `PENDIENTE_REVISION` - Pista recién creada
- `VERIFICADA` - Pista verificada por administrador
- `RECHAZADA` - Pista no verificable

---

## 🧪 Probar la API

### Opción 1: Thunder Client (VS Code)
1. Instala la extensión "Thunder Client"
2. Importa los ejemplos de arriba
3. Ejecuta las peticiones

### Opción 2: cURL (Terminal)
```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "correo": "maria@gmail.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "maria@gmail.com",
    "password": "password123"
  }'

# Listar casos
curl http://localhost:5000/api/v1/cases
```

### Opción 3: Postman
1. Importa la colección desde la carpeta `/tests`
2. Configura las variables de entorno
3. Ejecuta las peticiones

---

## 🔧 Configuración

### Variables de Entorno (`.env`)
```env
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://ynnymhcixlaylycrenba.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_KEY=tu_service_key

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
```

---

## 🚨 Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

### Códigos HTTP:
- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `409` - Conflict (email duplicado)
- `500` - Internal Server Error

---

## 📝 Notas Importantes

1. **Los casos nuevos se crean con estado `PENDIENTE_REVISION`** y deben ser aprobados por un admin
2. **Las pistas nuevas también requieren revisión** antes de ser visibles públicamente
3. **Los JWT expiran en 7 días** - después debes volver a iniciar sesión
4. **Solo administradores** pueden cambiar estados de casos/pistas
5. **La base de datos usa Row Level Security (RLS)** para proteger los datos

---

## 🎯 Siguiente Paso

Ahora puedes conectar el **frontend de React** con esta API:

1. Actualiza `src/services/caseService.js` para usar `http://localhost:5000/api/v1`
2. Implementa login/register en el frontend
3. Guarda el token en `localStorage`
4. Usa el token en todas las peticiones autenticadas

¿Quieres que implemente la conexión del frontend con el backend? 🚀
