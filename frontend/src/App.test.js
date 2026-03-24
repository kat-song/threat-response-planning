import { render, screen } from '@testing-library/react';
import App from './App';

test('renders operational response command dashboard', () => {
  render(<App />);
  const titleElement = screen.getByText(/Operational Response Command Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
