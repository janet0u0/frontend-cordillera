import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./pages/Login', () => () => (
  <div>Login Mock</div>
));

jest.mock('./pages/Dashboard', () => () => (
  <div>Dashboard Mock</div>
));

describe('App', () => {

  beforeEach(() => {
    sessionStorage.clear();
  });

  test('muestra Login cuando no existe sesión', () => {
    render(<App />);

    expect(
      screen.getByText('Login Mock')
    ).toBeInTheDocument();
  });

  test('muestra Dashboard cuando existe sesión', () => {
    sessionStorage.setItem(
      'usuario_cordillera',
      JSON.stringify({
        nombre: 'Janet',
        rol: 'ADMIN_SISTEMA'
      })
    );

    render(<App />);

    expect(
      screen.getByText('Dashboard Mock')
    ).toBeInTheDocument();
  });

});