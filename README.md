# Proyecto de Diseño de Software – Corte Uno: Red Esperanza Backend

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

**Instalación:**

npm install

Configurar .env con Supabase y JWT.

**Ejecución:**

npm start

Servidor en http://localhost:3001
