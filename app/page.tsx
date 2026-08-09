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
      <Hero />
      <Toolbox />
      <Projects />
      <ContactForm />
      <FooterComponent />
    </main>
  );
}
