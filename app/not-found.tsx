import Link from 'next/link';

const NotFound = () => {
  return (
    <main
      id='main-content'
      tabIndex={-1}
      className='min-h-screen bg-light-surface dark:bg-night flex items-center'
    >
      <div className='container px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12 max-w-5xl'>
        <div className='w-full lg:w-1/2'>
          <p className='eyebrow'>{'// 404 · Not Found'}</p>
          <h1 className='fluid-title mt-4 text-ink-900 dark:text-white'>
            Page not found
          </h1>
          <p className='mt-4 text-ink-600 dark:text-ink-400 leading-7'>
            Sorry, the page you are looking for doesn&apos;t exist or has moved.
          </p>

          <div className='flex items-center mt-8 gap-x-3'>
            <Link
              href='/'
              className='inline-flex items-center justify-center rounded-lg bg-linear-to-r from-primary-600 to-violet-a px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-transform duration-200 hover:-translate-y-0.5'
            >
              Take me home
            </Link>
          </div>
        </div>

        <div
          className='relative w-full mt-12 lg:w-1/2 lg:mt-0 flex justify-center'
          aria-hidden='true'
        >
          <svg
            viewBox='0 0 320 200'
            className='w-full max-w-md text-primary-500/20 dark:text-primary-400/20'
            fill='none'
          >
            <rect
              x='16'
              y='16'
              width='288'
              height='168'
              rx='20'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray='6 6'
            />
            <text
              x='160'
              y='116'
              textAnchor='middle'
              className='fill-primary-600 dark:fill-primary-400 font-display'
              fontSize='72'
              fontWeight='700'
            >
              404
            </text>
          </svg>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
