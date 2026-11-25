'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';

const ResumeChatbotDialog = dynamic(() => import('./ResumeChatbotDialog'), {
  ssr: false,
});

export default function ResumeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      launcherRef.current?.focus();
    });
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          ref={launcherRef}
          type='button'
          onClick={() => setIsOpen(true)}
          aria-label='Open resume chat'
          aria-expanded={false}
          className='fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-primary-600 to-violet-a text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-primary-500 focus-visible:outline-offset-2'
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            aria-hidden='true'
          >
            <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
          </svg>
        </button>
      )}

      {isOpen && <ResumeChatbotDialog onClose={handleClose} />}
    </>
  );
}
