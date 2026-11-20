import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'node:test';
import Project from '../components/Project';

afterEach(cleanup);

const project = {
  id: 'p1',
  name: 'Test Project',
  description: 'desc',
  imageUrl: '/No-Image-Placeholder.svg',
  technologies: ['React'],
  slug: 'test-project',
};

describe('Project featured image preload strategy', () => {
  it('featured (below-the-fold) image is not marked as priority/preloaded', () => {
    const { container } = render(<Project project={project} featured />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('fetchpriority')).not.toBe('high');
    expect(img.getAttribute('loading')).toBe('eager');
    // priority would inject a <link rel=preload> for the image into the head
    // (ReactDOM.preload); a below-the-fold image must not compete with real
    // above-the-fold LCP preloads.
    const preload = Array.from(
      container.ownerDocument.querySelectorAll(
        'head link[rel=preload][as=image]'
      )
    );
    expect(preload).toHaveLength(0);
  });
});
