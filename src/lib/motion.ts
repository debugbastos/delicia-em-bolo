/** Curvas e presets de animação compartilhados (Framer Motion). */

/** Curva "cinematográfica": arranque rápido, pouso longo e macio. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Entrada padrão ao rolar: sobe e aparece uma única vez. */
export const fadeUp = (delay = 0, y = 28) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/** Revelação por máscara (clip-path) de baixo para cima. */
export const maskUp = (delay = 0) => ({
  initial: { opacity: 0.001, clipPath: "inset(18% 0% 0% 0%)", y: 40 },
  whileInView: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 1.1, delay, ease: EASE },
});
