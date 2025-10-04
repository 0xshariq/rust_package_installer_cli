// react.test.js
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('React App', () => {
  it('renders a component', () => {
    render(<App />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
