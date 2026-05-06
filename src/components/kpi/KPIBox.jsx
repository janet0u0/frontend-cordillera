import './KPIBox.css';

/**
 * @component KPIBox
 * @description Componente reutilizable que muestra un indicador
 * clave de desempeño (KPI) de la Plataforma de Monitoreo
 * Inteligente del Grupo Cordillera.
 *
 * Patrón aplicado: Componente Reutilizable NPM
 * Puede ser publicado como módulo independiente.
 *
 * @param {string} titulo - Nombre del indicador
 * @param {string|number} valor - Valor del indicador
 *
 * @example
 * <KPIBox titulo="Ventas Totales" valor="$125.000" />
 */
const KPIBox = ({ titulo, valor }) => {
  return (
    <div className="kpi-box">
      {/* Nombre del indicador en mayúsculas */}
      <h4 className="kpi-box-titulo">{titulo}</h4>
      {/* Valor numérico del indicador */}
      <h2 className="kpi-box-valor">{valor}</h2>
    </div>
  );
};

export default KPIBox;