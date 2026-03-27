'use client';

import { useState } from 'react';
import { ModeToggle } from './ModeToggle';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-white border-b border-gray-200 px-4 py-2.5 rounded dark:bg-gray-900 dark:border-gray-700 w-full rounded-b-none lg:w-4/5'>
      <div className='flex flex-wrap items-center justify-between'>
        <a
          href='/'
          className='self-center text-2xl font-semibold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text md:text-4xl lg:text-3xl'
        >
          Yunior B.
        </a>
        <div className='flex items-center space-x-8'>
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            type='button'
            className='inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
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
                href='#projects'
                aria-label='Some projects I have built'
                className='block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 md:p-0'
              >
                <span className='pb-1 hover:text-teal-600 dark:hover:text-teal-300 hover:border-b-2 hover:border-indigo-500 hover:border-spacing-4'>
                  Some Projects I&apos;ve Built
                </span>
              </a>
            </li>
            <li>
              <a
                href='#contact'
                aria-label='Contact me'
                className='block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 md:p-0'
              >
                <span className='pb-1 hover:text-teal-600 dark:hover:text-teal-300 hover:border-b-2 hover:border-indigo-500 hover:border-spacing-4'>
                  Contact Me
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
