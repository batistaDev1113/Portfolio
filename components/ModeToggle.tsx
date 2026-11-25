'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const emptySubscribe = () => () => {};

export function ModeToggle({ onHero = false }: { onHero?: boolean }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return <span className='inline-block w-9 h-9' aria-hidden='true' />;
  }

  const isDarkMode = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <button
      type='button'
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      onClick={toggleTheme}
      className='w-9 h-9 flex items-center justify-center cursor-pointer transition-transform ease-in-out hover:scale-110 duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-info-500/60 rounded-lg'
    >
      {isDarkMode ? (
        <BsSunFill size={16} className='text-white' aria-hidden='true' />
      ) : (
        <BsMoonFill
          className={onHero ? 'text-white' : 'text-ink-900'}
          size={16}
          aria-hidden='true'
        />
      )}
    </button>
  );
}

export default ModeToggle;
