import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';

// Simula el contexto local de autenticación
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    usuario: { nombre: 'Ejecutivo de Pruebas', rol: 'EJECUTIVO' },
    cerrarSesion: jest.fn(),
  }),
}));

describe('Pruebas en el componente <Dashboard />', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            ventasTotales: 125000,
            metaVentas: 200000,
            cumplimiento: 62.5,
          }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Debería mostrar las ventas totales en pantalla', async () => {
    render(<Dashboard />);

    // Buscamos "125" de forma flexible para evitar conflictos con el formato de puntos ($ 125.000)
    await waitFor(() => {
      expect(screen.getByText(/125/i)).toBeInTheDocument();
    });
  });
});