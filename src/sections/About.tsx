import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImageGallery } from "@/components/ui/carousel-circular-image-gallery";
import { LogoMark } from "@/components/ui/logo";
import { SectionHeading } from "@/components/ui/section-heading";
import { aboutCarousel } from "@/data/gallery";
import { about } from "@/data/site";
import { EASE, fadeUp } from "@/lib/motion";
import { scrollToSection } from "@/lib/utils";

/**
 * SOBRE — composição editorial: texto à esquerda, carrossel circular em
 * moldura de arco (a mesma forma do selo do cardápio) à direita.
 */
export function About() {
  const carouselImages = aboutCarousel.map((p) => ({ url: p.src, alt: p.alt }));

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="relative isolate overflow-hidden bg-creme-100 pb-20 pt-24 md:pb-24 md:pt-32">
      {/* Monograma em marca d'água */}
      <LogoMark className="pointer-events-none absolute -left-24 top-24 -z-10 h-[34rem] w-auto text-creme-200 opacity-70 md:-left-16 md:h-[46rem]" />

      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6 xl:col-span-6">
          <SectionHeading id="sobre-titulo" script={about.eyebrow} title={about.title} />

          <div className="mt-8 space-y-5 text-[1.05rem] leading-[1.8] text-tinta-suave">
            {about.paragraphs.map((p, i) => (
              <motion.p key={i} {...fadeUp(0.2 + i * 0.12)} className="max-w-xl">
                {p}
              </motion.p>
            ))}
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-vinho-700/10 bg-vinho-700/10 sm:grid-cols-3">
            {about.pillars.map((pillar, i) => (
              <motion.li
                key={pillar.n}
                className="group relative bg-creme-50/90 p-6 transition-colors duration-500 hover:bg-marfim"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
              >
                <span className="font-display text-sm italic text-dourado-500">{pillar.n}</span>
                <h3 className="mt-3 font-display text-xl text-vinho-800">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{pillar.text}</p>
                <span className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-dourado-400 transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-x-100" />
              </motion.li>
            ))}
          </ul>

          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contato");
              }}
              className="btn btn-vinho"
            >
              Solicitar orçamento <ArrowRight size={16} className="arrow" />
            </a>
            <a
              href="#cardapio"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("cardapio");
              }}
              className="btn btn-contorno text-vinho-700"
            >
              Ver cardápio
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:max-w-none"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {/* Moldura deslocada em dourado */}
          <div
            aria-hidden="true"
            className="absolute -right-4 -top-4 bottom-20 left-4 rounded-t-full border border-dourado-400/60 md:-right-6 md:-top-6 md:left-6"
          />
          <ImageGallery
            images={carouselImages}
            label="Destaques do ateliê"
            frameClassName="rounded-t-full rounded-b-[1.75rem] shadow-[var(--shadow-bolo)]"
          />
          <p aria-hidden="true" className="script pointer-events-none absolute -left-6 top-16 z-10 hidden -rotate-12 text-5xl text-vinho-500/85 sm:block md:-left-14">
            feito à mão
          </p>
        </motion.div>
      </div>
    </section>
  );
}
