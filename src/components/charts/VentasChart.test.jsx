import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import VentasChart from './VentasChart';

/* ================= MOCK CHART.JS ================= */
jest.mock('chart.js', () => {
  const ChartMock = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  }));

  ChartMock.register = jest.fn();

  return {
    Chart: ChartMock,
    registerables: [],
  };
});

/* ================= MOCK CANVAS ================= */
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

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe('VentasChart FINAL', () => {

  test('render correcto con datos válidos', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { sucursal: 'Centro', monto: 100 },
        { sucursal: 'Norte', monto: 200 },
      ],
    });

    render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/Ventas por Sucursal/i)).toBeInTheDocument();
    });
  });

  test('error cuando fetch falla', async () => {
    global.fetch.mockRejectedValueOnce(new Error('fail'));

    render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/MS-Datos no disponible/i)).toBeInTheDocument();
    });
  });

  test('error cuando response no es ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'error' }),
    });

    render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/MS-Datos no disponible/i)).toBeInTheDocument();
    });
  });

  test('estado vacío cuando no hay ventas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/Sin ventas registradas/i)).toBeInTheDocument();
    });
  });

  test('cubre branch ctx null correctamente', async () => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { sucursal: 'A', monto: 100 },
      ],
    });

    render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/Ventas por Sucursal/i)).toBeInTheDocument();
    });
  });

  test('ejecuta cleanup (useEffect unmount)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { sucursal: 'A', monto: 100 },
      ],
    });

    const { unmount } = render(<VentasChart />);

    await waitFor(() => {
      expect(screen.getByText(/Ventas por Sucursal/i)).toBeInTheDocument();
    });

    act(() => {
      unmount();
    });
  });

});