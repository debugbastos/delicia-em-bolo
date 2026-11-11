import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert, History } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type JSX } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { buildQuoteMessage, quoteLink } from "@/lib/whatsapp";
import { steps } from "./quote-model";
import { ReferencesStep } from "./ReferencesStep";
import { ReviewStep } from "./ReviewStep";
import { StepBolo, StepCliente, StepComercial, StepEvento, StepSabores } from "./steps";
import { SuccessPanel } from "./SuccessPanel";
import { useQuoteForm, type QuoteForm } from "./useQuoteForm";

const stepComponents: ((p: { form: QuoteForm }) => JSX.Element)[] = [
  StepCliente,
  StepEvento,
  StepBolo,
  StepSabores,
  ReferencesStep,
  StepComercial,
  ReviewStep,
];

/**
 * Formulário de orçamento em 7 etapas. Ao finalizar, valida tudo, monta a
 * mensagem organizada por categorias e abre o WhatsApp oficial com o texto
 * pronto. Nada é "enviado" pelo site: o cliente confirma o envio no WhatsApp.
 */
export default function ContactForm() {
  const form = useQuoteForm();
  const reduce = useReducedMotion();
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [showRestored, setShowRestored] = useState(form.restored);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mounted = useRef(false);

  const total = steps.length;
  const isLast = form.step === total - 1;
  const current = steps[form.step];
  const StepComponent = stepComponents[form.step];
  const progress = sentUrl ? 1 : form.step / (total - 1);

  // A cada troca de etapa: mantém o topo do formulário à vista e move o foco para o título.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const top = topRef.current;
    if (top) {
      const r = top.getBoundingClientRect();
      if (r.top < 60 || r.top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + r.top - 96, behavior: reduce ? "auto" : "smooth" });
      }
    }
    const t = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 420);
    return () => clearTimeout(t);
  }, [form.step, sentUrl, reduce]);

  const focusFirstInvalid = () => {
    window.setTimeout(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (!el) return;
      const target = el.matches("input, select, textarea") ? el : el.querySelector<HTMLElement>("input:not([disabled]), select, textarea");
      (target ?? el).focus({ preventScroll: false });
    }, 520);
  };

  const goNext = () => {
    const errors = form.next();
    const n = Object.keys(errors).length;
    if (n) {
      setSummary(n === 1 ? "Confira o campo destacado para continuar." : `Confira os ${n} campos destacados para continuar.`);
      focusFirstInvalid();
    } else setSummary(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLast) return goNext();
    const invalid = form.validateForSubmit();
    if (invalid) {
      setSummary("Algumas informações obrigatórias estão faltando — levamos você até elas.");
      focusFirstInvalid();
      return;
    }
    setSummary(null);
    const url = quoteLink(buildQuoteMessage(form.data, form.refs));
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* ── Painel de etapas (desktop) ── */}
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28 overflow-hidden rounded-[2rem] bg-vinho-800 p-8 text-marfim shadow-[var(--shadow-bolo)]">
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-[radial-gradient(circle,rgba(226,200,150,0.2),transparent_65%)]" />
          <p className="eyebrow relative text-champanhe-300">Seu pedido</p>
          <div className="relative mt-4 flex items-end gap-3">
            <span className="font-display text-5xl font-light">{Math.round(progress * 100)}%</span>
            <span className="pb-2 text-sm text-creme-200/70">concluído</span>
          </div>
          <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-marfim/10">
            <motion.span
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-dourado-400 to-champanhe-200"
              initial={false}
              animate={{ scaleX: Math.max(0.02, progress) }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          <ol className="relative mt-8 space-y-1">
            {steps.map((s, i) => {
              const done = sentUrl ? true : i < form.step;
              const active = !sentUrl && i === form.step;
              const reachable = !sentUrl && i <= form.furthest;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    disabled={!reachable || active}
                    onClick={() => form.goTo(i)}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300",
                      active ? "bg-marfim/10" : reachable ? "hover:bg-marfim/5" : "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-all duration-500",
                        done
                          ? "border-champanhe-200 bg-champanhe-200 text-vinho-800"
                          : active
                            ? "scale-110 border-champanhe-200 text-champanhe-200"
                            : "border-marfim/20 text-marfim/40",
                      )}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </span>
                    <span>
                      <span className={cn("block text-sm font-semibold", active ? "text-marfim" : done ? "text-creme-100" : "text-marfim/45")}>
                        {s.title}
                      </span>
                      {active ? <span className="block text-xs text-creme-200/65">{s.description}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="relative mt-8 border-t border-marfim/10 pt-5 text-xs leading-relaxed text-creme-200/60">
            Suas respostas ficam salvas neste aparelho até o envio. As imagens não são salvas.
          </p>
        </div>
      </aside>

      {/* ── Formulário ── */}
      <div className="lg:col-span-8" ref={topRef}>
        <div className="rounded-[2rem] border border-creme-300/70 bg-white/75 p-5 shadow-[var(--shadow-suave)] backdrop-blur-sm sm:p-8 md:p-10">
          {sentUrl ? (
            <SuccessPanel
              url={sentUrl}
              refs={form.refs}
              onEdit={() => setSentUrl(null)}
              onReset={() => {
                form.reset();
                setSentUrl(null);
              }}
            />
          ) : (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="etapa-titulo">
              {/* Progresso (mobile/tablet) */}
              <div className="mb-7 lg:hidden">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-tinta-suave">
                  <span>
                    Etapa {form.step + 1} de {total}
                  </span>
                  <span className="text-vinho-600">{current.short}</span>
                </div>
                <div className="mt-3 flex gap-1.5" aria-hidden="true">
                  {steps.map((s, i) => (
                    <span
                      key={s.key}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-500",
                        i < form.step ? "bg-vinho-700" : i === form.step ? "bg-dourado-400" : "bg-creme-300",
                      )}
                    />
                  ))}
                </div>
              </div>

              {showRestored && form.step === 0 ? (
                <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-creme-300 bg-creme-50 p-4 text-sm text-tinta sm:flex-row sm:items-center">
                  <History size={18} className="shrink-0 text-dourado-600" />
                  <p className="flex-1">Recuperamos as respostas que você já tinha preenchido neste aparelho.</p>
                  <button
                    type="button"
                    onClick={() => {
                      form.reset();
                      setShowRestored(false);
                    }}
                    className="self-start text-xs font-bold uppercase tracking-[0.12em] text-vinho-600 underline-offset-4 hover:underline sm:self-auto"
                  >
                    Limpar e recomeçar
                  </button>
                </div>
              ) : null}

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, ease: EASE }}
                >
                  <header className="mb-8 flex items-start gap-4">
                    <span className="font-display text-4xl font-light italic leading-none text-dourado-500 sm:text-5xl">
                      {String(form.step + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        id="etapa-titulo"
                        ref={headingRef}
                        tabIndex={-1}
                        className="font-display text-[1.7rem] leading-tight text-vinho-800 outline-none sm:text-3xl"
                      >
                        {current.title}
                      </h3>
                      <p className="mt-1 text-sm text-tinta-suave">{current.description}</p>
                    </div>
                  </header>
                  <StepComponent form={form} />
                </motion.div>
              </AnimatePresence>

              {summary ? (
                <p role="alert" className="mt-8 flex items-center gap-2 rounded-2xl bg-framboesa/8 px-4 py-3 text-sm font-semibold text-framboesa">
                  <CircleAlert size={17} className="shrink-0" /> {summary}
                </p>
              ) : null}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-creme-300/70 pt-7 sm:flex-row sm:items-center sm:justify-between">
                {form.step > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSummary(null);
                      form.back();
                    }}
                    className="btn btn-contorno text-vinho-700"
                  >
                    <ArrowLeft size={16} /> Voltar
                  </button>
                ) : (
                  <span className="hidden text-xs text-tinta-suave sm:block">
                    <span className="text-framboesa">*</span> campos obrigatórios
                  </span>
                )}
                {isLast ? (
                  <button type="submit" className="btn btn-vinho min-h-14 px-7 text-[0.8rem]">
                    <WhatsAppIcon size={18} /> Enviar solicitação de orçamento
                  </button>
                ) : (
                  <button type="submit" className="btn btn-vinho">
                    Continuar <ArrowRight size={16} className="arrow" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
