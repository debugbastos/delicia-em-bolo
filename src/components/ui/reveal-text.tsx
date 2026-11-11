import { Fragment, useRef, type ElementType } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Atraso inicial (s). */
  delay?: number;
  /** Intervalo entre palavras (s). */
  stagger?: number;
  /** "view" anima ao entrar na tela; "mount" anima ao montar. */
  trigger?: "view" | "mount";
  /** Divide por letra em vez de palavra. */
  by?: "word" | "letter";
  id?: string;
};

/**
 * Revelação tipográfica por máscara: cada palavra (ou letra) sobe de
 * dentro de uma janela com overflow oculto.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  trigger = "view",
  by = "word",
  id,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = trigger === "mount" || inView;
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <Tag ref={ref} id={id} className={cn(className)} aria-label={text}>
      {words.map((word, wi) => {
        const pieces = by === "letter" ? Array.from(word) : [word];
        return (
          <Fragment key={wi}>
            <span aria-hidden="true" className="whitespace-nowrap">
              {pieces.map((piece, pi) => {
                const i = by === "letter" ? letterIndex++ : wi;
                return (
                  <span key={pi} className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
                    <motion.span
                      className="inline-block will-change-transform"
                      initial={{ y: "112%" }}
                      animate={show ? { y: "0%" } : undefined}
                      transition={{ duration: by === "letter" ? 0.8 : 0.95, delay: delay + i * stagger, ease: EASE }}
                    >
                      {piece}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
