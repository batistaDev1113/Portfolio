import Image from "next/image";
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import Footer from "../components/FooterComponent";
import About from "../components/About";
import Projects from "../components/Projects";
import Fixed from "../components/Fixed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full snap-y snap-mandatory scroll-smooth">
      <Navigation />
      <Hero />
      <About />
      <Fixed />
      <Projects />
      <ContactForm />
      <Footer />
    </main>
  );
}
