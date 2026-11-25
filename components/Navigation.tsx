'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { ModeToggle } from './ModeToggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  // At the top of the page the nav sits over the (dark, in both themes) hero,
  // so it goes transparent with light ink to blend with the hero surface. Once
  // scrolled it switches to the frosted, theme-aware look. When the mobile menu
  // is open over the hero, give it a dark frosted surface for legibility.
  const navSurface = scrolled
    ? 'bg-white/90 dark:bg-night/90 backdrop-blur-md border-b border-ink-200/40 dark:border-border'
    : isOpen
      ? 'bg-night/95 backdrop-blur-md border-b border-border'
      : 'bg-transparent border-b border-transparent';
  const linkColor = scrolled
    ? 'text-ink-700 dark:text-ink-400'
    : 'text-white/90';
  const linkHover = scrolled
    ? 'hover:text-primary-600 dark:hover:text-primary-300 hover:border-primary-500'
    : 'hover:text-white hover:border-violet-a';

  return (
    <nav
      className={`sticky top-0 z-100 w-full px-4 sm:px-6 py-3 transition-[background-color,border-color,backdrop-filter] duration-300 ${navSurface}`}
    >
      <div className='flex flex-wrap items-center justify-between'>
        <Link
          href='/'
          className='self-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400'
        >
          <BrandLogo onHero={!scrolled} />
        </Link>
        <div className='flex items-center space-x-3 sm:space-x-6'>
          <ModeToggle onHero={!scrolled} />
          <button
            ref={menuButtonRef}
            onClick={() => setIsOpen(!isOpen)}
            type='button'
            className={`inline-flex items-center rounded-lg p-2 text-sm focus:outline-none focus:ring-2 md:hidden ${
              scrolled
                ? 'text-ink-500 hover:bg-ink-100 focus:ring-ink-200 dark:text-ink-400 dark:hover:bg-ink-700 dark:focus:ring-ink-600'
                : 'text-white/80 hover:bg-white/10 focus:ring-white/40'
            }`}
            aria-controls='navbar-collapse'
            aria-expanded={isOpen}
          >
            <span className='sr-only'>Toggle menu</span>
            {isOpen ? (
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </button>
        </div>
        <div
          id='navbar-collapse'
          className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto uppercase`}
        >
          <ul className='mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium'>
            <li>
              <a
                href='#skills'
                aria-label='How I build and the tools I use'
                onClick={handleNavLinkClick}
                className={`block py-2 pr-4 pl-3 md:p-0 ${linkColor}`}
              >
                <span className={`pb-1 hover:border-b-2 ${linkHover}`}>
                  How I Build
                </span>
              </a>
            </li>
            <li>
              <a
                href='#projects'
                aria-label='Some projects I have built'
                onClick={handleNavLinkClick}
                className={`block py-2 pr-4 pl-3 md:p-0 ${linkColor}`}
              >
                <span className={`pb-1 hover:border-b-2 ${linkHover}`}>
                  Some Projects I&apos;ve Built
                </span>
              </a>
            </li>
            <li>
              <a
                href='#contact'
                aria-label="Let's connect"
                onClick={handleNavLinkClick}
                className={`block py-2 pr-4 pl-3 md:p-0 ${linkColor}`}
              >
                <span className={`pb-1 hover:border-b-2 ${linkHover}`}>
                  Let&apos;s Connect
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
