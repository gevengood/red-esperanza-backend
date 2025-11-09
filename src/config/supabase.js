/**
 * RED ESPERANZA - SUPABASE CLIENT
 * Cliente de conexión a Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

// Validar que las credenciales existan
if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Las credenciales de Supabase no están configuradas. Verifica el archivo .env');
}

// Crear cliente de Supabase con la Anon Key (para operaciones normales)
const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Crear cliente admin de Supabase con la Service Key (para operaciones admin)
const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey || config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = {
  supabase,
  supabaseAdmin,
};
