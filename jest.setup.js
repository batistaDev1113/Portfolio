import '@testing-library/jest-dom';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {}

  observe() {}

  unobserve() {}

  takeRecords() {
    return [];
  }
};

// jsdom does not implement window.matchMedia. Mock it so components that read
// the prefers-reduced-motion media query (e.g. Hero) can mount in tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
