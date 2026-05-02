import React, { useState } from 'react';

function Dashboard() {
  const [rol, setRol] = useState('EJECUTIVO');
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerDashboard = async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(
        `http://localhost:8084/api/bff/dashboard?rol=${rol}`
      );
      const data = await respuesta.json();
      setDatos(data);
    } catch (err) {
      setError('No se pudo conectar con el BFF. Verifica que esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  const colorEstado = (estado) => {
    if (estado === 'VERDE') return '#00b894';
    if (estado === 'AMARILLO') return '#fdcb6e';
    if (estado === 'ROJO') return '#d63031';
    return '#636e72';
  };

  const iconoRol = (rol) => {
    if (rol === 'EJECUTIVO') return '👔';
    if (rol === 'ANALISTA') return '📊';
    if (rol === 'SUPERVISOR') return '🔍';
    return '👤';
  };

  return (
    <div style={estilos.pagina}>
      {/* Header */}
      <div style={estilos.header}>
        <div style={estilos.headerContenido}>
          <div>
            <h1 style={estilos.headerTitulo}>📊 Grupo Cordillera</h1>
            <p style={estilos.headerSubtitulo}>
              Plataforma de Monitoreo Inteligente
            </p>
          </div>
          <div style={estilos.headerBadge}>
            <span>🟢 Sistema Activo</span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={estilos.contenido}>

        {/* Card selector de rol */}
        <div style={estilos.card}>
          <h2 style={estilos.cardTitulo}>🔐 Seleccionar Perfil de Acceso</h2>
          <p style={estilos.cardDescripcion}>
            El dashboard se adapta automáticamente según tu rol organizacional
          </p>
          <div style={estilos.rolesGrid}>
            {['EJECUTIVO', 'ANALISTA', 'SUPERVISOR'].map((r) => (
              <div
                key={r}
                onClick={() => setRol(r)}
                style={{
                  ...estilos.rolCard,
                  ...(rol === r ? estilos.rolCardActivo : {})
                }}
              >
                <span style={estilos.rolIcono}>{iconoRol(r)}</span>
                <span style={estilos.rolNombre}>{r}</span>
              </div>
            ))}
          </div>
          <button
            onClick={obtenerDashboard}
            disabled={cargando}
            style={estilos.boton}
          >
            {cargando ? '⏳ Cargando...' : '🚀 Generar Dashboard'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={estilos.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Dashboard */}
        {datos && (
          <>
            {/* Encabezado del reporte */}
            <div style={estilos.reporteHeader}>
              <div>
                <h2 style={estilos.reporteTitulo}>
                  {iconoRol(datos.tipoReporte)} Reporte {datos.tipoReporte}
                </h2>
                <p style={estilos.reporteMensaje}>{datos.mensaje}</p>
              </div>
              <div style={{
                ...estilos.estadoBadge,
                backgroundColor: colorEstado(datos.estadoGeneral)
              }}>
                {datos.estadoGeneral}
              </div>
            </div>

            {/* KPIs Grid */}
            <div style={estilos.kpisGrid}>

              <div style={{...estilos.kpiCard, borderTop: '4px solid #0984e3'}}>
                <p style={estilos.kpiLabel}>💰 Ventas Totales</p>
                <p style={estilos.kpiValor}>
                  ${datos.ventasTotales?.toLocaleString()}
                </p>
                <p style={estilos.kpiSub}>Acumulado del período</p>
              </div>

              <div style={{...estilos.kpiCard, borderTop: '4px solid #6c5ce7'}}>
                <p style={estilos.kpiLabel}>🎯 Meta de Ventas</p>
                <p style={estilos.kpiValor}>
                  ${datos.metaVentas?.toLocaleString()}
                </p>
                <p style={estilos.kpiSub}>Objetivo organizacional</p>
              </div>

              <div style={{...estilos.kpiCard, borderTop: '4px solid #00b894'}}>
                <p style={estilos.kpiLabel}>📈 Cumplimiento</p>
                <p style={{...estilos.kpiValor, color: '#00b894'}}>
                  {datos.porcentajeCumplimiento}%
                </p>
                <div style={estilos.barraFondo}>
                  <div style={{
                    ...estilos.barraRelleno,
                    width: `${datos.porcentajeCumplimiento}%`
                  }}/>
                </div>
              </div>

              {datos.rentabilidadNeta && (
                <div style={{...estilos.kpiCard, borderTop: '4px solid #fdcb6e'}}>
                  <p style={estilos.kpiLabel}>💹 Rentabilidad Neta</p>
                  <p style={{...estilos.kpiValor, color: '#e17055'}}>
                    ${datos.rentabilidadNeta?.toLocaleString()}
                  </p>
                  <p style={estilos.kpiSub}>Solo visible para Ejecutivos</p>
                </div>
              )}

              {datos.productosStockCritico && (
                <div style={{...estilos.kpiCard, borderTop: '4px solid #d63031'}}>
                  <p style={estilos.kpiLabel}>⚠️ Stock Crítico</p>
                  <p style={{...estilos.kpiValor, color: '#d63031'}}>
                    {datos.productosStockCritico}
                  </p>
                  <p style={estilos.kpiSub}>Productos bajo mínimo</p>
                </div>
              )}

              {datos.transaccionesHoy && (
                <div style={{...estilos.kpiCard, borderTop: '4px solid #00cec9'}}>
                  <p style={estilos.kpiLabel}>🛒 Transacciones Hoy</p>
                  <p style={{...estilos.kpiValor, color: '#00cec9'}}>
                    {datos.transaccionesHoy}
                  </p>
                  <p style={estilos.kpiSub}>Operaciones procesadas</p>
                </div>
              )}

            </div>

            {/* Footer del reporte */}
            <div style={estilos.footer}>
              <p>⏱ Generado: {new Date(datos.generadoEn).toLocaleString()}</p>
              <p>
                {datos.datosEnTiempoReal
                  ? '🟢 Datos en tiempo real'
                  : '🟡 Datos desde caché'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const estilos = {
  pagina: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  },
  header: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    padding: '20px 40px',
    color: 'white'
  },
  headerContenido: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1100px',
    margin: '0 auto'
  },
  headerTitulo: { margin: 0, fontSize: '28px' },
  headerSubtitulo: { margin: '4px 0 0', opacity: 0.8, fontSize: '14px' },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px'
  },
  contenido: {
    maxWidth: '1100px',
    margin: '30px auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  cardTitulo: { margin: '0 0 8px', color: '#2c3e50', fontSize: '20px' },
  cardDescripcion: { color: '#636e72', margin: '0 0 24px', fontSize: '14px' },
  rolesGrid: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  rolCard: {
    flex: 1,
    minWidth: '120px',
    padding: '16px',
    border: '2px solid #dfe6e9',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px'
  },
  rolCardActivo: {
    border: '2px solid #3498db',
    backgroundColor: '#ebf5fb'
  },
  rolIcono: { fontSize: '28px' },
  rolNombre: { fontWeight: 'bold', color: '#2c3e50', fontSize: '13px' },
  boton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#ffeaa7',
    border: '1px solid #fdcb6e',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    color: '#2d3436'
  },
  reporteHeader: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px 30px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reporteTitulo: { margin: '0 0 8px', color: '#2c3e50', fontSize: '22px' },
  reporteMensaje: { margin: 0, color: '#636e72', fontSize: '14px' },
  estadoBadge: {
    padding: '10px 24px',
    borderRadius: '24px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  kpisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  kpiCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  kpiLabel: { margin: '0 0 8px', color: '#636e72', fontSize: '13px', fontWeight: 'bold' },
  kpiValor: { margin: '0 0 8px', fontSize: '32px', fontWeight: 'bold', color: '#2c3e50' },
  kpiSub: { margin: 0, color: '#b2bec3', fontSize: '12px' },
  barraFondo: {
    backgroundColor: '#dfe6e9',
    borderRadius: '4px',
    height: '8px',
    marginTop: '8px'
  },
  barraRelleno: {
    backgroundColor: '#00b894',
    borderRadius: '4px',
    height: '8px',
    transition: 'width 0.5s ease'
  },
  footer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px 30px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#636e72',
    fontSize: '13px'
  }
};

export default Dashboard;