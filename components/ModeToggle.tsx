'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

const emptySubscribe = () => () => {};

export function ModeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <button
      type='button'
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      onClick={toggleTheme}
      className='w-6 h-6 flex items-center justify-center cursor-pointer transition:ease-in-out hover:scale-110 duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 rounded'
    >
      {isDarkMode ? (
        <BsSunFill size={15} className='text-white' />
      ) : (
        <BsMoonFill className='text-black' size={15} />
      )}
    </button>
  );
}

export default ModeToggle;
