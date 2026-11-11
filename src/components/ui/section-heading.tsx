import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { RevealText } from "@/components/ui/reveal-text";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Palavra manuscrita de destaque (fonte script). */
  script: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  id?: string;
};

/** Cabeçalho editorial: palavra manuscrita + título serifado revelado por máscara. */
export function SectionHeading({
  script,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <motion.p
        aria-hidden="true"
        className={cn(
          "script -mb-3 text-[clamp(2.9rem,6vw,4.6rem)] sm:-mb-5",
          dark ? "text-champanhe-300" : "text-vinho-500",
        )}
        initial={{ opacity: 0, x: align === "center" ? 0 : -24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {script}
      </motion.p>
      <RevealText
        id={id}
        text={title}
        as="h2"
        delay={0.15}
        className={cn(
          "relative font-display text-[clamp(2.1rem,4.6vw,3.9rem)] font-light leading-[1.06] tracking-[-0.02em]",
          dark ? "text-marfim" : "text-vinho-800",
          titleClassName,
        )}
      />
      {description ? (
        <motion.div
          className={cn(
            "mt-5 text-[1.02rem] leading-relaxed",
            align === "center" && "mx-auto",
            "max-w-xl",
            dark ? "text-creme-200/80" : "text-tinta-suave",
          )}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        >
          {description}
        </motion.div>
      ) : null}
    </div>
  );
}
