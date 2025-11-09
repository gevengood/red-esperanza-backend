# 🚀 Red Esperanza - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**API RESTful para la gestión de casos de menores desaparecidos en Colombia**

[🚀 Instalación](#instalación) • [📖 API Docs](#api-endpoints) • [🔐 Autenticación](#autenticación)

</div>

---

## 📋 Índice

- [Acerca del Proyecto](#acerca-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Autenticación](#autenticación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Credenciales de Admin](#credenciales-de-admin)

---

## 🎯 Acerca del Proyecto

Backend de **Red Esperanza**, una API RESTful desarrollada con Node.js y Express para gestionar casos de menores desaparecidos. Proporciona endpoints para autenticación, gestión de casos, pistas y usuarios con roles diferenciados.

### Objetivos:
- ✅ API RESTful completa con 24 endpoints
- ✅ Autenticación JWT con expiración de 7 días
- ✅ Gestión de roles (Usuario y Administrador)
- ✅ Integración con Supabase PostgreSQL
- ✅ Manejo robusto de errores
- ✅ Seguridad con CORS, Helmet y Rate Limiting

---

## 🚀 Stack Tecnológico

### Core
- **Node.js** - Runtime de JavaScript
- **Express 4.18.2** - Framework web minimalista
- **Supabase PostgreSQL** - Base de datos relacional
- **@supabase/supabase-js 2.39.0** - Cliente de Supabase

### Autenticación y Seguridad
- **jsonwebtoken 9.0.2** - Tokens JWT
- **bcryptjs 2.4.3** - Hash de contraseñas (10 rounds)
- **helmet 7.1.0** - Headers de seguridad HTTP
- **cors 2.8.5** - Cross-Origin Resource Sharing
- **express-rate-limit 7.1.5** - Limitación de tasa

### Utilidades
- **dotenv 16.3.1** - Variables de entorno
- **joi 17.11.0** - Validación de datos
- **morgan 1.10.0** - Logger HTTP
- **compression 1.7.4** - Compresión gzip
- **multer 1.4.5** - Manejo de archivos multipart

### Desarrollo
- **nodemon 3.0.2** - Recarga automática
- **jest 29.7.0** - Framework de testing
- **supertest 6.3.3** - Testing de HTTP
- **eslint 8.56.0** - Linter de código

---

## 🎨 Características

### ✅ Implementado

#### Autenticación
- Registro de usuarios con hash bcrypt
- Login con JWT (7 días de expiración)
- Middleware de autenticación para rutas protegidas
- Roles: Usuario regular y Administrador
- Logout con invalidación de token

#### Gestión de Casos
- CRUD completo de casos
- Estados: PENDIENTE_REVISION, ACTIVO, RESUELTO, RECHAZADO
- Filtrado por estado
- Paginación (default: 50 casos)
- Casos por usuario
- Permiso de edición solo para dueño o admin
- Eliminación solo para admin

#### Sistema de Pistas
- CRUD completo de pistas
- Estados: PENDIENTE_REVISION, VERIFICADA, RECHAZADA
- Pistas por caso
- Pistas por usuario
- Moderación por administrador
- Soporte para fotos de pistas

#### Panel de Administrador
- Vista de todos los casos (incluidos pendientes y rechazados)
- Cambio de estado de casos
- Moderación de pistas
- Estadísticas del sistema
- Eliminación de casos y pistas

#### Gestión de Usuarios
- Listado de usuarios (solo admin)
- Perfil de usuario
- Actualización de perfil
- Cambio de contraseña
- Estadísticas por usuario (casos y pistas)
- Eliminación de cuenta

#### Seguridad
- Headers HTTP seguros con Helmet
- CORS configurado para frontend
- Rate limiting (100 req/15min)
- Validación de datos con Joi
- Hash de contraseñas con bcrypt (10 rounds)
- Tokens JWT con expiración

### ❌ Pendiente

- **Tests unitarios**: 0% de cobertura
- **Tests de integración**: No implementados
- **Tests E2E**: No implementados
- **Documentación OpenAPI/Swagger**: No configurada
- **Logs estructurados**: Solo Morgan básico
- **Métricas y monitoring**: No implementado
- **CI/CD**: No configurado
- **Docker**: No dockerizado
- **Validación avanzada**: Joi parcialmente implementado

---

## 🏗️ Arquitectura

### Estilo Arquitectónico
**Monolítico Modular (Layered Architecture)**

### Patrón de Diseño
**MVC + Service Layer**

### Capas

```
┌─────────────────────────────────┐
│         Routes Layer            │  ← Definición de endpoints
├─────────────────────────────────┤
│       Middleware Layer          │  ← Autenticación, validación
├─────────────────────────────────┤
│      Controllers Layer          │  ← Lógica de HTTP (req/res)
├─────────────────────────────────┤
│       Services Layer            │  ← Lógica de negocio (NO IMPLEMENTADO)
├─────────────────────────────────┤
│      Supabase Client            │  ← Acceso a base de datos
└─────────────────────────────────┘
```

**Nota:** Actualmente los controladores acceden directamente a Supabase. La capa de servicios está pendiente de implementar para mejor separación de responsabilidades.

---

## 📦 Instalación

### Prerrequisitos
- Node.js >= 14.0.0
- npm >= 6.14.0
- Cuenta de Supabase con proyecto configurado
- Base de datos PostgreSQL en Supabase

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/gevengood/red-esperanza-backend.git
cd red-esperanza-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (ver sección [Configuración](#configuración))

4. **Configurar base de datos** (ver sección [Base de Datos](#base-de-datos))

5. **Iniciar el servidor**
```bash
# Producción
npm start

# Desarrollo (con nodemon)
npm run dev
```

El servidor se iniciará en [http://localhost:5000](http://localhost:5000)

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=development

# Supabase
SUPABASE_URL=https://ynnymhcixlaylycrenba.supabase.co
SUPABASE_KEY=tu_service_role_key_aqui

# JWT
JWT_SECRET=tu_secret_super_secreto_aqui
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Obtener credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_KEY` (¡NO uses la anon key!)

⚠️ **Importante:** Usa la `service_role` key en el backend, NO la `anon` key.

### Generar JWT_SECRET

```bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# O usa un generador online
https://randomkeygen.com/
```

---

## 🗄️ Base de Datos

### Esquema de Base de Datos

El proyecto usa **Supabase PostgreSQL** con el siguiente esquema:

#### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
    id_usuario UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    es_administrador BOOLEAN DEFAULT false,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    ultimo_acceso TIMESTAMP
);
```

#### Tabla: `casos`
```sql
CREATE TABLE casos (
    id_caso UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    
    -- Información del menor
    nombre_desaparecido VARCHAR(100) NOT NULL,
    edad_desaparecido INTEGER NOT NULL CHECK (edad_desaparecido >= 0 AND edad_desaparecido <= 18),
    sexo_desaparecido VARCHAR(20) CHECK (sexo_desaparecido IN ('MASCULINO', 'FEMENINO', 'OTRO')),
    descripcion_fisica TEXT,
    descripcion_ropa TEXT,
    
    -- Información del caso
    descripcion_hechos TEXT NOT NULL,
    fecha_desaparicion TIMESTAMP NOT NULL,
    fecha_reporte TIMESTAMP DEFAULT NOW(),
    
    -- Ubicación
    ubicacion_latitud DECIMAL(10, 8) NOT NULL,
    ubicacion_longitud DECIMAL(11, 8) NOT NULL,
    direccion_texto TEXT,
    
    -- Contacto
    nombre_contacto VARCHAR(100) NOT NULL,
    telefono_contacto VARCHAR(20) NOT NULL,
    correo_contacto VARCHAR(100),
    parentesco VARCHAR(50),
    
    -- Fotos (Supabase Storage URLs)
    url_foto_1 TEXT,
    url_foto_2 TEXT,
    url_foto_3 TEXT,
    
    -- Estado
    estado_caso VARCHAR(50) DEFAULT 'PENDIENTE_REVISION' 
        CHECK (estado_caso IN ('PENDIENTE_REVISION', 'ACTIVO', 'RESUELTO', 'RECHAZADO')),
    
    fecha_actualizacion TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `pistas`
```sql
CREATE TABLE pistas (
    id_pista UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_caso UUID REFERENCES casos(id_caso) ON DELETE CASCADE,
    id_usuario UUID REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    
    mensaje TEXT NOT NULL,
    url_foto_pista TEXT,
    
    fecha_pista TIMESTAMP DEFAULT NOW(),
    estado_pista VARCHAR(50) DEFAULT 'PENDIENTE_REVISION'
        CHECK (estado_pista IN ('PENDIENTE_REVISION', 'VERIFICADA', 'RECHAZADA')),
    
    verificado_por UUID REFERENCES usuarios(id_usuario),
    fecha_verificacion TIMESTAMP
);
```

### Configurar la Base de Datos

1. **Ejecutar el esquema**
   - Ve a **SQL Editor** en Supabase
   - Copia y ejecuta el contenido de `database/schema.sql`

2. **Crear usuario administrador**
   ```sql
   INSERT INTO usuarios (nombre, correo, password_hash, es_administrador)
   VALUES (
       'Admin Red Esperanza',
       'admin@redesperanza.org',
       '$2a$10$hashedPasswordAqui', -- Genera con bcrypt
       true
   );
   ```

3. **Configurar Supabase Storage**
   - Crea un bucket llamado `case-images`
   - Configura políticas públicas para lectura
   - Configura políticas autenticadas para escritura

Ver `SUPABASE_SETUP.md` para instrucciones detalladas.

---

## 🛣️ API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| GET | `/auth/me` | Obtener usuario actual | Sí |
| POST | `/auth/logout` | Cerrar sesión | Sí |

**Ejemplo: Registro**
```bash
POST /api/v1/auth/register
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
      "es_administrador": false,
      "fecha_registro": "2025-11-09T12:00:00Z"
    }
  }
}
```

---

### 👶 Casos (`/cases`)

| Método | Endpoint | Descripción | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/cases` | Listar casos activos | No | No |
| GET | `/cases/:id` | Obtener caso por ID | No | No |
| POST | `/cases` | Crear nuevo caso | Sí | No |
| PUT | `/cases/:id` | Actualizar caso | Sí | Dueño/Admin |
| DELETE | `/cases/:id` | Eliminar caso | Sí | Admin |
| GET | `/cases/user/:userId` | Casos de un usuario | Sí | No |
| GET | `/cases/admin/all` | Todos los casos | Sí | Admin |
| PUT | `/cases/:id/status` | Cambiar estado | Sí | Admin |

**Ejemplo: Crear caso**
```bash
POST /api/v1/cases
Authorization: Bearer TOKEN_JWT
Content-Type: application/json

{
  "nombre_desaparecido": "Juan Pérez",
  "edad_desaparecido": 8,
  "sexo_desaparecido": "MASCULINO",
  "descripcion_fisica": "Cabello castaño, ojos cafés, 1.20m",
  "descripcion_ropa": "Camiseta azul, pantalón jean",
  "descripcion_hechos": "Desapareció ayer saliendo del colegio",
  "fecha_desaparicion": "2025-11-08T15:30:00Z",
  "ubicacion_latitud": 4.7110,
  "ubicacion_longitud": -74.0721,
  "direccion_texto": "Calle 72 con Carrera 7, Bogotá",
  "nombre_contacto": "María García",
  "telefono_contacto": "+57 300 123 4567",
  "correo_contacto": "maria@gmail.com",
  "parentesco": "Madre",
  "url_foto_1": "https://supabase.co/storage/case-images/foto1.jpg"
}
```

**Parámetros de query para GET /cases:**
- `?estado=ACTIVO` - Filtrar por estado
- `?limite=10` - Cantidad de resultados (default: 50)
- `?pagina=1` - Página actual (default: 1)

---

### 🔍 Pistas (`/clues`)

| Método | Endpoint | Descripción | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/clues/case/:caseId` | Pistas de un caso | No | No |
| POST | `/clues` | Crear nueva pista | Sí | No |
| PUT | `/clues/:id` | Actualizar pista | Sí | Dueño/Admin |
| DELETE | `/clues/:id` | Eliminar pista | Sí | Dueño/Admin |
| GET | `/clues/user/:userId` | Pistas de un usuario | Sí | No |
| GET | `/clues/pending` | Pistas pendientes | Sí | Admin |

**Ejemplo: Crear pista**
```bash
POST /api/v1/clues
Authorization: Bearer TOKEN_JWT
Content-Type: application/json

{
  "id_caso": "uuid-del-caso",
  "mensaje": "Vi a un niño con esas características en el parque",
  "url_foto_pista": "https://supabase.co/storage/pista1.jpg"
}
```

---

### 👤 Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/users` | Listar todos los usuarios | Sí | Admin |
| GET | `/users/:id` | Obtener perfil | Sí | No |
| PUT | `/users/:id` | Actualizar perfil | Sí | Propio |
| PUT | `/users/:id/password` | Cambiar contraseña | Sí | Propio |
| GET | `/users/:id/stats` | Estadísticas | Sí | No |
| DELETE | `/users/:id` | Eliminar usuario | Sí | Propio/Admin |

**Ejemplo: Obtener estadísticas**
```bash
GET /api/v1/users/:id/stats
Authorization: Bearer TOKEN_JWT
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

---

## 🔐 Autenticación

### JWT Tokens

Todas las rutas protegidas requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cómo obtener el token

1. **Registro**: `POST /api/v1/auth/register`
2. **O Login**: `POST /api/v1/auth/login`
3. **Obtén el token** en la respuesta
4. **Úsalo** en el header `Authorization: Bearer TOKEN`

### Expiración

- Los tokens expiran en **7 días**
- Después debes hacer login nuevamente
- El token se almacena en `localStorage` en el frontend

### Middleware de Autenticación

```javascript
// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'No autorizado' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Token inválido' 
    });
  }
};
```

---

## 📂 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/              # Controladores MVC
│   │   ├── auth.controller.js    # Login, registro, perfil
│   │   ├── cases.controller.js   # CRUD de casos
│   │   ├── clues.controller.js   # CRUD de pistas
│   │   └── users.controller.js   # Gestión de usuarios
│   │
│   ├── middleware/               # Middlewares
│   │   └── auth.middleware.js    # Autenticación JWT
│   │
│   ├── routes/                   # Definición de rutas
│   │   ├── auth.routes.js        # Rutas de autenticación
│   │   ├── cases.routes.js       # Rutas de casos
│   │   ├── clues.routes.js       # Rutas de pistas
│   │   └── users.routes.js       # Rutas de usuarios
│   │
│   └── config/                   # Configuración
│       ├── config.js             # Variables de entorno
│       └── supabase.js           # Cliente de Supabase
│
├── database/                     # Base de datos
│   ├── schema.sql                # Esquema PostgreSQL
│   └── README.md                 # Documentación de DB
│
├── tests/                        # Tests (no implementados)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── server.js                     # Punto de entrada
├── package.json                  # Dependencias
├── .env.example                  # Ejemplo de variables
├── .gitignore                    # Archivos ignorados
├── README.md                     # Este archivo
├── API_DOCUMENTATION.md          # Documentación detallada de API
└── SUPABASE_SETUP.md             # Guía de configuración de Supabase
```

---

## 🏃‍♂️ Comandos

```bash
# Desarrollo
npm start              # Ejecutar con Node
npm run dev            # Ejecutar con Nodemon (recarga automática)

# Testing (no implementado)
npm test               # Ejecutar todos los tests
npm run test:watch     # Tests en modo watch
npm run test:unit      # Solo tests unitarios
npm run test:integration  # Solo tests de integración
npm run test:e2e       # Solo tests E2E

# Linting
npm run lint           # Verificar código con ESLint
npm run lint:fix       # Corregir automáticamente
```

---

## 📊 Estados de Datos

### Estados de Casos
- `PENDIENTE_REVISION` - Caso recién creado, esperando aprobación de admin
- `ACTIVO` - Caso aprobado y visible públicamente
- `RESUELTO` - Menor encontrado, caso cerrado exitosamente
- `RECHAZADO` - Caso rechazado por admin (datos incorrectos, spam, etc.)

### Estados de Pistas
- `PENDIENTE_REVISION` - Pista recién creada, esperando verificación
- `VERIFICADA` - Pista verificada y confirmada por admin
- `RECHAZADA` - Pista descartada (no relevante, spam, etc.)

---

## 👥 Credenciales de Admin

### Usuario Administrador

```
Email: admin@redesperanza.org
Password: admin123
```

**Permisos de Administrador:**
- Ver todos los casos (incluidos pendientes y rechazados)
- Aprobar/rechazar casos nuevos
- Cambiar estado de casos a RESUELTO
- Verificar/rechazar pistas
- Ver estadísticas globales del sistema
- Eliminar casos y pistas
- Ver todos los usuarios

**Para crear más admins:**
```sql
UPDATE usuarios 
SET es_administrador = true 
WHERE correo = 'nuevo@admin.com';
```

---

## 🔗 Repositorio Frontend

El frontend de este proyecto está disponible en:
**[https://github.com/gevengood/red-esperanza-frontend](https://github.com/gevengood/red-esperanza-frontend)**

**Requisito:** El frontend espera que este backend esté corriendo en `http://localhost:5000`

---

## 📚 Documentación Adicional

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación detallada de todos los endpoints con ejemplos
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Guía paso a paso para configurar Supabase
- **[database/README.md](./database/README.md)** - Documentación del esquema de base de datos

---

## 🐛 Troubleshooting

### Error: "Cannot connect to Supabase"
- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` sean correctos
- Asegúrate de usar la `service_role` key, no la `anon` key
- Verifica que tu proyecto de Supabase esté activo

### Error: "JWT malformed"
- Verifica que estés enviando el token en el formato correcto: `Bearer TOKEN`
- Asegúrate de que el token no haya expirado (7 días)
- Genera un nuevo token haciendo login

### Error: "Port 5000 already in use"
- Cambia el puerto en `.env`: `PORT=5001`
- O mata el proceso: `npx kill-port 5000`

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en `.env` sea correcto
- Asegúrate de que el frontend esté corriendo en ese puerto

---

## 📄 Licencia

Proyecto académico desarrollado para la asignatura de **Diseño y Arquitectura de Software**  
**Universidad de la Sabana** - 2025

---

## 👨‍💻 Autor

**Jorge Steven Doncel Bejarano**  
Ingeniería de Sistemas  
Universidad de la Sabana  
Email: jorjuchod@gmail.com  
GitHub: [gevengood](https://github.com/gevengood)

---

## 🙏 Agradecimientos

- **Supabase** por la excelente plataforma BaaS
- **Express.js** por el framework robusto y minimalista
- **Universidad de la Sabana** por el apoyo académico
- **OpenStreetMap** por los datos de geolocalización

---

<div align="center">

**[⬆ Volver arriba](#-red-esperanza---backend-api)**

Hecho con ❤️ para ayudar a encontrar menores desaparecidos en Colombia

</div>
