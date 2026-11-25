import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import Hero from '../components/Hero';

afterEach(cleanup);

describe('Hero', () => {
  test('renders hero section', () => {
    const { getByTestId } = render(<Hero />);

    const heroSection = getByTestId('hero-section');

    expect(heroSection).toBeInTheDocument();
  });

  test('renders hero title', () => {
    render(<Hero />);

    const heroTitle = screen.getByText('Senior Frontend Engineer');

    expect(heroTitle).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<Hero />);

    const heroDescription = screen.getByText(
      /product-minded Senior Frontend Engineer/i
    );

    expect(heroDescription).toBeInTheDocument();
  });

  test('renders resume link and PDF download link', () => {
    render(<Hero />);

    const resumeLink = screen.getByText('View Resume');
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute('href', '/resume');

    const downloadLink = screen.getByRole('link', {
      name: /Download Resume PDF/i,
    });
    expect(downloadLink).toHaveAttribute('href', '/Yunior-Batista-Resume.pdf');
    expect(downloadLink).toHaveAttribute(
      'download',
      'Yunior-Batista-Resume.pdf'
    );
  });

  test('renders hero image', () => {
    render(<Hero />);

    const heroImage = screen.getByAltText(
      'Yunior Batista - Senior Frontend Engineer'
    );
    const heroAttribute = heroImage.getAttribute('src');
    expect(heroAttribute).toContain('img.jpg');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('width', '120');
    expect(heroImage).toHaveAttribute('height', '120');
    expect(heroImage).toHaveClass('rounded-full');
  });
});
