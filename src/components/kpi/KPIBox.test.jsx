import React from 'react';
import { render, screen } from '@testing-library/react';
import KPIBox from './KPIBox';

describe('Pruebas del componente KPIBox', () => {

  test('Debe renderizar el título correctamente', () => {
    render(<KPIBox titulo="Ventas Totales" valor="$125.000" />);
    expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
  });

  test('Debe renderizar el valor correctamente', () => {
    render(<KPIBox titulo="Meta" valor="$200.000" />);
    expect(screen.getByText('$200.000')).toBeInTheDocument();
  });

  test('Debe renderizar con valores numéricos', () => {
    render(<KPIBox titulo="Cumplimiento" valor={62.5} />);
    expect(screen.getByText('62.5')).toBeInTheDocument();
  });
});