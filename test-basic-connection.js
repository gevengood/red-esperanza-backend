require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 VERIFICANDO CREDENCIALES...\n');
console.log('URL:', supabaseUrl);
console.log('Key (primeros 20 caracteres):', supabaseKey?.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1️⃣ Probando conexión básica...');
    
    // Intentar hacer una consulta simple
    const { data, error } = await supabase
      .from('usuarios')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('\n📋 Esto significa que las tablas no existen todavía.');
      console.log('📝 Necesitas ejecutar el schema.sql en tu proyecto de Supabase:');
      console.log('   1. Ve a https://supabase.com/dashboard/project/ynnymhcixlaylycrenba');
      console.log('   2. Abre el SQL Editor');
      console.log('   3. Pega el contenido de backend/database/schema.sql');
      console.log('   4. Ejecuta el script');
      return false;
    }
    
    console.log('✅ Conexión exitosa!');
    console.log('📊 La tabla usuarios existe');
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

testConnection();
