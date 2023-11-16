import React from "react";

const Skeleton = () => {
  return (
    <section
      className='flex min-h-screen flex-col items-center w-full'
      data-testid='skeleton'
    >
      <div
        role='status'
        className='grid w-full md:px-12 mx-auto md:w-3/4 lg:gap-8 xl:gap-0 lg:grid-cols-12 place-items-center justify-center align-baseline sm:align-middle h-screen animate-pulse'
      >
        <div className='mr-auto place-self-center lg:col-span-7 mb-10 w-full'>
          <p className='h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-56 mt-0 mb-5'></p>
          <p className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-2xl mb-6'></p>
          <button className='bg-gray-200 rounded-md dark:bg-gray-700 w-32 h-10'></button>
        </div>
        <div className='flex justify-center lg:mt-0 lg:col-span-5 lg:flex bg-slate-900 bg-transparent rounded-lg shadow-lg duration-300 skew-x-6 md:w-60 mx-auto w-full h-fit'>
          <svg
            className='image text-gray-200 dark:text-gray-600'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 20 18'
          >
            <path d='M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z' />
          </svg>
        </div>
        <span className='sr-only'>Loading...</span>
      </div>
    </section>
  );
};

export default Skeleton;
