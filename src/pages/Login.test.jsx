import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import * as api from '../services/api';

// Mock de la API completo
jest.mock('../services/api', () => ({
  __esModule: true,
  login: jest.fn(),
  registrar: jest.fn(),
  getDashboard: jest.fn(),
  obtenerVentas: jest.fn(),
}));

// Wrapper con AuthProvider para todos los tests
const renderConProvider = (ui) => {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

describe('Pruebas de Cobertura Total (100%) - Componente Login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, nombre: 'Janet', email: 'janet@test.com', rol: 'ADMIN_SISTEMA' }),
      })
    );
  });

  test('1. Flujo Completo: Cambio de campos y Login Exitoso', async () => {
    api.login.mockResolvedValue({
      id: 1, nombre: 'Janet',
      email: 'ejecutivo@cordillera.cl', rol: 'EJECUTIVO'
    });

    const { container } = renderConProvider(<Login />);

    fireEvent.change(screen.getByPlaceholderText('usuario@cordillera.cl'), {
      target: { value: 'ejecutivo@cordillera.cl' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: '123456' }
    });

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('ejecutivo@cordillera.cl', '123456');
    });
  });

  test('2. Flujo Alternativo: Intento de Login con campos vacíos', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-boton'));

    expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
  });

  test('3. Flujo Alternativo: Error de Servidor o Credenciales Incorrectas', async () => {
    api.login.mockResolvedValue({ error: 'Credenciales inválidas' });

    const { container } = renderConProvider(<Login />);

    fireEvent.change(screen.getByPlaceholderText('usuario@cordillera.cl'), {
      target: { value: 'malo@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  test('4. Interacción con el link de Registro (Toggle)', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));

    expect(screen.getByText(/Crear Cuenta/i)).toBeInTheDocument();
  });

  test('5. Flujo de Registro exitoso', async () => {
    api.registrar.mockResolvedValue({
      id: 2, nombre: 'Nuevo', email: 'nuevo@test.com', rol: 'ANALISTA'
    });

    const { container } = renderConProvider(<Login />);

    // Cambiar a modo registro
    fireEvent.click(container.querySelector('.login-toggle'));

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), {
      target: { value: 'Nuevo Usuario' }
    });
    fireEvent.change(screen.getByPlaceholderText('usuario@cordillera.cl'), {
      target: { value: 'nuevo@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: '123456' }
    });

    fireEvent.click(container.querySelector('.login-boton'));

    await waitFor(() => {
      expect(api.registrar).toHaveBeenCalled();
    });
  });

  test('6. Registro con campos vacíos muestra error', () => {
    const { container } = renderConProvider(<Login />);

    fireEvent.click(container.querySelector('.login-toggle'));
    fireEvent.click(container.querySelector('.login-boton'));

    expect(screen.getByText(/Por favor completa todos los campos/i))
      .toBeInTheDocument();
  });
});