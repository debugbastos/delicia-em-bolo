import { useEffect, useState } from "react";

/**
 * true quando a barra deve ficar escondida: o usuário está rolando para baixo
 * e já passou de `offset` pixels. Volta a aparecer ao rolar para cima.
 */
export function useHideOnScroll(offset = 120, tolerance = 6) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (y < offset) setHidden(false);
      else if (delta > tolerance) setHidden(true);
      else if (delta < -tolerance) setHidden(false);
      if (Math.abs(delta) > tolerance) last = y;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [offset, tolerance]);
  return hidden;
}
