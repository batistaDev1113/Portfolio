import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";
import FooterComponent from "../components/FooterComponent";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center w-full snap-y snap-mandatory scroll-smooth overflow-hidden'>
      <Navigation />
      <Hero />
      <Projects />
      <ContactForm />
      <FooterComponent />
    </main>
  );
}
