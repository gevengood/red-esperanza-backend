# 🔴 Red Esperanza - Backend API

Backend API REST para la plataforma Red Esperanza - Sistema de búsqueda de menores desaparecidos en Colombia.

## 🏗️ Arquitectura

**Tipo:** Monolito Modular  
**Stack:**
- Node.js 18+
- Express.js
- Supabase (PostgreSQL)
- JWT Authentication

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negocio
│   ├── services/        # Servicios (DB, Auth)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas API
│   ├── middleware/      # Middleware (auth, validación)
│   ├── config/          # Configuración
│   └── utils/           # Utilidades
├── tests/               # Pruebas automatizadas
├── database/            # Scripts SQL
└── server.js            # Punto de entrada
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase.

### 3. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. En el SQL Editor, ejecuta el script `database/schema.sql`
4. Copia las credenciales al archivo `.env`

### 4. Iniciar servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 📡 Endpoints API

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/logout` - Cerrar sesión

### Casos
- `GET /api/v1/cases` - Listar casos
- `GET /api/v1/cases/:id` - Obtener caso por ID
- `POST /api/v1/cases` - Crear caso (requiere auth)
- `PUT /api/v1/cases/:id` - Actualizar caso (requiere auth)
- `DELETE /api/v1/cases/:id` - Eliminar caso (requiere auth)

### Pistas
- `GET /api/v1/clues` - Listar pistas
- `GET /api/v1/clues/case/:caseId` - Pistas de un caso
- `POST /api/v1/clues` - Crear pista (requiere auth)

### Usuarios
- `GET /api/v1/users/:id` - Obtener usuario
- `PUT /api/v1/users/:id` - Actualizar usuario (requiere auth)

## 🧪 Testing

```bash
# Todas las pruebas
npm test

# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Coverage
npm test -- --coverage
```

## 🔒 Seguridad

- Helmet.js para headers de seguridad
- Rate limiting
- JWT para autenticación
- Bcrypt para hash de contraseñas
- Row Level Security en Supabase

## 📚 Documentación

Ver carpeta `docs/` para documentación completa de arquitectura.

## 👥 Equipo

Proyecto académico - Diseño y Arquitectura de Software

## 📄 Licencia

MIT
