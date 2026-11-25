import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import Hero from '../components/Hero';

afterEach(cleanup);

describe('Hero component is in the dom', () => {
  it('renders a hero component', () => {
    render(<Hero />);
    const heading = screen.getByText(/Senior Frontend Engineer/i, {
      selector: 'span',
    });
    expect(heading).toBeInTheDocument();
  });
});
