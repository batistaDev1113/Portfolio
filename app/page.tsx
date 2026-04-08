import dynamic from 'next/dynamic';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import Projects from '../components/Projects';

const ContactForm = dynamic(() => import('../components/ContactForm'));
const FooterComponent = dynamic(() => import('../components/FooterComponent'));

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center w-full scroll-smooth'>
      <Navigation />
      <Hero />
      <Projects />
      <ContactForm />
      <FooterComponent />
    </main>
  );
}
