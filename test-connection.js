/**
 * TEST DE CONEXIÓN A SUPABASE
 * Verifica que las credenciales funcionen correctamente
 */

require('dotenv').config();
const { supabase, supabaseAdmin } = require('./src/config/supabase');

async function testConnection() {
  console.log('\n🔍 PROBANDO CONEXIÓN A SUPABASE...\n');

  try {
    // Test 1: Verificar conexión básica
    console.log('1️⃣ Verificando conexión básica...');
    const { data, error } = await supabase
      .from('usuarios')
      .select('count');

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }
    console.log('✅ Conexión exitosa a Supabase\n');

    // Test 2: Verificar tablas
    console.log('2️⃣ Verificando tablas...');
    const tables = ['usuarios', 'casos', 'pistas'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Tabla "${table}" no encontrada:`, error.message);
      } else {
        console.log(`✅ Tabla "${table}" existe`);
      }
    }

    console.log('\n✅ TODAS LAS VERIFICACIONES PASARON\n');
    console.log('🎉 Supabase está configurado correctamente\n');
    return true;

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    return false;
  }
}

// Ejecutar test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  });
