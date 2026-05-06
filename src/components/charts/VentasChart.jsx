import './VentasChart.css';

/**
 * @component VentasChart
 * @description Componente de visualización de proyección de ventas.
 *
 * Evolución planificada:
 *  - v1.0: Placeholder visual (actual)
 *  - v2.0: Integración con Chart.js consumiendo MS-KPI
 *  - v3.0: Gráfico interactivo con filtros por sucursal
 *
 * @example
 * <VentasChart />
 */
const VentasChart = () => {
  return (
    <div className="chart-contenedor">

      {/* Título descriptivo del gráfico */}
      <h4 className="chart-titulo">📈 Proyección de Ventas</h4>

      {/*
        Placeholder del gráfico dinámico.
        En producción se reemplazará por Chart.js
        conectado al MS-KPI en tiempo real.
      */}
      <div className="chart-placeholder">
        <div className="chart-icono">📊</div>
        <p className="chart-descripcion">Gráfico dinámico de ventas</p>
        <p className="chart-descripcion">
          Datos provenientes del MS-KPI en tiempo real
        </p>
      </div>

    </div>
  );
};

export default VentasChart;