import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import Projects from '../components/Projects';
import Toolbox from '../components/Toolbox';

const ContactForm = dynamic(() => import('../components/ContactForm'));
const FooterComponent = dynamic(() => import('../components/FooterComponent'));

export default function Home() {
  return (
    <main
      id='main-content'
      tabIndex={-1}
      className='flex min-h-screen flex-col items-center w-full scroll-smooth dark:bg-night'
    >
      <Navigation />
      <div className='relative w-full'>
        <Hero />
        {/* Curved seam: the light content below "dips" up into the dark hero */}
        <div
          aria-hidden='true'
          className='relative z-40 -mt-16 sm:-mt-20 lg:-mt-24 h-16 sm:h-20 lg:h-24 bg-light-surface dark:bg-night rounded-t-[100%] pointer-events-none'
        />
      </div>
      <Toolbox />
      <Projects />
      <ContactForm />
      <FooterComponent />
    </main>
  );
}
