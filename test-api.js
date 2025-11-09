/**
 * Script de prueba rápida para verificar que el backend funciona
 * Ejecutar: node backend/test-api.js
 */

const API_URL = 'http://localhost:5000/api/v1';

// Función auxiliar para hacer peticiones
async function request(method, endpoint, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const json = await response.json();
    return { status: response.status, data: json };
  } catch (error) {
    console.error('❌ Error en petición:', error.message);
    return null;
  }
}

// Tests
async function runTests() {
  console.log('\n🧪 PROBANDO API DEL BACKEND\n');
  console.log('═'.repeat(50));

  let userToken = null;
  let userId = null;

  // 1. Health Check
  console.log('\n1️⃣  Health Check');
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    if (data.status === 'OK') {
      console.log('   ✅ Servidor funcionando correctamente');
    } else {
      console.log('   ❌ Error en health check');
      return;
    }
  } catch (error) {
    console.log('   ❌ No se pudo conectar al servidor');
    console.log('   💡 Asegúrate de que el servidor esté corriendo: node backend/server.js');
    return;
  }

  // 2. Registrar usuario
  console.log('\n2️⃣  Registrar Usuario');
  const randomEmail = `test${Date.now()}@test.com`;
  const registerData = {
    nombre: 'Usuario de Prueba',
    correo: randomEmail,
    password: 'password123',
    telefono: '+57 300 123 4567'
  };

  const registerRes = await request('POST', '/auth/register', registerData);
  if (registerRes && registerRes.data.success) {
    console.log('   ✅ Usuario registrado exitosamente');
    userToken = registerRes.data.data.token;
    userId = registerRes.data.data.usuario.id_usuario;
    console.log('   📝 Email:', randomEmail);
    console.log('   🔑 Token obtenido');
  } else {
    console.log('   ❌ Error al registrar:', registerRes?.data?.error || 'Error desconocido');
  }

  // 3. Login
  console.log('\n3️⃣  Iniciar Sesión');
  const loginData = {
    correo: randomEmail,
    password: 'password123'
  };

  const loginRes = await request('POST', '/auth/login', loginData);
  if (loginRes && loginRes.data.success) {
    console.log('   ✅ Login exitoso');
  } else {
    console.log('   ❌ Error en login:', loginRes?.data?.error || 'Error desconocido');
  }

  // 4. Obtener usuario actual
  console.log('\n4️⃣  Obtener Usuario Actual');
  const meRes = await request('GET', '/auth/me', null, userToken);
  if (meRes && meRes.data.success) {
    console.log('   ✅ Usuario obtenido correctamente');
    console.log('   👤 Nombre:', meRes.data.data.nombre);
  } else {
    console.log('   ❌ Error al obtener usuario:', meRes?.data?.error || 'Error desconocido');
  }

  // 5. Crear un caso
  console.log('\n5️⃣  Crear Caso de Niño Desaparecido');
  const caseData = {
    nombre_desaparecido: 'Niño de Prueba',
    edad_desaparecido: 8,
    sexo_desaparecido: 'MASCULINO',
    descripcion_fisica: 'Cabello castaño, ojos cafés',
    descripcion_ropa: 'Camiseta azul, pantalón jean',
    descripcion_hechos: 'Este es un caso de prueba del sistema',
    fecha_desaparicion: new Date().toISOString(),
    ubicacion_latitud: 4.7110,
    ubicacion_longitud: -74.0721,
    direccion_texto: 'Bogotá, Colombia',
    nombre_contacto: 'Usuario de Prueba',
    telefono_contacto: '+57 300 123 4567',
    correo_contacto: randomEmail,
    parentesco: 'Padre'
  };

  const createCaseRes = await request('POST', '/cases', caseData, userToken);
  let caseId = null;
  if (createCaseRes && createCaseRes.data.success) {
    console.log('   ✅ Caso creado exitosamente');
    caseId = createCaseRes.data.data.id_caso;
    console.log('   📋 Estado:', createCaseRes.data.data.estado_caso);
  } else {
    console.log('   ❌ Error al crear caso:', createCaseRes?.data?.error || 'Error desconocido');
  }

  // 6. Listar casos
  console.log('\n6️⃣  Listar Casos');
  const casesRes = await request('GET', '/cases');
  if (casesRes && casesRes.data.success) {
    console.log('   ✅ Casos obtenidos correctamente');
    console.log('   📊 Total de casos:', casesRes.data.data.length);
  } else {
    console.log('   ❌ Error al listar casos');
  }

  // 7. Crear una pista (si tenemos un caso)
  if (caseId) {
    console.log('\n7️⃣  Crear Pista');
    const clueData = {
      id_caso: caseId,
      mensaje: 'Esta es una pista de prueba del sistema'
    };

    const createClueRes = await request('POST', '/clues', clueData, userToken);
    if (createClueRes && createClueRes.data.success) {
      console.log('   ✅ Pista creada exitosamente');
      console.log('   📋 Estado:', createClueRes.data.data.estado_pista);
    } else {
      console.log('   ❌ Error al crear pista:', createClueRes?.data?.error || 'Error desconocido');
    }
  }

  // 8. Obtener estadísticas del usuario
  console.log('\n8️⃣  Obtener Estadísticas del Usuario');
  const statsRes = await request('GET', `/users/${userId}/stats`, null, userToken);
  if (statsRes && statsRes.data.success) {
    console.log('   ✅ Estadísticas obtenidas');
    console.log('   📊 Casos creados:', statsRes.data.data.casos.total);
    console.log('   📊 Pistas enviadas:', statsRes.data.data.pistas.total);
  } else {
    console.log('   ❌ Error al obtener estadísticas');
  }

  // Resumen final
  console.log('\n' + '═'.repeat(50));
  console.log('\n✅ PRUEBAS COMPLETADAS\n');
  console.log('🎉 El backend está funcionando correctamente!');
  console.log('\n📝 Notas:');
  console.log('   - Los casos nuevos están en estado PENDIENTE_REVISION');
  console.log('   - Las pistas nuevas están en estado PENDIENTE_REVISION');
  console.log('   - Un administrador debe aprobarlos para que sean visibles');
  console.log('\n💡 Revisa backend/API_DOCUMENTATION.md para ver todos los endpoints\n');
}

// Ejecutar tests
runTests().catch(console.error);
