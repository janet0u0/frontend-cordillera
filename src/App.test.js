import { render, screen } from '@testing-library/react';
import App from './App';

test('Debería renderizar la pantalla de login del Grupo Cordillera', () => {
  render(<App />);
  const tituloElement = screen.getByText(/Grupo Cordillera/i);
  expect(tituloElement).toBeInTheDocument();
});