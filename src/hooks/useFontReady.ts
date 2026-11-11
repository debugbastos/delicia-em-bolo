import { useEffect, useState } from "react";

/**
 * Aguarda o carregamento de uma fonte antes de montar componentes que medem
 * glifos (ex.: GlyphPortal). Resolve mesmo se a fonte falhar, após `timeout`.
 */
export function useFontReady(font: string, sample = "2025", timeout = 2500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    if (!("fonts" in document)) {
      done();
      return;
    }
    const timer = window.setTimeout(done, timeout);
    document.fonts.load(font, sample).then(done, done);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [font, sample, timeout]);
  return ready;
}
