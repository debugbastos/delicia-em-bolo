"use client";

/**
 * Rodapé — adaptado de "footer-section" (21st.dev).
 * Integração: links reais da marca (dados centralizados em src/data/site.ts),
 * paleta vinho/champanhe, monograma oficial, ícones de marca próprios
 * (WhatsApp/Instagram) e animação respeitando prefers-reduced-motion.
 */
import type { ComponentProps, ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { LogoMark } from "@/components/ui/logo";
import { address, brand, contact, links, nav } from "@/data/site";
import { scrollToSection } from "@/lib/utils";

interface FooterLink {
  title: string;
  href: string;
  icon?: ComponentType<{ className?: string; size?: number }>;
  external?: boolean;
  sectionId?: string;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Navegação",
    links: nav.map((n) => ({ title: n.label, href: `#${n.id}`, sectionId: n.id })),
  },
  {
    label: "Encomendas",
    links: [
      { title: "Solicitar orçamento", href: "#contato", sectionId: "contato" },
      { title: "Cardápio e valores", href: "#cardapio", sectionId: "cardapio" },
      { title: "Mostruário", href: "#mostruario", sectionId: "mostruario" },
      { title: "Premiação 2025", href: "#premiacao", sectionId: "premiacao" },
    ],
  },
  {
    label: "Atendimento",
    links: [
      { title: contact.whatsappDisplay, href: links.whatsapp(contact.whatsappGreeting), icon: WhatsAppIcon, external: true },
      { title: contact.instagramHandle, href: contact.instagramUrl, icon: InstagramIcon, external: true },
      { title: `${address.district}, ${address.city}`, href: links.maps, icon: MapPin, external: true },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-vinho-950 text-creme-200 md:rounded-t-[3.5rem]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(40%_160px_at_50%_0%,rgba(226,200,150,0.14),transparent)]" />
      <div className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-champanhe-300/60 to-transparent blur-[1px]" />

      <div className="container-site relative py-14 lg:py-20">
        <div className="grid w-full gap-12 xl:grid-cols-3 xl:gap-10">
          <AnimatedContainer className="space-y-5">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection("inicio"); }} className="inline-flex items-center gap-4" aria-label={`${brand.name} — voltar ao início`}>
              <LogoMark className="h-14 w-auto text-marfim" />
              <span>
                <span className="block font-display text-xl tracking-[0.22em] text-marfim">{brand.nameUpper}</span>
                <span className="script block pt-1 text-2xl text-champanhe-300">{brand.slogan.toLowerCase()}</span>
              </span>
            </a>
            <p className="max-w-sm text-sm leading-relaxed text-creme-200/70">
              {brand.label} de confeitaria em {brand.city}. Bolos personalizados por quilo, com orçamento feito pelo WhatsApp.
            </p>
            <a
              href={links.whatsapp(contact.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ouro mt-2"
            >
              <WhatsAppIcon size={18} /> Pedir orçamento
            </a>
          </AnimatedContainer>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 xl:col-span-2">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.1} className={index === 2 ? "col-span-2 md:col-span-1" : undefined}>
                <h3 className="eyebrow text-champanhe-300">{section.label}</h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        onClick={
                          link.sectionId
                            ? (e) => {
                                e.preventDefault();
                                scrollToSection(link.sectionId!);
                              }
                            : undefined
                        }
                        className="group inline-flex items-center gap-2 text-creme-200/75 transition-colors duration-300 hover:text-marfim"
                      >
                        {link.icon ? <link.icon className="size-4 shrink-0 text-champanhe-300" size={16} /> : null}
                        <span className="link-anim">{link.title}</span>
                        {link.external ? (
                          <ArrowUpRight size={14} className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        ) : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-champanhe-300/15 pt-6 text-xs text-creme-200/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}. Todos os direitos reservados.
          </p>
          <p>{address.full}</p>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", y: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
