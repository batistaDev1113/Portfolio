import { cleanup, render, screen } from '@testing-library/react';
import { afterEach } from 'node:test';
import React from 'react';
import Hero from '../components/Hero';
import Skeleton from '../components/Skeleton';

afterEach(cleanup);

describe('Hero', () => {
  test('renders skeleton when mounted is false', () => {
    render(<Hero />);
    render(<Skeleton />);

    const skeletonElement = screen.getByTestId('skeleton');

    expect(skeletonElement).toBeInTheDocument();
  });

  test('renders hero section when mounted is true', () => {
    const { getByTestId } = render(<Hero />);

    const heroSection = getByTestId('hero-section');

    expect(heroSection).toBeInTheDocument();
  });

  test('renders hero title', () => {
    render(<Hero />);

    const heroTitle = screen.getByText('Senior Frontend Developer');

    expect(heroTitle).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<Hero />);

    const heroDescription = screen.getByText(
      /passionate Senior Frontend developer/i
    );

    expect(heroDescription).toBeInTheDocument();
  });

  test('renders resume link', () => {
    render(<Hero />);

    const resumeLink = screen.getByText('View Resume');

    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute('href', '/Yunior-Batista-Resume.pdf');
    expect(resumeLink).toHaveAttribute('target', '_blank');
    expect(resumeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders hero image', () => {
    render(<Hero />);

    const heroImage = screen.getByAltText(
      'Yunior Batista - Senior Frontend Developer'
    );
    const heroAttribute = heroImage.getAttribute('src');
    expect(heroAttribute).toContain('img.jpg');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('width', '120');
    expect(heroImage).toHaveAttribute('height', '120');
    expect(heroImage).toHaveClass('rounded-full');
  });
});
