import { login, registrar, getDashboard } from './api';

describe('Pruebas del servicio API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login() debe llamar al endpoint correcto', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1, nombre: 'Janet', email: 'janet@test.com', rol: 'ADMIN_SISTEMA'
        }),
      })
    );

    const resultado = await login('janet@test.com', '123456');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/usuarios/login',
      expect.objectContaining({ method: 'POST' })
    );
    expect(resultado.email).toBe('janet@test.com');
  });

  test('login() debe retornar error cuando respuesta no es ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Credenciales inválidas' }),
      })
    );

    const resultado = await login('malo@test.com', 'wrong');

    expect(resultado.error).toBeDefined();
  });

  test('registrar() debe llamar al endpoint correcto', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 2, nombre: 'Nuevo', email: 'nuevo@test.com', rol: 'ANALISTA'
        }),
      })
    );

    const resultado = await registrar({
      nombre: 'Nuevo', email: 'nuevo@test.com',
      password: '123456', rol: 'ANALISTA'
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8081/api/usuarios/registrar',
      expect.objectContaining({ method: 'POST' })
    );
    expect(resultado.email).toBe('nuevo@test.com');
  });

  test('getDashboard() debe llamar al BFF con el rol correcto', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          tipoReporte: 'ESTRATÉGICO',
          rol: 'EJECUTIVO',
          ventasTotales: 10000000
        }),
      })
    );

    const resultado = await getDashboard('EJECUTIVO');

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8084/api/bff/dashboard?rol=EJECUTIVO',
      expect.objectContaining({ method: 'GET' })
    );
    expect(resultado.tipoReporte).toBe('ESTRATÉGICO');
  });

  test('login() debe manejar error de conexión', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    const resultado = await login('janet@test.com', '123456');

    expect(resultado.error).toBeDefined();
  });
});