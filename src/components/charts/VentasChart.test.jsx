import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock completo de chart.js ANTES de cualquier import
jest.mock('chart.js', () => {
  const MockChart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
  }));
  MockChart.register = jest.fn();
  return {
    Chart: MockChart,
    registerables: [],
  };
});

// Mock del canvas getContext
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    fillText: jest.fn(),
    canvas: { width: 100, height: 100 },
  }));
});

import VentasChart from './VentasChart';

describe('Pruebas del componente VentasChart', () => {

  test('Debe mostrar estado de carga inicial', () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<VentasChart />);
    expect(screen.getByText(/Cargando datos/i)).toBeInTheDocument();
  });

  test('Debe mostrar error cuando MS-Datos no está disponible', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );
    render(<VentasChart />);
    await waitFor(() => {
      expect(screen.getByText(/MS-Datos no disponible/i))
        .toBeInTheDocument();
    });
  });

  test('Debe mostrar mensaje cuando no hay ventas registradas', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
    render(<VentasChart />);
    await waitFor(() => {
      expect(screen.getByText(/Sin ventas registradas/i))
        .toBeInTheDocument();
    });
  });

  test('Debe mostrar el título del gráfico', () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<VentasChart />);
    expect(screen.getByText(/Ventas por Sucursal/i)).toBeInTheDocument();
  });

  test('Debe renderizar ventas cuando MS-Datos responde correctamente', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { sucursal: 'Santiago Centro', monto: 50000, cantidad: 3, origen: 'POS' },
          { sucursal: 'Valparaíso', monto: 80000, cantidad: 5, origen: 'ECOMMERCE' },
        ]),
      })
    );
    render(<VentasChart />);
    await waitFor(() => {
      expect(screen.getByText(/Ventas por Sucursal/i)).toBeInTheDocument();
    });
  });
});