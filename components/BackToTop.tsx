'use client';

import { FaArrowUp } from 'react-icons/fa';

// Back-to-top link in the footer. Smooth-scrolls home, respecting
// prefers-reduced-motion (an :active state gives the rating per the
// Lighthouse target-size/a11y audits).
const BackToTop = () => {
  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    window.history.replaceState(null, '', window.location.pathname);
  };

  return (
    <button
      type='button'
      onClick={scrollToTop}
      aria-label='Back to top'
      className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded px-2 py-1'
    >
      <FaArrowUp className='h-3.5 w-3.5' aria-hidden='true' />
      Back to top
    </button>
  );
};

export default BackToTop;
