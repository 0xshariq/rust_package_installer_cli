// remix.test.js
import { render } from '@testing-library/react';
import Index from './app/routes/index';

describe('Remix App', () => {
  it('renders homepage', () => {
    render(<Index />);
  });
});
