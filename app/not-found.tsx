import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <section className='bg-white dark:bg-ink-900 '>
      <div className='container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12'>
        <div className='wf-ull lg:w-1/2'>
          <p className='text-sm font-medium text-info-500 dark:text-info-400'>
            404 error
          </p>
          <h1 className='mt-3 text-2xl font-semibold text-ink-800 dark:text-white md:text-3xl'>
            Page not found
          </h1>
          <p className='mt-4 text-ink-500 dark:text-ink-400'>
            Sorry, the page you are looking for doesn&#39;t exist.
          </p>

          <div className='flex items-center mt-6 gap-x-3'>
            <Link
              href='/'
              className='w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-info-500 rounded-lg shrink-0 sm:w-auto hover:bg-info-600 dark:hover:bg-info-500 dark:bg-info-600'
            >
              Take me home
            </Link>
          </div>
        </div>

        <div className='relative w-full mt-12 lg:w-1/2 lg:mt-0'>
          <Image
            width={300}
            height={300}
            className='w-full max-w-lg lg:mx-auto'
            src='https://merakiui.com/images/components/illustration.svg'
            alt='404 sign'
          />
        </div>
      </div>
    </section>
  );
};

export default NotFound;
