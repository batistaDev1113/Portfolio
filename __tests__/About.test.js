import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import FooterComponent from '../components/FooterComponent';

afterEach(cleanup);

describe('FooterComponent', () => {
  test('renders copyright text', () => {
    render(<FooterComponent />);
    const copyright = screen.getByText(/Yunior Batista/i);
    expect(copyright).toBeInTheDocument();
  });

  test('renders LinkedIn link', () => {
    render(<FooterComponent />);
    const linkedinLink = screen.getByRole('link', {
      name: /linkedin/i,
    });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders GitHub link', () => {
    render(<FooterComponent />);
    const githubLink = screen.getByRole('link', {
      name: /github/i,
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
