import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import Projects from '../components/Projects';
import ScrollReveal from '../components/ScrollReveal';
import ScrollToHash from '../components/ScrollToHash';
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
      <ScrollToHash />
      <ScrollReveal />
      {/* Full-page wrapper: the nav is sticky within it, so it stays pinned
          for the whole scroll. At the top of the page it is transparent and
          sits over the (dark, in both themes) hero; once scrolled it frosts
          to the theme surface. */}
      <div className='relative w-full'>
        <Navigation />
        {/* First viewport: hero pulled up so it sits behind the nav strip
            (nav is transparent at the top and shares the hero surface) */}
        <div className='relative w-full -mt-16 min-h-[calc(100vh+4rem)]'>
          <div className='absolute inset-0 z-50'>
            <Hero />
          </div>
          {/* Curved seam: the light content below "dips" up into the dark hero */}
          <div
            aria-hidden='true'
            className='absolute bottom-0 inset-x-0 z-40 h-16 sm:h-20 lg:h-24 bg-light-surface dark:bg-night rounded-t-[100%] pointer-events-none'
          />
        </div>
        <Toolbox />
        <Projects />
        <ContactForm />
        <FooterComponent />
      </div>
    </main>
  );
}
