import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import * as api from '../services/api';

jest.mock('../services/api', () => ({
  __esModule: true,
  login: jest.fn(),
  registrar: jest.fn(),
  getDashboard: jest.fn(),
  obtenerVentas: jest.fn(),
}));

const renderConProvider = (ui) => {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

describe('Login Component - Cobertura Completa', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    window.alert = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            nombre: 'Janet',
            email: 'janet@test.com',
            rol: 'ADMIN_SISTEMA'
          }),
      })
    );
  });

  test('1. Login exitoso', async () => {
    api.login.mockResolvedValue({
      id: 1,
      nombre: 'Janet',
      email: 'ejecutivo@cordillera.cl',
      rol: 'EJECUTIVO'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'ejecutivo@cordillera.cl' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: '123456' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith(
        'ejecutivo@cordillera.cl',
        '123456'
      );
    });
  });

  test('2. Login con campos vacíos', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-boton'));

    expect(
      screen.getByText(/Por favor completa todos los campos/i)
    ).toBeInTheDocument();
  });

  test('3. Login con credenciales inválidas', async () => {
    api.login.mockResolvedValue({
      error: 'Credenciales inválidas'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'malo@test.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: 'wrongpass' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(
        screen.getByText(/Credenciales inválidas/i)
      ).toBeInTheDocument();
    });
  });

  test('4. Error de conexión durante login', async () => {
    api.login.mockRejectedValue(
      new Error('Error de conexión')
    );

    const { container } = renderConProvider(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'test@test.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: '123456' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(
        screen.getByText(/Error de conexión/i)
      ).toBeInTheDocument();
    });
  });

  test('5. Cambia a modo registro', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    expect(
      screen.getByText(/Crear Cuenta/i)
    ).toBeInTheDocument();
  });

  test('6. Registro exitoso', async () => {
    api.registrar.mockResolvedValue({
      id: 2,
      nombre: 'Nuevo',
      email: 'nuevo@test.com',
      rol: 'ANALISTA'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    fireEvent.change(
      screen.getByPlaceholderText('Tu nombre'),
      { target: { value: 'Nuevo Usuario' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'nuevo@test.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: '123456' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(api.registrar).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        '✅ Registro exitoso. Ahora puedes iniciar sesión.'
      );
    });
  });

  test('7. Registro con campos vacíos', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    fireEvent.click(container.querySelector('.login-boton'));

    expect(
      screen.getByText(/Por favor completa todos los campos/i)
    ).toBeInTheDocument();
  });

  test('8. Registro con error de API', async () => {
    api.registrar.mockResolvedValue({
      error: 'Correo ya registrado'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    fireEvent.change(
      screen.getByPlaceholderText('Tu nombre'),
      { target: { value: 'Usuario Test' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'usuario@test.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: '123456' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(
        screen.getByText(/Correo ya registrado/i)
      ).toBeInTheDocument();
    });
  });

  test('9. Cambia el rol durante el registro', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    const selectRol = screen.getByRole('combobox');

    fireEvent.change(selectRol, {
      target: { value: 'ANALISTA' }
    });

    expect(selectRol.value).toBe('ANALISTA');
  });

  test('10. Limpia error al cambiar entre login y registro', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-boton'));

    expect(
      screen.getByText(/Por favor completa todos los campos/i)
    ).toBeInTheDocument();

    fireEvent.click(container.querySelector('.login-toggle'));

    expect(
      screen.queryByText(/Por favor completa todos los campos/i)
    ).not.toBeInTheDocument();
  });

  test('11. Después de registrar vuelve a pantalla login', async () => {
    api.registrar.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: 'ANALISTA'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    fireEvent.change(
      screen.getByPlaceholderText('Tu nombre'),
      { target: { value: 'Usuario Test' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('usuario@cordillera.cl'),
      { target: { value: 'usuario@test.com' } }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••'),
      { target: { value: '123456' } }
    );

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(
        screen.getByText(/Iniciar Sesión/i)
      ).toBeInTheDocument();
    });
  });

});