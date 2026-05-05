/**
 * @component VentasChart
 * @description Componente de visualización de proyección de ventas.
 * Actualmente muestra un placeholder para el gráfico dinámico.
 * En una versión futura se integrará con Chart.js o Recharts
 * para mostrar datos reales del MS-KPI.
 *
 * @example
 * <VentasChart />
 */
const VentasChart = () => {

  /**
   * Estilos del componente
   */
  const estilos = {
    contenedor: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginTop: '20px',
      textAlign: 'center'
    },
    titulo: {
      color: '#555',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    placeholder: {
      padding: '40px 0',
      color: '#999',
      fontSize: '14px',
      fontStyle: 'italic'
    },
    icono: {
      fontSize: '48px',
      marginBottom: '12px'
    }
  };

  return (
    <div style={estilos.contenedor}>
      {/* Título del gráfico */}
      <h4 style={estilos.titulo}>📈 Proyección de Ventas</h4>

      {/* Placeholder del gráfico */}
      <div style={estilos.placeholder}>
        <div style={estilos.icono}>📊</div>
        <p>Gráfico dinámico de ventas</p>
        <p>Datos provenientes del MS-KPI en tiempo real</p>
      </div>
    </div>
  );
};

export default VentasChart;