import { motion } from "framer-motion";
import { MapPin, Navigation, ArrowUpRight, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { address, contact, links } from "@/data/site";
import { informacoes } from "@/data/menu";
import { EASE, fadeUp } from "@/lib/motion";

/**
 * LOCALIZAÇÃO — endereço em texto, mapa incorporado (iframe carregado só
 * quando se aproxima da tela) e atalhos para o Google Maps e para a rota.
 */
export function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoadMap(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const atendimento = informacoes.find((i) => i.startsWith("Orçamentos"));

  return (
    <section id="localizacao" aria-labelledby="localizacao-titulo" className="relative isolate bg-creme-100 pb-24 pt-40 md:pb-32 md:pt-48">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="localizacao-titulo" script="Localização" title="Onde estamos" />

          <motion.address {...fadeUp(0.2)} className="mt-8 not-italic">
            <div className="flex gap-4">
              <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full bg-vinho-700 text-marfim">
                <MapPin size={19} />
              </span>
              <p className="font-display text-[1.45rem] leading-snug text-vinho-800">
                {address.street}
                <br />
                <span className="text-tinta-suave">
                  {address.district} · {address.city} – {address.state}
                </span>
                <br />
                <span className="font-sans text-sm tracking-[0.12em] text-tinta-suave">CEP {address.zip}</span>
              </p>
            </div>
          </motion.address>

          <motion.div {...fadeUp(0.3)} className="mt-9 flex flex-wrap gap-3">
            <a href={links.maps} target="_blank" rel="noopener noreferrer" className="btn btn-vinho">
              <MapPin size={16} /> Abrir no Google Maps
            </a>
            <a href={links.route} target="_blank" rel="noopener noreferrer" className="btn btn-contorno text-vinho-700">
              <Navigation size={16} /> Traçar rota
            </a>
          </motion.div>

          <motion.ul {...fadeUp(0.4)} className="mt-10 space-y-4 border-t border-vinho-700/10 pt-8 text-sm text-tinta-suave">
            {atendimento ? (
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-dourado-500" />
                <span>{atendimento}</span>
              </li>
            ) : null}
            <li>
              <a
                href={links.whatsapp(contact.whatsappGreeting)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-semibold text-vinho-700"
              >
                <WhatsAppIcon size={18} className="text-dourado-500" />
                <span className="link-anim">{contact.whatsappDisplay}</span>
                <ArrowUpRight size={14} className="opacity-60 transition group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-semibold text-vinho-700"
              >
                <InstagramIcon size={18} className="text-dourado-500" />
                <span className="link-anim">{contact.instagramHandle}</span>
                <ArrowUpRight size={14} className="opacity-60 transition group-hover:opacity-100" />
              </a>
            </li>
          </motion.ul>
        </div>

        <motion.div
          ref={mapRef}
          className="relative lg:col-span-7"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <div aria-hidden="true" className="absolute -inset-3 -z-10 rounded-t-[12rem] rounded-b-[2rem] border border-dourado-400/50 md:-inset-5" />
          <div className="relative h-[420px] overflow-hidden rounded-t-[10rem] rounded-b-[1.75rem] bg-creme-200 shadow-[var(--shadow-bolo)] md:h-[520px]">
            {loadMap ? (
              <iframe
                title={`Mapa: ${address.full}`}
                src={links.mapEmbed}
                className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.75)_sepia(0.12)_contrast(1.02)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-tinta-suave">Carregando mapa…</div>
            )}
            <a
              href={links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-creme-50/95 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-vinho-700 shadow-lg backdrop-blur transition hover:bg-marfim"
            >
              <MapPin size={14} /> Ampliar mapa
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
