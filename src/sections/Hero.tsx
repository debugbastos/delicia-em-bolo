import { ScallopEdge } from "@/components/ui/drip-divider";
import { LogoImage } from "@/components/ui/logo";
import { images } from "@/data/images";
import { brand } from "@/data/site";
import { scrollToSection } from "@/lib/utils";

/**
 * HERO — composição fixa (sem animação de entrada): fotografia em tela cheia,
 * logomarca centralizada, nome e assinatura visíveis imediatamente.
 * Mobile: marca no alto (área das luzes) e bolo inteiro como protagonista.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-label="Início"
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-vinho-950 text-marfim"
    >
      {/* ── Fotografia ── */}
      <picture>
        <source media="(max-width: 767px)" srcSet={images.hero.srcMobile} type="image/webp" />
        <img
          src={images.hero.src}
          alt={images.hero.alt}
          width={images.hero.width}
          height={images.hero.height}
          fetchPriority="high"
          decoding="async"
          className="hero-photo absolute inset-0 -z-20 h-full w-full object-cover"
        />
      </picture>

      {/* ── Luz e véus ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-vinho-950/75 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_45%,transparent_35%,rgba(25,5,14,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(46%_40%_at_50%_38%,rgba(25,5,14,0.58),transparent_75%)] max-md:bg-[radial-gradient(70%_26%_at_50%_20%,rgba(25,5,14,0.62),transparent_80%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-vinho-950/70 to-transparent" />
        <div className="absolute -right-24 -top-24 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(238,220,184,0.3),transparent_62%)] blur-2xl" />
        <div className="absolute inset-0 bg-vinho-700/10 mix-blend-multiply" />
      </div>

      {/* ── Marca ── */}
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-[max(5.5rem,11svh)] text-center md:justify-center md:pb-[14svh] md:pt-0">
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[175%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            fill="none"
          >
            <path d="M 30 62 A 82 82 0 0 1 172 66" stroke="rgba(238,220,184,0.55)" strokeWidth="0.6" />
            <path d="M 170 140 A 82 82 0 0 1 26 132" stroke="rgba(238,220,184,0.4)" strokeWidth="0.6" />
          </svg>
          <LogoImage eager className="w-[5.6rem] drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] sm:w-28 md:w-[clamp(8rem,11vw,10.5rem)]" />
        </div>

        <h1 className="mt-6 font-display text-[clamp(1.2rem,5.4vw,1.6rem)] font-light uppercase leading-[1.2] tracking-[0.26em] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)] sm:text-[1.9rem] sm:leading-[1.2] md:mt-9 md:text-[clamp(2.2rem,4.2vw,3.6rem)] md:leading-[1.2] md:tracking-[0.3em]">
          {brand.nameUpper}
        </h1>

        <span
          aria-hidden="true"
          className="mt-4 block h-px w-36 bg-gradient-to-r from-transparent via-champanhe-300 to-transparent md:mt-6 md:w-48"
        />
        <p className="script mt-3 text-[2rem] text-champanhe-200 [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] md:mt-4 md:text-[clamp(2.2rem,3.2vw,2.9rem)]">
          {brand.slogan.toLowerCase()}
        </p>
        <p className="eyebrow mt-3 hidden text-marfim/80 [text-shadow:0_1px_14px_rgba(0,0,0,0.7)] md:block">
          {brand.label} de confeitaria · {brand.city}
        </p>
      </div>

      {/* ── Convite à rolagem ── */}
      <button
        type="button"
        onClick={() => scrollToSection("sobre")}
        className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-marfim/80 transition-colors hover:text-marfim md:bottom-16"
        aria-label="Rolar para a seção Sobre"
      >
        <span className="eyebrow whitespace-nowrap text-[0.58rem] tracking-[0.24em] md:hidden">
          {brand.label} · {brand.city}
        </span>
        <span className="eyebrow hidden text-[0.6rem] md:block">Role para descobrir</span>
        <span className="relative h-10 w-px overflow-hidden bg-marfim/20 md:h-12">
          <span className="anim-scroll-cue absolute inset-0 bg-champanhe-200" />
        </span>
      </button>

      {/* ── Borda de chantilly ── */}
      <div className="absolute inset-x-0 -bottom-px z-20 rotate-180">
        <ScallopEdge color="var(--color-creme-100)" size={18} />
      </div>
    </section>
  );
}
