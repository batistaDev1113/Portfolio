'use client';

import { useEffect } from 'react';

// Adds the .js flag (gates the hidden pre-reveal state) and drives the
// scroll-triggered .section-reveal / .project-reveal transitions by adding
// .in-view as elements enter the viewport. Every target is un-observed
// after it reveals. Respects prefers-reduced-motion by revealing everything
// immediately (the CSS block also forces visible state).
const ScrollReveal = () => {
  useEffect(() => {
    document.documentElement.classList.add('js');

    const revealTargets = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          '.section-reveal, .project-reveal'
        )
      );

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const revealAllImmediately = () =>
      revealTargets().forEach((el) => el.classList.add('in-view'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealAllImmediately();
      return;
    }

    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const observePending = () => {
      revealTargets().forEach((el) => {
        if (!el.classList.contains('in-view') && !observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    // Defer until load: during hydration the layout is still collapsed, so
    // below-fold content temporarily stacks at the top and would falsely
    // count as intersecting. This guarantees positions are final before we
    // start observing.
    const start = () => {
      observePending();

      // next/dynamic clients (ContactForm) may mount after load; disconnect
      // as soon as #contact's reveal target is present so we don't observe
      // unrelated DOM mutations (like chat streaming) forever.
      const hasContactReveal = () =>
        Boolean(document.querySelector('#contact .section-reveal'));

      let animationFrame = 0;
      let mutationObserver: MutationObserver | null = null;

      if (!hasContactReveal()) {
        mutationObserver = new MutationObserver(() => {
          cancelAnimationFrame(animationFrame);
          animationFrame = requestAnimationFrame(() => {
            observePending();
            if (hasContactReveal()) {
              mutationObserver?.disconnect();
              mutationObserver = null;
            }
          });
        });
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }

      return () => {
        mutationObserver?.disconnect();
        observer.disconnect();
        cancelAnimationFrame(animationFrame);
      };
    };

    let cleanup: (() => void) | undefined;
    if (document.readyState === 'complete') {
      cleanup = start();
    } else {
      const onLoad = () => {
        cleanup = start();
      };
      window.addEventListener('load', onLoad);
      return () => {
        window.removeEventListener('load', onLoad);
        cleanup?.();
      };
    }

    return cleanup;
  }, []);

  return null;
};

export default ScrollReveal;
