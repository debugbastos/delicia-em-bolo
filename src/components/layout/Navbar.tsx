import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { LogoMark } from "@/components/ui/logo";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { useScrolled } from "@/hooks/useScrolled";
import { address, brand, contact, links, nav, navAliases } from "@/data/site";
import { EASE } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";

const ids = nav.map((n) => n.id);

/**
 * Barra de navegação centralizada e transparente sobre o Hero.
 * Ao rolar, ganha um fundo de vidro creme discreto. Indica a seção atual.
 */
export function Navbar() {
  const scrolled = useScrolled(40);
  const active = useActiveSection(ids, navAliases);
  const [open, setOpen] = useState(false);
  const hidden = useHideOnScroll(120) && !open;
  const listRef = useRef<HTMLUListElement>(null);
  const [dot, setDot] = useState<{ x: number; visible: boolean }>({ x: 0, visible: false });

  const measure = useCallback(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`[data-nav="${active}"]`);
    if (!list || !link) return setDot((d) => ({ ...d, visible: false }));
    const lr = list.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    setDot({ x: r.left - lr.left + r.width / 2, visible: true });
  }, [active]);

  useLayoutEffect(measure, [measure, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const light = !scrolled; // sobre o Hero: texto marfim

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-cine)]",
          hidden && "-translate-y-[120%]",
        )}
        onFocusCapture={(e) => {
          // Ao navegar por teclado, a barra reaparece.
          if (hidden) (e.currentTarget as HTMLElement).style.translate = "0 0";
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLElement).style.translate = "";
        }}
      >
        {/* ── Desktop ── */}
        <div className="hidden justify-center px-4 pt-4 lg:flex">
          <nav
            aria-label="Navegação principal"
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-full px-3 py-2 transition-[background-color,box-shadow,border-color,padding] duration-500 ease-[var(--ease-cine)]",
              scrolled
                ? "border border-vinho-700/10 bg-creme-50/92 shadow-[0_18px_40px_-24px_rgba(58,6,25,0.45)] backdrop-blur-xl"
                : "border border-transparent bg-transparent",
            )}
          >
            <a
              href="#inicio"
              onClick={go("inicio")}
              aria-label={`${brand.name} — início`}
              className={cn(
                "grid h-10 place-items-center overflow-hidden transition-all duration-500",
                scrolled ? "w-9 opacity-100" : "w-0 opacity-0",
              )}
              tabIndex={scrolled ? 0 : -1}
            >
              <LogoMark className="h-8 w-auto text-vinho-700" />
            </a>
            <span className={cn("h-5 w-px transition-opacity", scrolled ? "bg-vinho-700/15 opacity-100" : "opacity-0")} />
            <ul ref={listRef} className="relative flex items-center">
              {nav.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      data-nav={item.id}
                      onClick={go(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300",
                        light
                          ? isActive
                            ? "text-champanhe-200"
                            : "text-marfim/80 hover:text-marfim"
                          : isActive
                            ? "text-vinho-700"
                            : "text-tinta-suave hover:text-vinho-700",
                        light && "[text-shadow:0_1px_12px_rgba(0,0,0,0.45)]",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -bottom-0.5 size-1.5 -translate-x-1/2 rounded-full transition-all duration-500 ease-[var(--ease-cine)]",
                  light ? "bg-champanhe-300" : "bg-dourado-500",
                  dot.visible ? "opacity-100" : "opacity-0",
                )}
                style={{ left: dot.x }}
              />
            </ul>
            <span className={cn("h-5 w-px", light ? "bg-marfim/25" : "bg-vinho-700/15")} />
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${contact.instagramHandle} (abre em nova aba)`}
              className={cn(
                "grid size-10 place-items-center rounded-full transition-colors duration-300",
                light ? "text-marfim/85 hover:bg-marfim/10 hover:text-marfim" : "text-vinho-700 hover:bg-vinho-700/8",
              )}
            >
              <InstagramIcon size={18} />
            </a>
          </nav>
        </div>

        {/* ── Mobile / tablet ── */}
        <div
          className={cn(
            "pointer-events-auto flex h-16 items-center justify-between px-3 transition-[background-color,box-shadow] duration-500 lg:hidden",
            scrolled ? "bg-creme-50/85 shadow-[0_10px_30px_-20px_rgba(58,6,25,0.5)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${contact.instagramHandle} (abre em nova aba)`}
            className={cn("grid size-11 place-items-center rounded-full", light ? "text-marfim" : "text-vinho-700")}
          >
            <InstagramIcon size={20} />
          </a>
          <a
            href="#inicio"
            onClick={go("inicio")}
            aria-label={`${brand.name} — início`}
            className={cn("transition-all duration-500", scrolled ? "opacity-100" : "pointer-events-none opacity-0")}
            tabIndex={scrolled ? 0 : -1}
          >
            <LogoMark className="h-9 w-auto text-vinho-700" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors",
              light ? "text-marfim hover:bg-marfim/10" : "text-vinho-700 hover:bg-vinho-700/8",
            )}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useFocusTrap(ref, open, onClose);

  const navigate = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    onClose();
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          id="menu-mobile"
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="grain fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-vinho-800 text-marfim lg:hidden"
          initial={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at 92% 4%)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex h-16 items-center justify-between px-3">
            <LogoMark className="ml-2 h-9 w-auto text-marfim" />
            <button type="button" onClick={onClose} aria-label="Fechar menu" className="grid size-11 place-items-center rounded-full hover:bg-marfim/10">
              <X size={26} />
            </button>
          </div>
          <nav aria-label="Navegação" className="flex flex-1 flex-col justify-center px-8 py-6">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={navigate(item.id)}
                    aria-current={active === item.id ? "true" : undefined}
                    className="group flex items-baseline gap-4 py-2"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, delay: 0.18 + i * 0.06, ease: EASE }}
                  >
                    <span className="w-7 font-display text-xs text-champanhe-300/70">0{i + 1}</span>
                    <span
                      className={cn(
                        "font-display text-[2.4rem] font-light leading-tight transition-colors",
                        active === item.id ? "italic text-champanhe-200" : "text-marfim group-hover:text-champanhe-200",
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="space-y-4 border-t border-marfim/10 px-8 pb-10 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          >
            <a href={links.whatsapp(contact.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="btn btn-ouro w-full">
              <WhatsAppIcon size={18} /> Orçamento no WhatsApp
            </a>
            <div className="flex items-center justify-between text-sm text-creme-200/75">
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                <InstagramIcon size={18} /> {contact.instagramHandle}
              </a>
              <span>{address.city} – {address.state}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
