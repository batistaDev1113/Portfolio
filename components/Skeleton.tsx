import React from 'react';

const Skeleton = () => {
  return (
    <section
      className='z-50 relative w-full h-screen mt-5 items-center justify-center flex'
      data-testid='skeleton'
    >
      <div
        role='status'
        className='w-11/12 lg:w-10/12 xl:w-1/2 items-center p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 flex flex-col'
      >
        <div className='flex items-center mt-4 justify-center mb-3 rounded-full'>
          <svg
            className='w-20 h-20 me-3 text-gray-200 dark:text-gray-700'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
          </svg>
        </div>

        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4 text-center'></div>
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-56 mb-4 text-center'></div>
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-72 text-center'></div>
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-68 text-center'></div>
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-60 text-center mb-2'></div>
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-56 text-center mb-2'></div>
        <span className='sr-only'>Loading...</span>
        <div className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-3 grid-flow-col max-w-xl mt-5'>
          <button className='h-10 w-32 bg-gray-200 rounded-full dark:bg-gray-700' />
          <button className='h-10 w-32 bg-gray-200 rounded-full dark:bg-gray-700' />
        </div>
      </div>
    </section>
  );
};

export default Skeleton;
