import { BsGithub, BsLinkedin } from 'react-icons/bs';
import { RxCodesandboxLogo } from 'react-icons/rx';

const LINKEDIN_URL = 'https://www.linkedin.com/in/yunior-profile/';
const GITHUB_URL = 'https://github.com/batistaDev1113';

const YEAR = new Date().getFullYear();

const FooterComponent = () => {
  return (
    <footer className='relative mt-auto pt-0 rounded-t-none bg-transparent p-6 w-full'>
      <div className='w-full'>
        <hr className='my-6 border-gray-200 dark:border-gray-700 sm:mx-auto' />
        <div className='w-full flex justify-between lg:justify-evenly md:text-center'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            &copy; {YEAR}{' '}
            <a href='#' className='hover:underline'>
              Yunior Batista
            </a>
          </span>
          <div className='flex space-x-4 ml-8'>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label="Link to Yunior's LinkedIn profile"
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            >
              <BsLinkedin className='h-5 w-5' />
            </a>
            <a
              href={GITHUB_URL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label="Link to Yunior's GitHub profile"
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            >
              <BsGithub className='h-5 w-5' />
            </a>
            <a
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              aria-label="Link to Yunior's codesandbox profile"
              className='text-gray-500 hover:text-gray-900 dark:hover:text-white'
            >
              <RxCodesandboxLogo className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
