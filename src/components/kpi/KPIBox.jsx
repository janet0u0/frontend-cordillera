/**
 * @component KPIBox
 * @description Componente reutilizable que muestra un indicador
 * clave de desempeño (KPI) de la Plataforma de Monitoreo
 * Inteligente del Grupo Cordillera.
 *
 * @param {string} titulo - Nombre del indicador (ej: "Ventas Totales")
 * @param {string|number} valor - Valor del indicador (ej: "$125.000")
 *
 * @example
 * <KPIBox titulo="Ventas Totales" valor="$125.000" />
 */
const KPIBox = ({ titulo, valor }) => {

  /**
   * Estilos del componente definidos como objeto
   * para mantener el código organizado
   */
  const estilos = {
    caja: {
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    titulo: {
      margin: '0 0 10px 0',
      color: '#555',
      fontSize: '14px',
      textTransform: 'uppercase'
    },
    valor: {
      margin: 0,
      color: '#0056b3',
      fontSize: '24px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={estilos.caja}>
      {/* Nombre del indicador */}
      <h4 style={estilos.titulo}>{titulo}</h4>
      {/* Valor del indicador */}
      <h2 style={estilos.valor}>{valor}</h2>
    </div>
  );
};

export default KPIBox;