import { motion } from "framer-motion";
import { useMemo } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Calda escorrendo (ganache) — borda temática entre seções.
 * Posicione no fim de uma seção com `absolute top-full` para que os
 * pingos "escorram" sobre a seção seguinte.
 */
export function DripDivider({
  color,
  className,
  seed = 7,
  height = 110,
}: {
  color: string;
  className?: string;
  seed?: number;
  height?: number;
}) {
  const d = useMemo(() => buildDripPath(seed, height), [seed, height]);
  return (
    <motion.svg
      aria-hidden="true"
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="xMidYMin slice"
      className={cn("pointer-events-none block w-full origin-top", className)}
      style={{ height }}
      initial={{ scaleY: 0.45 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 2.2, ease: EASE }}
    >
      <path d={d} fill={color} />
    </motion.svg>
  );
}

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildDripPath(seed: number, height: number) {
  const rand = rng(seed);
  const base = 18;
  const drips: { cx: number; r: number; len: number }[] = [];
  let x = 40 + rand() * 50;
  while (x < 1400) {
    const r = 6 + rand() * 9;
    const len = base + 14 + rand() * (height - base - 30);
    drips.push({ cx: x, r, len });
    x += 95 + rand() * 120;
  }
  let p = `M0 0 H1440 V${base} `;
  for (let i = drips.length - 1; i >= 0; i--) {
    const { cx, r, len } = drips[i];
    const sh = r * 1.6;
    p += `L${(cx + r + sh).toFixed(1)} ${base} `;
    p += `C${(cx + r).toFixed(1)} ${base} ${(cx + r).toFixed(1)} ${base} ${(cx + r).toFixed(1)} ${(base + sh).toFixed(1)} `;
    p += `L${(cx + r).toFixed(1)} ${(len - r).toFixed(1)} `;
    p += `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(cx - r).toFixed(1)} ${(len - r).toFixed(1)} `;
    p += `L${(cx - r).toFixed(1)} ${(base + sh).toFixed(1)} `;
    p += `C${(cx - r).toFixed(1)} ${base} ${(cx - r).toFixed(1)} ${base} ${(cx - r - sh).toFixed(1)} ${base} `;
  }
  p += `L0 ${base} Z`;
  return p;
}

/** Borda de chantilly confeitado (semicírculos) para a transição entre seções. */
export function ScallopEdge({ color, className, size = 22 }: { color: string; className?: string; size?: number }) {
  const count = Math.ceil(1440 / (size * 2));
  let d = `M0 0 H1440 V${size * 0.2} `;
  for (let i = count; i > 0; i--) {
    const x0 = i * size * 2;
    d += `L${x0} ${size * 0.2} A${size} ${size} 0 0 1 ${x0 - size * 2} ${size * 0.2} `;
  }
  d += "Z";
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 1440 ${size * 1.25}`}
      preserveAspectRatio="xMidYMin slice"
      className={cn("pointer-events-none block w-full", className)}
      style={{ height: size * 1.25 }}
    >
      <path d={d} fill={color} />
    </svg>
  );
}
