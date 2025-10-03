// react-express-shadcn.test.js
import { render, screen } from '@testing-library/react';
const request = require('supertest');
const app = require('./server'); // Express server

describe('React + Express + ShadCN App', () => {
  it('renders frontend component', () => {
    render(<div className="shadcn-ui">Frontend</div>);
    expect(screen.getByText(/frontend/i)).toBeInTheDocument();
  });

  it('tests backend API', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
