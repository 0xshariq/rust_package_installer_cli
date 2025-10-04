// nuxt.test.js
import { render } from '@testing-library/vue';
import Home from './pages/index.vue';

describe('Nuxt App', () => {
  it('renders homepage', () => {
    render(Home);
  });
});
