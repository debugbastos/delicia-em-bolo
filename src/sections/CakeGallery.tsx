import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Expand } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import { DripDivider } from "@/components/ui/drip-divider";
import { Lightbox } from "@/components/ui/lightbox";
import { SectionHeading } from "@/components/ui/section-heading";
import { gallery, type GalleryPhoto } from "@/data/gallery";
import { contact } from "@/data/site";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EASE, fadeUp } from "@/lib/motion";
import { AWARD_EXIT_COLOR } from "@/sections/Award";

type Placed = GalleryPhoto & { index: number };

/** Distribui as fotos em colunas equilibradas, preservando a proporção original (sem cortes). */
function useMasonry(photos: GalleryPhoto[], columns: number) {
  return useMemo(() => {
    const cols: Placed[][] = Array.from({ length: columns }, () => []);
    const heights = new Array(columns).fill(0);
    photos.forEach((p, index) => {
      const ratio = p.height / p.width;
      const target = heights.indexOf(Math.min(...heights));
      cols[target].push({ ...p, index });
      heights[target] += ratio;
    });
    return cols;
  }, [photos, columns]);
}

/**
 * MOSTRUÁRIO — galeria editorial em mosaico assimétrico.
 * Fotografias sem títulos nem textos sobrepostos, inteiras (sem cortes),
 * com zoom suave, elevação no hover, revelação por máscara e lightbox.
 */
export function CakeGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const columns = useMasonry(gallery, wide ? 3 : 2);
  const [open, setOpen] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const y1 = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [10, -120]);
  const offsets: MotionValue<number>[] = [y0, y1, y2];

  return (
    <section
      id="mostruario"
      ref={sectionRef}
      aria-labelledby="mostruario-titulo"
      className="relative isolate bg-creme-50 pb-32 pt-40 md:pb-40 md:pt-48"
    >
      <DripDivider color={AWARD_EXIT_COLOR} className="absolute inset-x-0 top-0" seed={11} />

      <div className="container-site">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="mostruario-titulo" script="Mostruário" title="Trabalhos do ateliê" />
          <motion.div {...fadeUp(0.25)} className="max-w-sm md:pb-2 md:text-right">
            <p className="text-[0.98rem] leading-relaxed text-tinta-suave">
              Bolos criados para aniversários, casamentos, chás e celebrações. Toque em uma foto para ampliá-la.
            </p>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-vinho-700"
            >
              <InstagramIcon size={18} />
              <span className="link-anim">Mais trabalhos no Instagram</span>
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>

        <div className={`mt-14 grid gap-3 sm:gap-5 md:mt-20 ${wide ? "grid-cols-3 gap-6" : "grid-cols-2"}`}>
          {columns.map((col, ci) => (
            <motion.div
              key={`${wide ? 3 : 2}-${ci}`}
              className={`flex flex-col gap-3 sm:gap-5 ${wide ? "gap-6" : ""} ${ci === 1 ? "pt-10 md:pt-16" : ""}`}
              style={wide && !reduce ? { y: offsets[ci] } : undefined}
            >
              {col.map((photo, pi) => (
                <GalleryTile key={photo.id} photo={photo} delay={(pi % 3) * 0.08 + ci * 0.06} onOpen={() => setOpen(photo.index)} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        items={gallery.map((p) => ({ src: p.src, full: p.full, alt: p.alt, width: p.width, height: p.height }))}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
        label="Mostruário — foto ampliada"
      />
    </section>
  );
}

function GalleryTile({ photo, delay, onOpen }: { photo: Placed; delay: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar foto ${photo.index + 1}: ${photo.alt}`}
      className="group relative block w-full rounded-[1.1rem] shadow-[var(--shadow-suave)] transition-[translate,box-shadow] duration-700 ease-[var(--ease-cine)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-bolo)] sm:rounded-[1.5rem]"
      initial={{ opacity: 0.001, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      <motion.span
        className="relative block overflow-hidden rounded-[1.1rem] bg-creme-200 sm:rounded-[1.5rem]"
        initial={{ clipPath: "inset(14% 6% 0% 6%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, delay, ease: EASE }}
      >
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full scale-[1.001] transition-transform duration-[1400ms] ease-[var(--ease-cine)] group-hover:scale-[1.06]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vinho-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 grid size-10 translate-y-1 place-items-center rounded-full bg-creme-50/90 text-vinho-700 opacity-0 shadow transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand size={16} />
      </span>
      </motion.span>
    </motion.button>
  );
}
