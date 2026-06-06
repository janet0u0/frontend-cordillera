import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import './VentasChart.css';

Chart.register(...registerables);

const VentasChart = () => {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [estado, setEstado] = useState('cargando');

  useEffect(() => {
    let montado = true;

    const cargar = async () => {
      try {
        const res = await fetch('http://localhost:8083/api/datos/ventas');
        if (!res.ok) throw new Error('Error al obtener ventas');
        const ventas = await res.json();

        if (!montado) return;

        if (!ventas || ventas.length === 0) {
          setEstado('vacio');
          return;
        }

        // Agrupar montos por sucursal
        const porSucursal = ventas.reduce((acc, v) => {
          acc[v.sucursal] = (acc[v.sucursal] || 0) + v.monto;
          return acc;
        }, {});

        const labels = Object.keys(porSucursal);
        const data   = Object.values(porSucursal);

        // Destruir chart previo si existe
        if (chartRef.current) chartRef.current.destroy();

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Ventas por Sucursal ($)',
              data,
              backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(230, 126, 34, 0.8)',
                'rgba(231, 76, 60, 0.8)',
              ],
              borderRadius: 6,
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` $${ctx.parsed.y.toLocaleString('es-CL')}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (v) => `$${Number(v).toLocaleString('es-CL')}`,
                },
              },
            },
          },
        });

        setEstado('ok');
      } catch {
        if (montado) setEstado('error');
      }
    };

    cargar();
    return () => {
      montado = false;
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div className="chart-contenedor">
      <h4 className="chart-titulo">📈 Ventas por Sucursal</h4>

      {estado === 'cargando' && (
        <div className="chart-placeholder">
          <p className="chart-descripcion">⏳ Cargando datos...</p>
        </div>
      )}

      {estado === 'error' && (
        <div className="chart-placeholder">
          <p className="chart-descripcion">⚠️ MS-Datos no disponible</p>
          <p className="chart-descripcion">Verifique que el servicio esté corriendo en :8083</p>
        </div>
      )}

      {estado === 'vacio' && (
        <div className="chart-placeholder">
          <p className="chart-descripcion">Sin ventas registradas aún</p>
        </div>
      )}

      <div style={{ height: '240px', display: estado === 'ok' ? 'block' : 'none' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default VentasChart;