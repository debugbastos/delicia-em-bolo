import { useEffect, useState } from "react";

/**
 * Indica a seção visível no momento (scrollspy).
 * Considera "ativa" a última seção cujo topo passou de 40% da tela.
 */
export function useActiveSection(ids: string[], aliases: Record<string, string> = {}) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let raf = 0;
    const all = [...ids, ...Object.keys(aliases)];
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = ids[0] ?? "";
      let best = -Infinity;
      for (const id of all) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = aliases[id] ?? id;
        }
      }
      // Fim da página: acende o último item.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
