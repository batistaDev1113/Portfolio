import ContactForm from '../components/ContactForm';
import FooterComponent from '../components/FooterComponent';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import Projects from '../components/Projects';

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
