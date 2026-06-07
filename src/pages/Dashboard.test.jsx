import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

jest.mock('../context/AuthContext');
jest.mock('../services/api');

describe('Dashboard Component', () => {

  const cerrarSesionMock = jest.fn();

  const baseAuth = {
    usuario: { nombre: 'Ejecutivo Test', rol: 'EJECUTIVO' },
    cerrarSesion: cerrarSesionMock
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue(baseAuth);
  });

  const mockDashboard = (overrides = {}) => ({
    tipoReporte: 'EJECUTIVO',
    mensaje: 'Dashboard OK',
    estadoGeneral: 'VERDE',
    ventasTotales: 1000,
    metaVentas: 2000,
    porcentajeCumplimiento: 50,
    rentabilidadNeta: null,
    productosStockCritico: null,
    transaccionesHoy: null,
    generadoEn: new Date().toISOString(),
    datosEnTiempoReal: true,
    ...overrides
  });

  /* =========================
     1. RENDER
  ========================= */
  test('renderiza dashboard correctamente', async () => {
    api.getDashboard.mockResolvedValue(mockDashboard());

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard OK/i)).toBeInTheDocument();
    });
  });

  /* =========================
     2. CERRAR SESIÓN
  ========================= */
  test('cerrar sesión funciona', async () => {
    api.getDashboard.mockResolvedValue(mockDashboard());

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Cerrar Sesión/i));

    expect(cerrarSesionMock).toHaveBeenCalledTimes(1);
  });

  /* =========================
     3. ERROR
  ========================= */
  test('muestra error BFF', async () => {
    api.getDashboard.mockRejectedValue(new Error('fail'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/No se pudo conectar con el BFF/i)).toBeInTheDocument();
    });
  });

  /* =========================
     4. REINTENTO
  ========================= */
  test('reintenta carga correctamente', async () => {
    api.getDashboard
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockDashboard({ mensaje: 'RECUPERADO' }));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Reintentar/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Reintentar/i));

    await waitFor(() => {
      expect(screen.getByText(/RECUPERADO/i)).toBeInTheDocument();
    });
  });

  /* =========================
     5. KPIs
  ========================= */
  test('muestra KPIs', async () => {
    api.getDashboard.mockResolvedValue(
      mockDashboard({
        rentabilidadNeta: 100,
        productosStockCritico: 5,
        transaccionesHoy: 2
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ventas Totales/i)).toBeInTheDocument();
      expect(screen.getByText(/Rentabilidad Neta/i)).toBeInTheDocument();
      expect(screen.getByText(/Stock Crítico/i)).toBeInTheDocument();
      expect(screen.getByText(/Transacciones Hoy/i)).toBeInTheDocument();
    });
  });

  /* =========================
     6. ACTUALIZAR
  ========================= */
  test('actualiza dashboard', async () => {
    api.getDashboard.mockResolvedValue(mockDashboard());

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Actualizar/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Actualizar/i));

    expect(api.getDashboard).toHaveBeenCalledTimes(2);
  });

  /* =========================
     7. MAPEO ROLES
  ========================= */
  test('mapea roles fallback', async () => {
    useAuth.mockReturnValue({
      usuario: { nombre: 'Test', rol: 'RANDOM' },
      cerrarSesion: cerrarSesionMock
    });

    api.getDashboard.mockResolvedValue(mockDashboard());

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Grupo Cordillera/i)).toBeInTheDocument();
    });
  });

  /* =========================
     8. LOADING
  ========================= */
  test('muestra loading', () => {
    api.getDashboard.mockReturnValue(new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText(/Cargando dashboard/i)).toBeInTheDocument();
  });

  /* =========================
     9. BRANCH FINAL CRÍTICO (FIX REAL)
  ========================= */
  test('cubre fallback icono y estado desconocido', async () => {

    useAuth.mockReturnValue({
      usuario: { nombre: 'Test', rol: 'UNKNOWN_ROLE' },
      cerrarSesion: cerrarSesionMock
    });

    api.getDashboard.mockResolvedValue(
      mockDashboard({
        estadoGeneral: 'NEGRO',
        mensaje: 'OK FALLBACK TEST'
      })
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/OK FALLBACK TEST/i)).toBeInTheDocument();
      expect(screen.getByText(/NEGRO/i)).toBeInTheDocument();
      expect(screen.getByText(/👤/)).toBeInTheDocument();
    });
  });

});