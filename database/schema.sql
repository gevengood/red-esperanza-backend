-- ========================================
-- RED ESPERANZA - SCHEMA DE BASE DE DATOS
-- Supabase PostgreSQL
-- ========================================

-- IMPORTANTE: Ejecutar este script en el SQL Editor de Supabase

-- ========================================
-- 1. TABLA: usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(50),
  es_administrador BOOLEAN DEFAULT FALSE,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_admin ON usuarios(es_administrador);

-- ========================================
-- 2. TABLA: casos
-- ========================================
CREATE TABLE IF NOT EXISTS casos (
  id_caso UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario_reportero UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  
  -- Datos del desaparecido
  nombre_desaparecido VARCHAR(255) NOT NULL,
  edad_desaparecido INTEGER NOT NULL CHECK (edad_desaparecido >= 0 AND edad_desaparecido <= 18),
  sexo_desaparecido VARCHAR(50) NOT NULL CHECK (sexo_desaparecido IN ('MASCULINO', 'FEMENINO', 'OTRO')),
  descripcion_fisica TEXT,
  descripcion_ropa TEXT,
  descripcion_hechos TEXT NOT NULL,
  
  -- Datos de la desaparición
  fecha_desaparicion TIMESTAMP WITH TIME ZONE NOT NULL,
  ubicacion_latitud DECIMAL(10, 8) NOT NULL,
  ubicacion_longitud DECIMAL(11, 8) NOT NULL,
  direccion_texto TEXT NOT NULL,
  
  -- Estado del caso
  estado_caso VARCHAR(50) DEFAULT 'PENDIENTE_REVISION' 
    CHECK (estado_caso IN ('PENDIENTE_REVISION', 'ACTIVO', 'RESUELTO', 'RECHAZADO')),
  
  -- Datos de contacto
  nombre_contacto VARCHAR(255) NOT NULL,
  telefono_contacto VARCHAR(50) NOT NULL,
  correo_contacto VARCHAR(255) NOT NULL,
  parentesco VARCHAR(100) NOT NULL,
  
  -- Fotos
  url_foto_1 TEXT,
  url_foto_2 TEXT,
  url_foto_3 TEXT,
  
  -- Timestamps
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_resolucion TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para casos
CREATE INDEX idx_casos_usuario ON casos(id_usuario_reportero);
CREATE INDEX idx_casos_estado ON casos(estado_caso);
CREATE INDEX idx_casos_fecha_desaparicion ON casos(fecha_desaparicion);
CREATE INDEX idx_casos_ubicacion ON casos(ubicacion_latitud, ubicacion_longitud);

-- ========================================
-- 3. TABLA: pistas
-- ========================================
CREATE TABLE IF NOT EXISTS pistas (
  id_pista UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_caso UUID NOT NULL REFERENCES casos(id_caso) ON DELETE CASCADE,
  id_usuario_que_aporta UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  
  mensaje TEXT NOT NULL,
  url_foto_pista TEXT,
  
  estado_pista VARCHAR(50) DEFAULT 'PENDIENTE_REVISION'
    CHECK (estado_pista IN ('PENDIENTE_REVISION', 'VERIFICADA', 'RECHAZADA')),
  
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pistas
CREATE INDEX idx_pistas_caso ON pistas(id_caso);
CREATE INDEX idx_pistas_usuario ON pistas(id_usuario_que_aporta);
CREATE INDEX idx_pistas_estado ON pistas(estado_pista);

-- ========================================
-- 4. FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casos_updated_at
  BEFORE UPDATE ON casos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pistas_updated_at
  BEFORE UPDATE ON pistas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pistas ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios (todos pueden leer, solo el dueño puede actualizar)
CREATE POLICY "Usuarios pueden ver todos los perfiles"
  ON usuarios FOR SELECT
  USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id_usuario);

-- Políticas para casos
CREATE POLICY "Todos pueden ver casos activos"
  ON casos FOR SELECT
  USING (estado_caso = 'ACTIVO' OR auth.uid() = id_usuario_reportero);

CREATE POLICY "Usuarios autenticados pueden crear casos"
  ON casos FOR INSERT
  WITH CHECK (auth.uid() = id_usuario_reportero);

CREATE POLICY "Usuarios pueden actualizar sus propios casos"
  ON casos FOR UPDATE
  USING (auth.uid() = id_usuario_reportero);

-- Políticas para pistas
CREATE POLICY "Todos pueden ver pistas verificadas"
  ON pistas FOR SELECT
  USING (estado_pista = 'VERIFICADA');

CREATE POLICY "Usuarios autenticados pueden crear pistas"
  ON pistas FOR INSERT
  WITH CHECK (auth.uid() = id_usuario_que_aporta);

-- ========================================
-- 6. DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Insertar usuario administrador de ejemplo
-- NOTA: Cambiar la contraseña en producción
-- Password: admin123 (hasheado con bcrypt)
INSERT INTO usuarios (id_usuario, nombre, correo, password_hash, telefono, es_administrador)
VALUES (
  gen_random_uuid(),
  'Admin Red Esperanza',
  'admin@redesperanza.org',
  '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', -- Cambiar por hash real
  '+57 601 000 0000',
  TRUE
) ON CONFLICT (correo) DO NOTHING;

-- ========================================
-- SCRIPT COMPLETADO
-- ========================================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE casos IS 'Tabla de casos de menores desaparecidos';
COMMENT ON TABLE pistas IS 'Tabla de pistas aportadas por la comunidad';
