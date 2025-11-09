# 🔧 GUÍA DE CONFIGURACIÓN DE SUPABASE

## Paso 1: Crear Cuenta y Proyecto

1. **Ve a Supabase:**
   - Visita: https://supabase.com
   - Haz clic en "Start your project"
   - Crea una cuenta (puedes usar GitHub/Google)

2. **Crear Nuevo Proyecto:**
   - Dashboard > "New Project"
   - **Nombre:** `red-esperanza`
   - **Database Password:** (guarda este password seguro)
   - **Region:** South America (São Paulo) - más cercano a Colombia
   - Espera 1-2 minutos mientras se crea el proyecto

## Paso 2: Obtener Credenciales

1. **En el Dashboard del proyecto:**
   - Ve a **Settings** (⚙️) > **API**
   - Copia los siguientes valores:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Pegar en `.env`:**
```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_key_aqui
```

## Paso 3: Ejecutar Script SQL

1. **En el Dashboard:**
   - Ve a **SQL Editor** (</> icono)
   - Haz clic en "New query"

2. **Copiar y pegar el contenido de:**
   - Archivo: `backend/database/schema.sql`
   - Pegar todo el contenido en el editor

3. **Ejecutar:**
   - Haz clic en "Run" o presiona `Ctrl+Enter`
   - Deberías ver: "Success. No rows returned"

4. **Verificar:**
   - Ve a **Table Editor**
   - Deberías ver 3 tablas: `usuarios`, `casos`, `pistas`

## Paso 4: Configurar Autenticación

1. **Configuración de Auth:**
   - Ve a **Authentication** > **Settings**
   - **Enable Email Provider:** ✓
   - **Confirm Email:** OFF (para desarrollo)
   - **Enable Email Confirmations:** OFF (para desarrollo)

2. **Crear Usuario Admin Manual (Opcional):**
   - Ve a **Authentication** > **Users**
   - Clic en "Add user"
   - Email: `admin@redesperanza.org`
   - Password: `admin123`
   - Clic en "Create user"

3. **Actualizar tabla usuarios:**
   - Ve a **SQL Editor**
   - Ejecuta este query para hacer admin al usuario:

```sql
UPDATE usuarios 
SET es_administrador = TRUE 
WHERE correo = 'admin@redesperanza.org';
```

## Paso 5: Configurar Storage (Para fotos)

1. **Crear Bucket:**
   - Ve a **Storage**
   - Clic en "Create a new bucket"
   - **Name:** `fotos-casos`
   - **Public bucket:** ✓ (ON)
   - Clic en "Create bucket"

2. **Configurar Políticas:**
   - Selecciona el bucket `fotos-casos`
   - Ve a **Policies**
   - Clic en "New policy"
   - Selecciona template: "Allow public access"
   - Clic en "Review"
   - Clic en "Save policy"

## Paso 6: Verificar Conexión

1. **Iniciar backend:**
```bash
cd backend
npm run dev
```

2. **Probar health check:**
```bash
curl http://localhost:5000/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "Red Esperanza API está funcionando correctamente",
  "timestamp": "2024-11-08T...",
  "environment": "development"
}
```

## ✅ Checklist de Verificación

- [ ] Proyecto creado en Supabase
- [ ] Credenciales copiadas al `.env`
- [ ] Script SQL ejecutado exitosamente
- [ ] 3 tablas creadas (usuarios, casos, pistas)
- [ ] Autenticación configurada
- [ ] Usuario admin creado (opcional)
- [ ] Bucket de storage creado
- [ ] Backend conectándose sin errores

## 🔥 Siguiente Paso

Una vez completado, puedes:
1. Probar los endpoints del API
2. Implementar los controladores
3. Conectar el frontend con el backend real

## 🆘 Problemas Comunes

### Error: "Invalid API key"
- Verifica que copiaste las credenciales correctas
- Asegúrate de no tener espacios extra en el `.env`

### Error: "relation does not exist"
- El script SQL no se ejecutó correctamente
- Ejecuta el script de nuevo en SQL Editor

### Error: "Password authentication failed"
- Verifica el Database Password en Settings
- Revisa la cadena de conexión

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
