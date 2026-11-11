import { motion, useInView } from "framer-motion";
import { Award as AwardIcon, Expand } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { GoldParticles } from "@/components/ui/gold-particles";
import { Lightbox } from "@/components/ui/lightbox";
import { images } from "@/data/images";
import { award } from "@/data/site";
import { useFontReady } from "@/hooks/useFontReady";
import { EASE } from "@/lib/motion";

/** Cor de saída da seção — usada também pela calda que escorre sobre o Mostruário. */
export const AWARD_EXIT_COLOR = "#12040b";

/**
 * PREMIAÇÃO — Prêmio Excelências do Ano 2025.
 * Entrada cinematográfica com o GlyphPortal: o ano "2025" é uma janela para
 * o fundo escuro com partículas douradas; ao rolar, a câmera mergulha no "0"
 * e a seção se abre. A imagem oficial é a peça principal, sempre inteira.
 */
export function Award() {
  const fontReady = useFontReady('600 100px "Fraunces Portal"', award.year);
  const [open, setOpen] = useState<number | null>(null);
  const img = images.award;

  return (
    <div id="premiacao" className="award-portal relative">
      {fontReady ? (
        <GlyphPortal
          word={award.year}
          focusChar="0"
          interactive={false}
          scrollLength={2}
          fontFamily='"Fraunces Portal", Georgia, serif'
          fontWeight={600}
          enterLabel="Ver a premiação"
          style={
            {
              "--gp-paper": "var(--color-creme-100)",
              "--gp-ink": "var(--color-vinho-700)",
              "--gp-field": AWARD_EXIT_COLOR,
              "--gp-foreground": "var(--color-marfim)",
              fontFamily: "var(--font-sans)",
            } as CSSProperties
          }
          background={<AwardBackdrop />}
          front={<AwardFront />}
        >
          <AwardContent onOpen={() => img.src && setOpen(0)} />
        </GlyphPortal>
      ) : (
        <div className="h-[100svh] bg-creme-100" aria-hidden="true" />
      )}

      {img.src ? (
        <Lightbox
          items={[{ src: img.src, alt: img.alt, width: img.width, height: img.height }]}
          index={open}
          onClose={() => setOpen(null)}
          label="Prêmio Excelências do Ano 2025 — visualização ampliada"
        />
      ) : null}
    </div>
  );
}

function AwardBackdrop() {
  return (
    <div className="absolute inset-0" style={{ transform: "scale(var(--gp-field-scale,1))" }}>
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_38%,#4a0a22_0%,#2a0715_38%,#14040c_72%,#0b0206_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(34%_30%_at_50%_34%,rgba(226,200,150,0.22),transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-2/3 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_42%,rgba(238,220,184,0.07)_47%,transparent_50%,rgba(238,220,184,0.06)_53%,transparent_58%)]" />
      <GoldParticles className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: `linear-gradient(to bottom, transparent, ${AWARD_EXIT_COLOR})` }} />
    </div>
  );
}

function AwardFront() {
  return (
    <>
      <p
        className="eyebrow absolute inset-x-6 text-center text-vinho-500"
        style={{ bottom: "calc(100% - var(--gp-word-top, 35%) + 30px)" }}
      >
        {award.eyebrow}
      </p>
      <p
        className="absolute inset-x-6 text-center font-display text-lg italic text-vinho-700/80 md:text-xl"
        style={{ top: "calc(var(--gp-word-bottom, 60%) + 18px)" }}
      >
        {award.place}
      </p>
      <span className="eyebrow absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-3 text-[0.6rem] text-vinho-700/60">
        Role para entrar
        <span className="relative block h-9 w-px overflow-hidden bg-vinho-700/15">
          <span className="anim-scroll-cue absolute inset-0 bg-vinho-500" />
        </span>
      </span>
    </>
  );
}

function Ornament() {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 16" className="h-4 w-56 text-champanhe-300">
      <path d="M0 8 H92" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <path d="M128 8 H220" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <path d="M110 1 L117 8 L110 15 L103 8 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="98" cy="8" r="1.4" fill="currentColor" />
      <circle cx="122" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function AwardContent({ onOpen }: { onOpen: () => void }) {
  const img = images.award;
  // O gatilho fica num contêiner sem máscara: elementos com clip-path fechado
  // não são detectados pelo IntersectionObserver. A margem inferior negativa
  // sincroniza a entrada com a revelação do portal.
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, amount: 0.05, margin: "0px 0px -45% 0px" });
  return (
    <div ref={ref} className="mx-auto flex w-full max-w-5xl flex-col items-center py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={shown ? { opacity: 1, scaleX: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Ornament />
      </motion.div>

      <motion.h2
        className="text-ouro mt-7 max-w-4xl font-display text-[clamp(1.55rem,3.7vw,3.1rem)] font-normal uppercase leading-[1.15]"
        initial={{ opacity: 0, letterSpacing: "0.32em", clipPath: "inset(0% 0% 100% 0%)" }}
        animate={shown ? { opacity: 1, letterSpacing: "0.06em", clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
      >
        {award.heading}
      </motion.h2>

      <motion.div
        className="relative mt-12 md:mt-16"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={shown ? { opacity: 1, scale: 1, y: 0 } : undefined}
        transition={{ duration: 1.6, delay: 0.55, ease: EASE }}
      >
        <div
          aria-hidden="true"
          className="anim-breathe absolute -inset-12 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(226,200,150,0.28),transparent)] blur-2xl"
        />
        <button
          type="button"
          onClick={onOpen}
          disabled={!img.src}
          aria-label={img.src ? "Ampliar a imagem do Prêmio Excelências do Ano 2025" : "Imagem da premiação pendente"}
          className="group relative block rounded-[1.9rem] bg-gradient-to-br from-champanhe-200/35 via-dourado-500/15 to-champanhe-300/30 p-3 shadow-[var(--shadow-ouro)] ring-1 ring-champanhe-300/55 transition-transform duration-700 ease-[var(--ease-cine)] enabled:hover:-translate-y-1 sm:p-4"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-1.5 rounded-[1.6rem] ring-1 ring-champanhe-300/25 sm:inset-2" />
          <Corners />
          <span className="relative block overflow-hidden rounded-[3px] bg-vinho-950">
            {img.src ? (
              <img
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="block h-auto max-h-[80svh] w-auto max-w-[min(84vw,40rem)] object-contain"
              />
            ) : (
              <AwardPlaceholder />
            )}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="anim-glint absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-champanhe-100/25 to-transparent" />
            </span>
            {img.src ? (
              <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-vinho-950/60 text-champanhe-200 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand size={18} />
              </span>
            ) : null}
          </span>
        </button>
      </motion.div>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light text-marfim">{award.title}</p>
        <blockquote className="mx-auto mt-4 max-w-xl font-display text-lg italic leading-relaxed text-champanhe-200/90 md:text-xl">
          “{award.quote}”
        </blockquote>
      </motion.div>
    </div>
  );
}

function Corners() {
  const base = "pointer-events-none absolute size-6 border-champanhe-200/80";
  return (
    <span aria-hidden="true">
      <span className={`${base} -left-1 -top-1 rounded-tl-[1rem] border-l border-t`} />
      <span className={`${base} -right-1 -top-1 rounded-tr-[1rem] border-r border-t`} />
      <span className={`${base} -bottom-1 -left-1 rounded-bl-[1rem] border-b border-l`} />
      <span className={`${base} -bottom-1 -right-1 rounded-br-[1rem] border-b border-r`} />
    </span>
  );
}

function AwardPlaceholder() {
  return (
    <span className="flex aspect-[4/5] w-[min(78vw,26rem)] flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_35%,#3c0619,#19050e)] p-8 text-center">
      <span className="grid size-16 place-items-center rounded-full ring-1 ring-champanhe-300/50">
        <AwardIcon className="text-champanhe-200" size={28} strokeWidth={1.4} />
      </span>
      <span className="font-display text-xl text-marfim">Imagem oficial da premiação</span>
      <span className="max-w-[22ch] text-sm leading-relaxed text-creme-200/60">
        Espaço reservado para a arte original do Prêmio Excelências do Ano 2025 (arquivo pendente).
      </span>
    </span>
  );
}
