import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import dynamic from "next/dynamic";

// Dynamic components are not rendered on the server, but on the client.
const AboutDynamic = dynamic(() => import("../components/About"), {});
const ProjectsDynamic = dynamic(() => import("../components/Projects"), {});
const ContactFormDynamic = dynamic(
  () => import("../components/ContactForm"),
  {},
);
const FooterDynamic = dynamic(
  () => import("../components/FooterComponent"),
  {},
);

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center w-full snap-y snap-mandatory scroll-smooth overflow-hidden'>
      <Navigation />
      <Hero />
      <AboutDynamic />
      <ProjectsDynamic />
      <ContactFormDynamic />
      <FooterDynamic />
    </main>
  );
}
