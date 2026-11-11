import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { DripDivider, ScallopEdge } from "@/components/ui/drip-divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FlavorsPanel, PaymentPanel, PricesPanel, SizesPanel } from "./MenuPanels";

const tabs = [
  { id: "valores", label: "Valores", Panel: PricesPanel },
  { id: "sabores", label: "Massas e recheios", Panel: FlavorsPanel },
  { id: "tamanhos", label: "Tamanhos", Panel: SizesPanel },
  { id: "pagamento", label: "Pagamento e informações", Panel: PaymentPanel },
] as const;

type TabId = (typeof tabs)[number]["id"];

/**
 * CARDÁPIO — conteúdo transcrito do material oficial (sem usar as imagens).
 * Organizado em abas para não virar uma lista longa e cansativa.
 */
export function Menu() {
  const [active, setActive] = useState<TabId>("valores");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = tabs.find((t) => t.id === active)!;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((t) => t.id === active);
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
    tabRefs.current[next]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };

  return (
    <section
      id="cardapio"
      aria-labelledby="cardapio-titulo"
      className="grain relative isolate z-10 bg-vinho-800 pb-32 pt-32 text-marfim md:pb-40 md:pt-40"
    >
      <ScallopEdge color="var(--color-creme-50)" className="absolute inset-x-0 top-0" size={20} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(138,29,64,0.55),transparent_65%)]" />
        <div className="absolute -right-40 bottom-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(226,200,150,0.08),transparent_60%)]" />
      </div>

      <div className="container-site">
        <SectionHeading
          id="cardapio-titulo"
          align="center"
          tone="dark"
          script="Cardápio"
          title="Sabores, tamanhos e valores"
          description="Bolos personalizados por quilo, com massas e recheios para combinar. O orçamento final é feito pelo WhatsApp."
        />

        <motion.div
          className="mt-12 flex justify-center md:mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div
            role="tablist"
            aria-label="Seções do cardápio"
            onKeyDown={onKeyDown}
            className="-mx-5 flex max-w-[calc(100%+2.5rem)] snap-x gap-1.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:max-w-full sm:rounded-full sm:border sm:border-champanhe-300/15 sm:bg-vinho-950/30 sm:p-1.5"
          >
            {tabs.map((t, i) => {
              const selected = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`painel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "shrink-0 snap-center whitespace-nowrap rounded-full px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-all duration-500 ease-[var(--ease-cine)]",
                    selected
                      ? "bg-marfim text-vinho-800 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
                      : "border border-champanhe-300/20 text-creme-200/80 hover:text-marfim sm:border-transparent",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-10 md:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              id={`painel-${current.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${current.id}`}
              tabIndex={0}
              className="outline-none"
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <current.Panel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DripDivider color="var(--color-vinho-800)" className="absolute inset-x-0 top-full -mt-px" seed={23} />
    </section>
  );
}
