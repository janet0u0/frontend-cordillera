import { login, registrar, getDashboard } from './api';

global.fetch = jest.fn();

describe('Pruebas del servicio API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  /* =========================
     1. LOGIN OK
  ========================= */
  test('login() debe llamar al endpoint correcto', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        nombre: 'Janet',
        email: 'janet@test.com',
        rol: 'ADMIN_SISTEMA'
      }),
    });

    const resultado = await login('janet@test.com', '123456');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/usuarios/login',
      expect.objectContaining({ method: 'POST' })
    );

    expect(resultado.email).toBe('janet@test.com');
  });

  /* =========================
     2. LOGIN ERROR OK FALSE
  ========================= */
  test('login() debe retornar error cuando respuesta no es ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Credenciales inválidas' }),
    });

    const resultado = await login('malo@test.com', 'wrong');

    expect(resultado.error).toBeDefined();
  });

  /* =========================
     3. LOGIN FALLBACK ERROR (BRANCH FALTANTE)
  ========================= */
  test('login() fallback cuando backend no envía error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}), // 👈 clave
    });

    const resultado = await login('test@test.com', '123');

    expect(resultado.error).toBe('Error en la petición');
  });

  /* =========================
     4. LOGIN CATCH ERROR (NETWORK)
  ========================= */
  test('login() debe manejar error de conexión', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const resultado = await login('janet@test.com', '123456');

    expect(resultado.error).toBe('Network error');
  });

  /* =========================
     5. LOGIN CATCH + CONSOLE.ERROR
  ========================= */
  test('login() debe llamar console.error en catch', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockRejectedValueOnce(new Error('Network fail'));

    const resultado = await login('test@test.com', '123');

    expect(resultado.error).toBe('Network fail');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  /* =========================
     6. REGISTRAR OK
  ========================= */
  test('registrar() debe llamar al endpoint correcto', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        id: 2,
        nombre: 'Nuevo',
        email: 'nuevo@test.com',
        rol: 'ANALISTA'
      }),
    });

    const resultado = await registrar({
      nombre: 'Nuevo',
      email: 'nuevo@test.com',
      password: '123456',
      rol: 'ANALISTA'
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/usuarios/registrar',
      expect.objectContaining({ method: 'POST' })
    );

    expect(resultado.email).toBe('nuevo@test.com');
  });

  /* =========================
     7. DASHBOARD OK
  ========================= */
  test('getDashboard() debe llamar al BFF con el rol correcto', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        tipoReporte: 'ESTRATÉGICO',
        rol: 'EJECUTIVO',
        ventasTotales: 10000000
      }),
    });

    const resultado = await getDashboard('EJECUTIVO');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8084/api/bff/dashboard?rol=EJECUTIVO',
      expect.objectContaining({ method: 'GET' })
    );

    expect(resultado.tipoReporte).toBe('ESTRATÉGICO');
  });

});
