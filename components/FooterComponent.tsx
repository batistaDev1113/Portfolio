import { BsGithub, BsLinkedin } from 'react-icons/bs';
import BackToTop from './BackToTop';

const LINKEDIN_URL = 'https://www.linkedin.com/in/yunior-profile/';
const GITHUB_URL = 'https://github.com/batistaDev1113';
const EMAIL = 'yuniorbatista1113@gmail.com';

const YEAR = new Date().getFullYear();

const FooterComponent = () => {
  return (
    <footer className='relative mt-auto pt-12 pb-8 p-6 w-full'>
      <div className='w-full max-w-7xl mx-auto'>
        <hr className='mb-8 border-gray-200 dark:border-border sm:mx-auto' />
        <div className='flex justify-center mb-8'>
          <BackToTop />
        </div>
        <div className='w-full flex flex-col items-center gap-6 sm:flex-row sm:justify-between'>
          <span className='text-sm text-gray-500 dark:text-gray-400 font-mono'>
            &copy; {YEAR} Yunior Batista
          </span>

          <a
            href={`mailto:${EMAIL}`}
            className='text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors font-mono'
          >
            {EMAIL}
          </a>

          <div className='flex space-x-4'>
            <a
              href={LINKEDIN_URL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label="Link to Yunior's LinkedIn profile"
              className='text-gray-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors'
            >
              <BsLinkedin className='h-5 w-5' />
            </a>
            <a
              href={GITHUB_URL}
              target='_blank'
              rel='noopener noreferrer'
              aria-label="Link to Yunior's GitHub profile"
              className='text-gray-500 hover:text-primary-600 dark:hover:text-primary-300 transition-colors'
            >
              <BsGithub className='h-5 w-5' />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
