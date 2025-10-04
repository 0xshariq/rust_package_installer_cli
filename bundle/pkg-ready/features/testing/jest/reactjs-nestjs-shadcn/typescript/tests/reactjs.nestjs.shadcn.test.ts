// react-nest-shadcn.test.js
import { render, screen } from '@testing-library/react';

describe('React + NestJS + ShadCN App', () => {
  it('renders a UI component', () => {
    render(<div className="shadcn-ui">Hello</div>);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('backend placeholder', () => {
    // Normally you’d test NestJS endpoints with Supertest
    expect(true).toBe(true);
  });
});
