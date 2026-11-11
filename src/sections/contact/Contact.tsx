import { lazy, Suspense } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact } from "@/data/site";

// O formulário é carregado sob demanda (divisão de código).
const ContactForm = lazy(() => import("./ContactForm"));

/** CONTATO — principal área de conversão: briefing completo do bolo. */
export function Contact() {
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="relative isolate overflow-hidden bg-creme-50 pb-28 pt-24 md:pb-36 md:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(240,207,210,0.55),transparent)]"
      />
      <div className="container-site">
        <SectionHeading
          id="contato-titulo"
          align="center"
          script="Orçamento"
          title="Conte como você imagina o seu bolo"
          description={
            <>
              Preencha as etapas abaixo. Ao final, abrimos o WhatsApp da confeitaria — {contact.whatsappDisplay} — com o seu pedido
              organizado. É só enviar.
            </>
          }
        />
        <div className="mt-14 md:mt-20">
          <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[2rem] bg-creme-200/60" aria-label="Carregando formulário" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
