import { render } from '@testing-library/react';
import LighthouseBadge from '../components/LighthouseBadge';

const base = {
  performance: 99,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
};

describe('LighthouseBadge', () => {
  it('does not show an agentic score when none is provided', () => {
    const { container, getByLabelText } = render(<LighthouseBadge {...base} />);
    expect(getByLabelText(/Lighthouse scores — Performance 99/)).toBeTruthy();
    expect(container.textContent).not.toContain('Agentic');
  });

  it('shows the agentic browsing score when provided', () => {
    const { getByLabelText, getByTitle } = render(
      <LighthouseBadge {...base} agenticBrowsing={100} />
    );
    expect(getByLabelText(/Agentic browsing 100/)).toBeTruthy();
    expect(getByTitle('Agentic browsing: 100/100')).toBeTruthy();
  });
});
