// vue.test.js
import { render } from '@testing-library/vue';
import HelloWorld from './components/HelloWorld.vue';

describe('Vue App', () => {
  it('renders component', () => {
    render(HelloWorld);
  });
});
