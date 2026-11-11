"use client";

/**
 * Carrossel circular — adaptado de "carousel-circular-image-gallery" (21st.dev).
 *
 * O que mudou na integração Delícias em Bolo:
 *  • Sem GSAP carregado por CDN: a mesma coreografia (círculo que nasce na
 *    miniatura, cresce, "vira a página" e volta quicando) roda num tween
 *    próprio com as mesmas curvas (power3/power4/bounce). Zero dependências.
 *  • Fotos recebidas por props (dados centralizados em src/data/gallery.ts).
 *  • Proporção configurável (retrato 4:5 por padrão, ideal para bolos).
 *  • Acessível: miniaturas e setas por teclado, região rotulada, anúncio da
 *    foto atual e respeito a prefers-reduced-motion.
 *  • Autoplay pausa ao passar o mouse, ao focar e quando sai da tela.
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export interface CircularGalleryImage {
  url: string;
  alt: string;
}

type ImageGalleryProps = {
  images: CircularGalleryImage[];
  /** Intervalo do autoplay em ms (0 desliga). */
  interval?: number;
  /** Proporção da moldura (viewBox interno). */
  aspect?: { width: number; height: number };
  label?: string;
  className?: string;
  frameClassName?: string;
};

/* ───────────── Tween (substitui GSAP) ───────────── */

type Circle = { cx: number; cy: number; r: number };
type Ease = (t: number) => number;
const easing = {
  power3InOut: ((t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)) as Ease,
  power4In: ((t) => t ** 5) as Ease,
  power4Out: ((t) => 1 - (1 - t) ** 5) as Ease,
  bounceOut: ((t) => {
    const n = 7.5625,
      d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  }) as Ease,
};

type Segment = { to?: Circle; path?: Circle[]; duration: number; ease: Ease; delay?: number; onComplete?: () => void };
type Runner = { cancel?: () => void };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const setCircle = (el: SVGCircleElement, c: Circle) => {
  el.setAttribute("cx", c.cx.toFixed(2));
  el.setAttribute("cy", c.cy.toFixed(2));
  el.setAttribute("r", Math.max(0, c.r).toFixed(2));
};

/** Catmull-Rom pelos pontos (equivalente a motionPath com curviness 1). */
function along(points: Circle[], u: number): Circle {
  const n = points.length - 1;
  const seg = Math.min(n - 1, Math.floor(u * n));
  const t = u * n - seg;
  const p0 = points[Math.max(0, seg - 1)],
    p1 = points[seg],
    p2 = points[seg + 1],
    p3 = points[Math.min(n, seg + 2)];
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
  return { cx: cr(p0.cx, p1.cx, p2.cx, p3.cx), cy: cr(p0.cy, p1.cy, p2.cy, p3.cy), r: cr(p0.r, p1.r, p2.r, p3.r) };
}

function runTimeline(el: SVGCircleElement, start: Circle, segments: Segment[], runner: Runner) {
  runner.cancel?.();
  let cancelled = false;
  let raf = 0;
  runner.cancel = () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
  let current = { ...start };
  setCircle(el, current);

  const run = (i: number) => {
    if (cancelled || i >= segments.length) return;
    const s = segments[i];
    const from = { ...current };
    const begin = performance.now() + (s.delay ?? 0) * 1000;
    const apply = (p: number) => {
      const e = s.ease(p);
      current = s.path ? along([from, ...s.path], Math.min(1, Math.max(0, e))) : {
        cx: lerp(from.cx, s.to!.cx, e),
        cy: lerp(from.cy, s.to!.cy, e),
        r: lerp(from.r, s.to!.r, e),
      };
      setCircle(el, current);
    };
    if (s.duration <= 0 && !s.delay) {
      apply(1);
      s.onComplete?.();
      run(i + 1);
      return;
    }
    const step = (now: number) => {
      if (cancelled) return;
      if (now < begin) {
        raf = requestAnimationFrame(step);
        return;
      }
      const p = s.duration <= 0 ? 1 : Math.min(1, (now - begin) / (s.duration * 1000));
      apply(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        s.onComplete?.();
        run(i + 1);
      }
    };
    raf = requestAnimationFrame(step);
  };
  run(0);
}

/* ───────────── Componente principal ───────────── */

const GAP = 10;
const CIRCLE_R = 7;

export function ImageGallery({
  images,
  interval = 4500,
  aspect = { width: 400, height: 500 },
  label = "Galeria em destaque",
  className,
  frameClassName,
}: ImageGalleryProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduced = usePrefersReducedMotion();
  const [opened, setOpened] = useState(0);
  const [inPlace, setInPlace] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const go = useCallback(
    (index: number) => {
      if (disabled || index === opened) return;
      setOpened(((index % total) + total) % total);
    },
    [disabled, opened, total],
  );
  const next = useCallback(() => setOpened((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setOpened((c) => (c - 1 + total) % total), [total]);

  // Bloqueia cliques durante a transição (como no original).
  useEffect(() => {
    if (reduced) {
      setInPlace(opened);
      return;
    }
    setDisabled(true);
  }, [opened, reduced]);
  useEffect(() => setDisabled(false), [inPlace]);

  // Pausa fora da tela.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay (reinicia a cada troca).
  useEffect(() => {
    if (!interval || reduced || paused || !visible || total < 2) return;
    const id = window.setInterval(next, interval);
    return () => clearInterval(id);
  }, [opened, interval, reduced, paused, visible, total, next]);

  if (!total) return null;
  const { width, height } = aspect;

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carrossel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(opened + 1);
        if (e.key === "ArrowLeft") go(opened - 1);
      }}
    >
      <div
        className={cn("relative w-full overflow-hidden bg-vinho-900", frameClassName)}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {images.map((image, i) => (
          <div
            key={image.url}
            className="absolute inset-0"
            style={{ zIndex: inPlace === i ? i : total + 1 }}
            aria-hidden={opened !== i}
          >
            <GalleryImage
              uid={uid}
              total={total}
              id={i}
              url={image.url}
              alt={image.alt}
              open={opened === i}
              inPlace={inPlace === i}
              onInPlace={setInPlace}
              width={width}
              height={height}
              reduced={reduced}
            />
          </div>
        ))}
        {/* Véu inferior para destacar as miniaturas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[99] h-1/4 bg-gradient-to-t from-vinho-950/55 to-transparent" />
        <div className="absolute inset-0 z-[100] pointer-events-none">
          <Tabs images={images} active={opened} onSelect={go} width={width} height={height} uid={uid} />
        </div>
      </div>

      {/* Controles */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={prev}
          disabled={disabled}
          aria-label="Foto anterior"
          className="grid size-12 place-items-center rounded-full border border-vinho-700/25 text-vinho-700 transition duration-300 hover:-translate-x-0.5 hover:border-vinho-700 hover:bg-vinho-700 hover:text-marfim disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-1 items-center gap-3">
          <span className="font-display text-sm tabular-nums text-vinho-700" aria-live="polite">
            <span className="sr-only">Foto </span>
            {String(opened + 1).padStart(2, "0")}
            <span className="sr-only"> de {total}</span>
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-vinho-700/15" aria-hidden="true">
            <span
              key={`${opened}-${paused}-${visible}`}
              className="absolute inset-y-0 left-0 bg-dourado-500"
              style={{
                width: "100%",
                transformOrigin: "left",
                transform: "scaleX(0)",
                animation:
                  interval && !reduced && !paused && visible ? `carousel-progress ${interval}ms linear forwards` : undefined,
              }}
            />
          </span>
          <span className="font-display text-sm tabular-nums text-tinta-suave" aria-hidden="true">
            {String(total).padStart(2, "0")}
          </span>
        </div>
        <button
          type="button"
          onClick={next}
          disabled={disabled}
          aria-label="Próxima foto"
          className="grid size-12 place-items-center rounded-full border border-vinho-700/25 text-vinho-700 transition duration-300 hover:translate-x-0.5 hover:border-vinho-700 hover:bg-vinho-700 hover:text-marfim disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <style>{`@keyframes carousel-progress{to{transform:scaleX(1)}}`}</style>
    </div>
  );
}

/* ───────────── Imagem com máscara circular ───────────── */

interface GalleryImageProps {
  uid: string;
  url: string;
  alt: string;
  open: boolean;
  inPlace: boolean;
  id: number;
  onInPlace: (id: number) => void;
  total: number;
  width: number;
  height: number;
  reduced: boolean;
}

function GalleryImage({ uid, url, alt, open, inPlace, id, onInPlace, total, width, height, reduced }: GalleryImageProps) {
  const firstLoad = useRef(true);
  const clip = useRef<SVGCircleElement>(null);
  const runner = useRef<Runner>({});

  const duration = 0.4;
  const bigSize = CIRCLE_R * 700;
  const rowWidth = total * (CIRCLE_R * 2 + GAP) - GAP;
  const tabX = width / 2 - rowWidth / 2 + CIRCLE_R + id * (CIRCLE_R * 2 + GAP);
  const posSmall = (): Circle => ({ cx: tabX, cy: height - 30, r: CIRCLE_R });
  const posSmallAbove = (): Circle => ({ cx: tabX, cy: height / 2, r: CIRCLE_R * 2 });
  const posCenter = (): Circle => ({ cx: width / 2, cy: height / 2, r: CIRCLE_R * 7 });
  const posEnd = (): Circle => ({ cx: width / 2 - bigSize, cy: height / 2, r: bigSize });
  const posStart = (): Circle => ({ cx: width / 2 + bigSize, cy: height / 2, r: bigSize });

  useEffect(() => {
    const el = clip.current;
    if (!el) return;
    const first = firstLoad.current || reduced;
    firstLoad.current = false;
    const flip = first ? 0 : duration;
    const up = first ? 0 : 0.2;
    const bounce = first ? 0 : 1;
    const delay = first ? 0 : flip + up;

    if (open) {
      runTimeline(
        el,
        posSmall(),
        [
          { to: posCenter(), duration: up, ease: easing.power3InOut },
          { to: posEnd(), duration: flip, ease: easing.power4In, onComplete: () => onInPlace(id) },
        ],
        runner.current,
      );
    } else {
      runTimeline(
        el,
        posStart(),
        [
          { to: posCenter(), duration: flip, delay, ease: easing.power4Out },
          { path: [posSmallAbove(), posSmall()], duration: bounce, ease: easing.bounceOut },
        ],
        runner.current,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => runner.current.cancel?.(), []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label={alt}
    >
      <defs>
        <clipPath id={`${uid}-c${id}`}>
          <circle cx="0" cy="0" r={CIRCLE_R} ref={clip} />
        </clipPath>
        <clipPath id={`${uid}-s${id}`}>
          <rect width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-${inPlace ? "s" : "c"}${id})`}>
        <image width={width} height={height} href={url} preserveAspectRatio="xMidYMid slice" className="pointer-events-none" />
      </g>
    </svg>
  );
}

/* ───────────── Miniaturas ───────────── */

function Tabs({
  images,
  active,
  onSelect,
  width,
  height,
  uid,
}: {
  images: CircularGalleryImage[];
  active: number;
  onSelect: (index: number) => void;
  width: number;
  height: number;
  uid: string;
}) {
  const rowWidth = images.length * (CIRCLE_R * 2 + GAP) - GAP;
  const posX = (i: number) => width / 2 - rowWidth / 2 + CIRCLE_R + i * (CIRCLE_R * 2 + GAP);
  const posY = height - 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {images.map((image, i) => (
        <g
          key={image.url}
          className="group pointer-events-auto cursor-pointer outline-none"
          role="button"
          tabIndex={0}
          aria-label={`Ver foto ${i + 1} de ${images.length}`}
          aria-current={active === i ? "true" : undefined}
          onClick={() => onSelect(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(i);
            }
          }}
        >
          <defs>
            <clipPath id={`${uid}-t${i}`}>
              <circle cx={posX(i)} cy={posY} r={CIRCLE_R} />
            </clipPath>
          </defs>
          <image
            x={posX(i) - CIRCLE_R}
            y={posY - CIRCLE_R}
            width={CIRCLE_R * 2}
            height={CIRCLE_R * 2}
            href={image.url}
            clipPath={`url(#${uid}-t${i})`}
            className="pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle
            className={cn(
              "fill-transparent transition-all duration-300 group-hover:stroke-white group-focus-visible:stroke-champanhe-300",
              active === i ? "stroke-champanhe-300" : "stroke-white/60",
            )}
            strokeWidth={active === i ? 2.4 : 1.6}
            cx={posX(i)}
            cy={posY}
            r={CIRCLE_R + 2}
          />
        </g>
      ))}
    </svg>
  );
}
