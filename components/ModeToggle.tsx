'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

const emptySubscribe = () => () => {};

export function ModeToggle() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <div
      role='button'
      aria-label='Toggle theme mode'
      tabIndex={0}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      onKeyDown={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='w-6 h-6 flex items-center justify-center cursor-pointer transition:ease-in-out hover:scale-110 duration-200'
    >
      {theme === 'dark' ? (
        <BsSunFill size={15} className='text-white' />
      ) : (
        <BsMoonFill className='text-black' size={15} />
      )}
    </div>
  );
}

export default ModeToggle;
