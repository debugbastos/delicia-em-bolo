import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type LightboxItem = {
  src: string;
  /** Versão em alta resolução (opcional). */
  full?: string;
  alt: string;
  width: number;
  height: number;
};

type LightboxProps = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  label?: string;
};

/**
 * Visualização ampliada com navegação por setas, teclado (← → Esc),
 * gesto de arrastar no celular e foco preso dentro do diálogo.
 * A fotografia é exibida inteira (object-contain), sem cortes nem legendas.
 */
export function Lightbox({ items, index, onClose, onIndexChange, label = "Visualização ampliada" }: LightboxProps) {
  const open = index !== null && index >= 0 && index < items.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const many = items.length > 1;

  useLockBodyScroll(open);
  useFocusTrap(dialogRef, open, onClose);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || !onIndexChange) return;
      onIndexChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open || !many) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, many, go]);

  // Pré-carrega as vizinhas para a navegação ficar instantânea.
  useEffect(() => {
    if (!open || index === null || !many) return;
    [1, -1].forEach((d) => {
      const it = items[(index + d + items.length) % items.length];
      const img = new Image();
      img.src = it.full ?? it.src;
    });
  }, [open, index, items, many]);

  if (typeof document === "undefined") return null;
  const item = open ? items[index!] : null;

  return createPortal(
    <AnimatePresence>
      {open && item ? (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-vinho-950/94 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          onTouchStart={(e) => {
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90) onClose();
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={item.full ?? item.src}
              src={item.full ?? item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="max-h-[86svh] w-auto max-w-[92vw] select-none rounded-[4px] object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              draggable={false}
            />
          </AnimatePresence>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar visualização"
            className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-marfim/10 text-marfim ring-1 ring-marfim/20 transition hover:bg-marfim/20 sm:right-6 sm:top-6"
          >
            <X size={22} />
          </button>

          {many ? (
            <>
              <NavButton side="left" onClick={() => go(-1)} />
              <NavButton side="right" onClick={() => go(1)} />
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-sm tracking-[0.3em] text-marfim/80" aria-live="polite">
                {String(index! + 1).padStart(2, "0")} <span className="text-dourado-400">/</span> {String(items.length).padStart(2, "0")}
              </p>
            </>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Foto anterior" : "Próxima foto"}
      className={cn(
        "absolute bottom-3 grid size-12 place-items-center rounded-full bg-marfim/10 text-marfim ring-1 ring-marfim/20 backdrop-blur transition hover:scale-105 hover:bg-marfim/20 sm:bottom-auto sm:top-1/2 sm:size-14 sm:-translate-y-1/2",
        side === "left" ? "left-4 sm:left-6" : "right-4 sm:right-6",
      )}
    >
      <Icon size={26} />
    </button>
  );
}
