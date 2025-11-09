# 🗄️ Configuración de Base de Datos Supabase

## 📋 Pasos para ejecutar el schema

### 1. Accede a tu proyecto de Supabase
Entra a: https://supabase.com/dashboard/project/ynnymhcixlaylycrenba

### 2. Abre el SQL Editor
- En el menú lateral izquierdo, busca **"SQL Editor"**
- Haz clic en **"New Query"**

### 3. Ejecuta el schema
1. Abre el archivo `backend/database/schema.sql`
2. Copia **TODO** el contenido del archivo
3. Pégalo en el editor SQL de Supabase
4. Haz clic en el botón **"Run"** (▶️)

### 4. Verifica que se creó correctamente
Deberías ver un mensaje de éxito y las siguientes tablas creadas:
- ✅ `usuarios` - Para almacenar usuarios registrados
- ✅ `casos` - Para reportes de niños desaparecidos
- ✅ `pistas` - Para pistas de la comunidad

### 5. Prueba la conexión
Después de ejecutar el schema, ejecuta:
```powershell
cd backend
node test-connection.js
```

Deberías ver:
```
✅ Conexión exitosa a Supabase
✅ Tabla 'usuarios' encontrada
✅ Tabla 'casos' encontrada
✅ Tabla 'pistas' encontrada
```

## 🔐 Políticas de Seguridad (RLS)

El schema incluye **Row Level Security (RLS)** para proteger los datos:

- **Usuarios**: Pueden ver y editar solo su propio perfil
- **Casos**: 
  - Todos pueden ver casos ACTIVOS
  - Solo el reportero puede editar su caso
  - Admins pueden ver/editar todos los casos
- **Pistas**:
  - Todos pueden crear pistas
  - Solo admins pueden modificarlas

## 📊 Estructura de Tablas

### usuarios
```sql
- id_usuario (UUID, PK)
- nombre, correo, telefono
- password_hash
- es_administrador (boolean)
- fecha_registro, created_at, updated_at
```

### casos
```sql
- id_caso (UUID, PK)
- id_usuario_reportero (FK → usuarios)
- nombre_desaparecido, edad, sexo
- descripcion_fisica, descripcion_ropa, descripcion_hechos
- fecha_desaparicion
- ubicacion (latitud, longitud, direccion_texto)
- estado_caso (PENDIENTE_REVISION, ACTIVO, RESUELTO, RECHAZADO)
- foto_url
- contacto_nombre, contacto_telefono, contacto_correo
- created_at, updated_at
```

### pistas
```sql
- id_pista (UUID, PK)
- id_caso (FK → casos)
- id_usuario (FK → usuarios)
- descripcion
- ubicacion (latitud, longitud, direccion_texto)
- fecha_avistamiento
- foto_url
- estado_verificacion (PENDIENTE, VERIFICADA, FALSA)
- created_at, updated_at
```

## 🔄 Triggers automáticos

El schema incluye un trigger que actualiza automáticamente el campo `updated_at` cada vez que se modifica un registro en cualquier tabla.

## ⚠️ Notas Importantes

1. **No modifiques manualmente las tablas** una vez creadas. Si necesitas cambios, crea migrations.
2. **Las políticas RLS están activas** - asegúrate de usar el `supabaseAdmin` client para operaciones administrativas.
3. **Los UUIDs se generan automáticamente** - no es necesario enviarlos al crear registros.

## 🚨 Si algo sale mal

Si obtienes errores al ejecutar el schema:

1. **Error: "relation already exists"**
   - Las tablas ya existen. Puedes borrarlas desde la UI de Supabase y volver a ejecutar.

2. **Error de permisos**
   - Asegúrate de estar usando el SERVICE_ROLE_KEY cuando ejecutes desde el backend.

3. **Error: "violates foreign key constraint"**
   - Verifica que las tablas se crearon en el orden correcto (usuarios → casos → pistas).
