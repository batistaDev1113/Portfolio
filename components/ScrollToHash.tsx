'use client';

import { useEffect } from 'react';

// Smooth-scrolls to the URL hash after a cross-route navigation (App Router
// jumps instantly on land). Cleans the hash afterwards so re-clicking the
// same anchor still works.
const ScrollToHash = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.getElementById(hash.slice(1));
    if (!el) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`
    );
  }, []);

  return null;
};

export default ScrollToHash;
