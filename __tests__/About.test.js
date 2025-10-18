import React from 'react';
import { render, cleanup, debug } from '@testing-library/react';
import About from '../components/About';

afterEach(cleanup);

describe('About component', () => {
  test('renders About component', () => {
    const { debug, getByText } = render(<About />);
    const headerText = getByText(/About Me/i, { selector: 'h2' });
    expect(headerText).toBeInTheDocument();
  });

  test('renders image', () => {
    const { debug, getByRole } = render(<About />);
    const image = getByRole('img');
    expect(image).toBeInTheDocument();
  });
});
