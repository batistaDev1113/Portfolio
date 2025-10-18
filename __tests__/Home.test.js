import { render, screen, debug, cleanup } from '@testing-library/react';
import Hero from '../components/Hero';
import { afterEach } from 'node:test';

afterEach(cleanup);

describe('Hero component is in the dom', () => {
  it('renders a hero component', () => {
    render(<Hero />);
    const heading = screen.getByText(/Frontend Developer/i);
    expect(heading).toBeInTheDocument();
  });
});
