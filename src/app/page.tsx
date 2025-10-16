// components
import { Footer } from "@/components";

// sections
import Hero from "./hero";
import Clients from "./clients";
import Projects from "./projects";
import PopularClients from "./popular-clients";
import ContactForm from "./contact-form";

export default function Portfolio() {
  return (
    <>
      {/* <Navbar /> */}
      <Hero />
      {/* <Clients /> */}
      <Projects />
      {/* <PopularClients /> */}
      <ContactForm />
      <Footer />
    </>
  );
}
