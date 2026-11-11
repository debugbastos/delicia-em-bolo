import { motion } from "framer-motion";
import { Pencil, Scale } from "lucide-react";
import { quoteNotice } from "@/data/site";
import { formatDateBR } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { deliveryAddress, eventLabel, steps } from "./quote-model";
import type { QuoteForm } from "./useQuoteForm";

type Row = [string, string | undefined];

/** 7 · Revisão — resumo organizado com atalhos para editar cada etapa. */
export function ReviewStep({ form }: { form: QuoteForm }) {
  const { data, refs, goTo } = form;

  const groups: { step: number; rows: Row[] }[] = [
    { step: 0, rows: [["Nome", data.nome], ["WhatsApp", data.whatsapp], ["E-mail", data.email]] },
    {
      step: 1,
      rows: [
        ["Evento", eventLabel(data)],
        ["Data", data.data ? formatDateBR(data.data) : ""],
        ["Horário", data.horario],
        ["Cidade / bairro", [data.cidade, data.bairro].filter(Boolean).join(" · ")],
        ["Endereço do evento", data.enderecoEvento],
        ["Pessoas", data.pessoas],
      ],
    },
    {
      step: 2,
      rows: [
        ["Tema", data.tema],
        ["Nome/idade", data.nomeIdade],
        ["Peso", data.peso ? `${data.peso} kg` : ""],
        ["Andares", data.andares],
        ["Formato", data.formato],
        ["Estilo", data.estilo],
        ["Cores", data.cores],
        ["Frase", data.frase],
      ],
    },
    {
      step: 3,
      rows: [
        ["Massa", data.massa],
        ["Recheio(s)", data.recheios.join(" + ")],
        ["Cobertura", data.cobertura],
        ["Complementos", data.complementos],
        ["Restrições", data.restricoes],
        ["Preferências", data.preferencias],
      ],
    },
    {
      step: 4,
      rows: [
        ["Imagens", refs.length ? `${refs.length} selecionada${refs.length > 1 ? "s" : ""}` : "Nenhuma"],
        ["Detalhes", data.detalhes],
      ],
    },
    {
      step: 5,
      rows: [
        ["Retirada/entrega", data.entregaModo],
        ["Endereço de entrega", deliveryAddress(data)],
        ["Montagem", data.montagem],
        ["Orçamento", data.orcamento],
        ["Observações", data.observacoes],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g, gi) => (
          <motion.section
            key={g.step}
            className="rounded-2xl border border-creme-300 bg-creme-50 p-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: gi * 0.05, ease: EASE }}
            aria-labelledby={`rev-${g.step}`}
          >
            <header className="mb-3 flex items-center justify-between gap-3">
              <h4 id={`rev-${g.step}`} className="font-display text-lg text-vinho-800">
                <span className="mr-2 text-sm italic text-dourado-500">0{g.step + 1}</span>
                {steps[g.step].title}
              </h4>
              <button
                type="button"
                onClick={() => goTo(g.step)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-vinho-600 transition hover:bg-vinho-700/8"
                aria-label={`Editar ${steps[g.step].title}`}
              >
                <Pencil size={13} /> Editar
              </button>
            </header>
            <dl className="space-y-1.5 text-sm">
              {g.rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3">
                  <dt className="text-tinta-suave">{k}</dt>
                  <dd className={v ? "break-words font-medium text-tinta" : "text-tinta-suave/50"}>{v || "—"}</dd>
                </div>
              ))}
            </dl>
            {g.step === 4 && refs.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {refs.map((r, i) => (
                  <li key={r.id}>
                    <img src={r.url} alt={`Referência ${i + 1}`} className="size-14 rounded-lg border border-creme-300 object-cover" />
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.section>
        ))}
      </div>

      <motion.div
        role="note"
        className="relative overflow-hidden rounded-[1.5rem] bg-vinho-800 p-6 text-marfim shadow-[var(--shadow-bolo)] sm:p-7"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        <span aria-hidden="true" className="anim-glint absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-champanhe-100/10 to-transparent" />
        <div className="relative flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-champanhe-200 text-vinho-800">
            <Scale size={20} />
          </span>
          <div>
            <p className="eyebrow text-champanhe-300">Aviso comercial</p>
            <p className="mt-2 leading-relaxed text-creme-100">{quoteNotice}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
