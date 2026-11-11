import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { contact, links } from "@/data/site";
import { EASE } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";

/** Botão flutuante do WhatsApp, voltar ao topo e barra de progresso da página. */
export function FloatingActions() {
  const [showWa, setShowWa] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      setShowWa(window.scrollY > vh * 0.6);
      setShowTop(window.scrollY > vh * 1.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-dourado-500 via-champanhe-200 to-dourado-500"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        <AnimatePresence>
          {showTop ? (
            <motion.button
              key="top"
              type="button"
              onClick={() => scrollToSection("inicio")}
              aria-label="Voltar ao topo"
              className="grid size-11 place-items-center rounded-full border border-vinho-700/15 bg-creme-50/90 text-vinho-700 shadow-[var(--shadow-suave)] backdrop-blur transition-colors hover:bg-marfim"
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.8 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ArrowUp size={18} />
            </motion.button>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {showWa ? (
            <motion.a
              key="wa"
              href={links.whatsapp(contact.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Falar no WhatsApp ${contact.whatsappDisplay} (abre em nova aba)`}
              className="group relative flex items-center"
              initial={{ opacity: 0, y: 24, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.7 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-vinho-900 px-4 py-2 text-xs font-semibold tracking-wide text-marfim opacity-0 shadow-lg transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 md:block">
                Orçamento no WhatsApp
              </span>
              <span className="relative grid size-14 place-items-center rounded-full bg-vinho-700 text-marfim shadow-[0_18px_40px_-14px_rgba(83,2,28,0.8)] ring-1 ring-champanhe-300/40 transition-transform duration-500 group-hover:scale-105">
                <span className="anim-ring absolute inset-0 rounded-full ring-2 ring-champanhe-300/60" aria-hidden="true" />
                <WhatsAppIcon size={26} />
              </span>
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
