import { MotionConfig } from "framer-motion";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/ui/footer-section";
import { About } from "@/sections/About";
import { Award } from "@/sections/Award";
import { CakeGallery } from "@/sections/CakeGallery";
import { Contact } from "@/sections/contact/Contact";
import { Hero } from "@/sections/Hero";
import { Location } from "@/sections/Location";
import { Menu } from "@/sections/menu/Menu";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <About />
        <Award />
        <CakeGallery />
        <Menu />
        <Location />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </MotionConfig>
  );
}
