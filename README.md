# Proyecto de Diseño de Software – Corte Tres: Red Esperanza Backend

## 🧠 Presentación del Problema

Red Esperanza es una plataforma para la gestión y seguimiento de casos de niños desaparecidos en Colombia. Permite a usuarios reportar casos, aportar pistas, y a administradores verificar y gestionar la información centralizada.

**Por qué es importante:** En Colombia, cientos de menores desaparecen anualmente sin canales eficientes de difusión.

**Quiénes se benefician:** Familias de menores desaparecidos, ciudadanía, autoridades.

## 🎨 Creatividad en la Presentación

_[Espacio reservado para video o recurso creativo]_

## 🧱 Fundamentos de Ingeniería de Software

**Atributos de calidad:**

- **Seguridad**: JWT (7 días), bcrypt (10 rondas), rate limiting (100 req/15min), helmet
- **Mantenibilidad**: Arquitectura en capas, JSDoc completo, configuración centralizada
- **Escalabilidad**: PostgreSQL con índices, paginación, compresión, CDN

## 🧩 Diseño de Software

### Principios SOLID aplicados (mínimo 3)

**1. Responsabilidad Única (SRP)**  
Cada controlador gestiona una entidad específica.

**2. Abierto/Cerrado (OCP)**  
Middleware permite extensión sin modificación.

**3. Inversión de Dependencias (DIP)**  
Controladores dependen de abstracciones.

### Patrones de diseño utilizados (mínimo 2)

**1. Singleton**  
Configuración única en config.js y supabase.js.

**2. Chain of Responsibility**  
Middleware encadenado (auth() → isAdmin → controlador).

**3. Template Method**  
Estructura común: try → validar → ejecutar → responder → catch.

### Justificación de cada elección

- **Singleton**: Evita múltiples conexiones a BD
- **Chain of Responsibility**: Separa autenticación, autorización y lógica
- **Template Method**: Estandariza manejo de errores

### Diagrama de clases UML

_[Espacio reservado para diagrama UML]_

### Diagramas de casos de uso o secuencia

_[Espacio reservado para diagramas]_

## 💻 Implementación

**Estructura del código:**

backend/
├── server.js
├── src/
│   ├── config/ (Singleton)
│   ├── middleware/ (Chain)
│   ├── controllers/ (Template)
│   └── routes/
└── database/schema.sql

**Enlaces a clases principales:**

- config.js - Singleton
- supabase.js - Singleton BD
- auth.middleware.js - Chain
- auth.controller.js - Template
- cases.controller.js - CRUD
- schema.sql - BD

**Tecnologías:** Node.js, Express 4.18.2, Supabase, JWT 9.0.2, bcrypt 2.4.3, helmet 7.1.0

## 🔍 Análisis Técnico

**Cohesión:** Cada módulo tiene responsabilidad única.

**Bajo acoplamiento:** Módulos interactúan mediante interfaces definidas.

**Atributos de calidad:** JWT + bcrypt + rate limiting + helmet garantizan seguridad. Capas + JSDoc facilitan mantenibilidad. Paginación + índices permiten escalabilidad.

## 👥 Créditos y Roles

**Autor:** Jorge Steven Doncel Bejarano  
**Email:** jorjuchod@gmail.com  
**GitHub:** @gevengood

**Universidad:** Universidad de la Sabana  
**Curso:** Diseño y Arquitectura de Software  
**Fecha:** Noviembre 2025

**Rol:** Arquitectura, implementación backend, documentación, testing, despliegue

---

## 🧪 Entrega 3: Pruebas, CI/CD y DevSecOps

### Pruebas Implementadas

#### 1. Pruebas Unitarias (Jest)
- **Ubicación:** `tests/unit/`
- **Cobertura:** 14% (mínimo 10% requerido)
- **Total:** 11 pruebas unitarias
- **Archivos:**
  - `auth.controller.test.js` - 7 pruebas de autenticación
  - `cases.controller.test.js` - 4 pruebas de casos

**Ejecutar pruebas:**
```bash
npm test
```

**Ver reporte de cobertura:**
```bash
npm test -- --coverage
```

#### 2. Pruebas de API (Postman)
- **Ubicación:** `postman/Red-Esperanza-API.postman_collection.json`
- **Total:** 8 requests con pruebas automatizadas
- **Categorías:**
  - Auth: Register, Login, Profile (4 tests)
  - Cases: List, Get by ID, Create (3 tests)
  - Health Check (1 test)

**Importar en Postman:**
1. Abrir Postman
2. File → Import
3. Seleccionar `postman/Red-Esperanza-API.postman_collection.json`
4. La variable `baseUrl` ya está configurada con producción

### CI/CD Pipeline (GitHub Actions)

**Archivo:** `.github/workflows/ci-cd.yml`

**Workflow automático en cada push:**
1. ✅ Checkout del código
2. ✅ Setup Node.js 18
3. ✅ Instalación de dependencias
4. ✅ Ejecución de pruebas unitarias
5. ✅ Análisis de seguridad con npm audit
6. ✅ Análisis estático con SonarCloud
7. ✅ Build de imagen Docker
8. ✅ Subida de reporte de cobertura

**Ver resultados:** [GitHub Actions](https://github.com/gevengood/red-esperanza-backend/actions)

### DevSecOps

#### Análisis Estático de Código (SAST)
- **Herramienta:** SonarCloud
- **Configuración:** `sonar-project.properties`
- **Integración:** Automática en CI/CD
- **Dashboard:** [SonarCloud Project](https://sonarcloud.io/project/overview?id=gevengood_red-esperanza-backend)

#### Análisis de Dependencias
- **Herramienta:** npm audit (integrado en CI/CD)
- **Nivel:** Moderate y superior
- **Ejecución manual:**
```bash
npm audit
npm audit fix
```

#### Contenerización (Docker)
- **Archivo:** `Dockerfile`
- **Imagen base:** node:18-alpine (segura y ligera)
- **Características:**
  - Usuario no-root para seguridad
  - Multi-stage build
  - .dockerignore para excluir archivos sensibles

**Construir imagen:**
```bash
docker build -t red-esperanza-backend .
```

**Ejecutar contenedor:**
```bash
docker run -p 5000:5000 --env-file .env red-esperanza-backend
```

### Despliegue en Producción

**Backend:** [https://red-esperanza-backend.onrender.com](https://red-esperanza-backend.onrender.com)  
**Frontend:** [https://red-esperanza.vercel.app](https://red-esperanza.vercel.app)  
**Base de Datos:** Supabase PostgreSQL

**Arquitectura de despliegue:**
```
[GitHub] → [GitHub Actions CI/CD] → [Docker Build]
                ↓
        [SonarCloud Analysis]
                ↓
        [Render Deployment]
                ↓
    [Production API] ← [Vercel Frontend]
                ↓
        [Supabase DB]
```

### Métricas de Calidad

| Métrica | Valor | Estado |
|---------|-------|--------|
| Pruebas Unitarias | 11 tests | ✅ PASS |
| Cobertura de Código | 14% | ✅ >10% |
| Pruebas de API | 8 requests | ✅ PASS |
| Build Docker | Exitoso | ✅ OK |
| Despliegue Producción | Activo | ✅ LIVE |
| SonarCloud | Configurado | ✅ OK |

---

## 🚀 Instalación y Ejecución

**Requisitos:**
- Node.js >= 18.0.0
- npm >= 9.0.0

**Instalación:**
```bash
npm install
```

**Configurar variables de entorno (.env):**
```env
PORT=5000
SUPABASE_URL=tu_url_supabase
SUPABASE_KEY=tu_key_supabase
JWT_SECRET=tu_secreto_jwt
CORS_ORIGIN=http://localhost:3000
```

**Ejecución en desarrollo:**
```bash
npm run dev
```

**Ejecución en producción:**
```bash
npm start
```

Servidor en http://localhost:5000
