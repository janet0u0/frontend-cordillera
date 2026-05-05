import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard } from '../services/api';
import './Dashboard.css';

/**
 * Página Dashboard - Grupo Cordillera
 * Muestra KPIs según el rol del usuario autenticado.
 * Aplica el Patrón Factory Method consumiendo desde el BFF.
 */
function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario, cerrarSesion } = useAuth();

  /**
   * NORMALIZACIÓN DE ROL:
   * Asegura que el string enviado al BFF sea exactamente el que espera el switch-case.
   */
  const mapearRol = (rol) => {
    if (!rol) return 'EJECUTIVO';
    const r = rol.toUpperCase().trim();
    if (r === 'ADMIN' || r === 'EJECUTIVO') return 'EJECUTIVO';
    if (r === 'ANALISTA') return 'ANALISTA';
    if (r === 'SUPERVISOR') return 'SUPERVISOR';
    return 'EJECUTIVO'; 
  };

  const rolBff = mapearRol(usuario.rol);

  const iconoRol = (rol) => {
    switch (rol) {
      case 'EJECUTIVO': return '👔';
      case 'ANALISTA': return '📊';
      case 'SUPERVISOR': return '🔍';
      default: return '👤';
    }
  };

  const colorEstado = (estado) => {
    const colores = {
      'VERDE': '#00b894',
      'AMARILLO': '#fdcb6e',
      'ROJO': '#d63031'
    };
    return colores[estado] || '#636e72';
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getDashboard(rolBff);
      setDatos(data);
    } catch (err) {
      setError('No se pudo conectar con el BFF.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pagina">
      {/* Header del Sistema */}
      <div className="header">
        <div className="header-contenido">
          <div>
            <h1 className="header-titulo">📊 Grupo Cordillera</h1>
            <p className="header-subtitulo">Plataforma de Monitoreo Inteligente</p>
          </div>
          <div className="header-derecha">
            <div className="usuario-info">
              <span>{iconoRol(rolBff)} {usuario.nombre}</span>
              <span className="rol-badge">{rolBff}</span>
            </div>
            <button onClick={cerrarSesion} className="btn-cerrar">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="contenido">
        {cargando && <div className="cargando">⏳ Cargando dashboard...</div>}

        {error && (
          <div className="error">
            ⚠️ {error}
            <button onClick={cargarDashboard} className="btn-reintentar">Reintentar</button>
          </div>
        )}

        {datos && (
          <>
            {/* Encabezado dinámico del Reporte fabricado por el BFF */}
            <div className="reporte-header">
              <div>
                <h2 className="reporte-titulo">
                  {iconoRol(datos.tipoReporte)} Reporte {datos.tipoReporte}
                </h2>
                <p className="reporte-mensaje">{datos.mensaje}</p>
              </div>
              <div className="estado-badge" style={{ backgroundColor: colorEstado(datos.estadoGeneral) }}>
                {datos.estadoGeneral}
              </div>
            </div>

            <div className="kpis-grid">
              {/* Tarjetas Base (Comunes) */}
              <div className="kpi-card" style={{ borderTop: '4px solid #0984e3' }}>
                <p className="kpi-label">💰 Ventas Totales</p>
                <p className="kpi-valor">${datos.ventasTotales?.toLocaleString()}</p>
                <p className="kpi-sub">Acumulado del período</p>
              </div>

              <div className="kpi-card" style={{ borderTop: '4px solid #6c5ce7' }}>
                <p className="kpi-label">🎯 Meta de Ventas</p>
                <p className="kpi-valor">${datos.metaVentas?.toLocaleString()}</p>
                <p className="kpi-sub">Objetivo organizacional</p>
              </div>

              <div className="kpi-card" style={{ borderTop: '4px solid #00b894' }}>
                <p className="kpi-label">📈 Cumplimiento</p>
                <p className="kpi-valor">{datos.porcentajeCumplimiento}%</p>
                <div className="barra-fondo">
                  <div className="barra-relleno" style={{ width: `${datos.porcentajeCumplimiento}%` }} />
                </div>
              </div>

              {/* RENDERIZADO CONDICIONAL SEGÚN ROL (FACTORY METHOD RESULT) */}
              
              {datos.rentabilidadNeta !== null && (
                <div className="kpi-card" style={{ borderTop: '4px solid #fdcb6e' }}>
                  <p className="kpi-label">💹 Rentabilidad Neta</p>
                  <p className="kpi-valor" style={{ color: '#e17055' }}>
                    ${datos.rentabilidadNeta?.toLocaleString()}
                  </p>
                  <p className="kpi-sub">🔒 Vista Exclusiva Gerencial</p>
                </div>
              )}

              {datos.productosStockCritico !== null && (
                <div className="kpi-card" style={{ borderTop: '4px solid #d63031' }}>
                  <p className="kpi-label">⚠️ Stock Crítico</p>
                  <p className="kpi-valor" style={{ color: '#d63031' }}>{datos.productosStockCritico}</p>
                  <p className="kpi-sub">Productos bajo mínimo</p>
                </div>
              )}

              {datos.transaccionesHoy !== null && (
                <div className="kpi-card" style={{ borderTop: '4px solid #00cec9' }}>
                  <p className="kpi-label">🛒 Transacciones Hoy</p>
                  <p className="kpi-valor" style={{ color: '#00cec9' }}>{datos.transaccionesHoy}</p>
                  <p className="kpi-sub">Operaciones procesadas</p>
                </div>
              )}
            </div>

            {/* Footer de Estado de Servicios (Circuit Breaker status) */}
            <div className="footer">
              <p>⏱ Generado: {new Date(datos.generadoEn).toLocaleString()}</p>
              <p>
                {datos.datosEnTiempoReal ? '🟢 Conexión directa' : '🟡 Modo Resiliencia (Caché)'}
              </p>
              <button onClick={cargarDashboard} className="btn-actualizar">🔄 Actualizar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;