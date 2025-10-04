// next.test.js
import { render, screen } from '@testing-library/react';
import Home from './pages/index';

describe('Next.js Home Page', () => {
  it('renders the home page', () => {
    render(<Home />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
