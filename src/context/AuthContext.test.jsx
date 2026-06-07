import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();

  return (
    <>
      <div data-testid="usuario">
        {usuario ? usuario.nombre : 'Sin usuario'}
      </div>

      <button
        onClick={() =>
          iniciarSesion({
            nombre: 'Janet',
            email: 'janet@test.com',
            rol: 'ADMIN'
          })
        }
      >
        Login
      </button>

      <button onClick={cerrarSesion}>
        Logout
      </button>
    </>
  );
}

describe('AuthContext', () => {

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('inicia sin usuario', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId('usuario')
    ).toHaveTextContent('Sin usuario');
  });

  test('iniciarSesion guarda usuario en sessionStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(
      screen.getByTestId('usuario')
    ).toHaveTextContent('Janet');

    expect(
      JSON.parse(
        sessionStorage.getItem('usuario_cordillera')
      ).nombre
    ).toBe('Janet');
  });

  test('cerrarSesion elimina usuario y limpia sessionStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    fireEvent.click(screen.getByText('Logout'));

    expect(
      screen.getByTestId('usuario')
    ).toHaveTextContent('Sin usuario');

    expect(
      sessionStorage.getItem('usuario_cordillera')
    ).toBeNull();
  });

  test('recupera usuario guardado en sessionStorage', () => {
    sessionStorage.setItem(
      'usuario_cordillera',
      JSON.stringify({
        nombre: 'Usuario Guardado'
      })
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId('usuario')
    ).toHaveTextContent('Usuario Guardado');
  });

  test('maneja JSON inválido en sessionStorage', () => {
    sessionStorage.setItem(
      'usuario_cordillera',
      '{json-invalido'
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(
      screen.getByTestId('usuario')
    ).toHaveTextContent('Sin usuario');
  });

});