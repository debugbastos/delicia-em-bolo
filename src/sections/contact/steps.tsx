import { motion } from "framer-motion";
import { Lightbulb, Truck } from "lucide-react";
import type { ReactNode } from "react";
import {
  assemblyOptions,
  budgetRanges,
  coberturas,
  deliveryModes,
  eventTypes,
  massaOptions,
  NAO_DECIDI,
  recheioOptions,
  shapes,
  styles,
  tiers,
} from "@/data/form-options";
import { prices, recheios, suggestSize } from "@/data/menu";
import { maskPhone, onlyDigits, splitPrice, todayISO } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { ChipGroup, ChoiceGroup, Field } from "./fields";
import type { QuoteForm } from "./useQuoteForm";

type StepProps = { form: QuoteForm };

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">{children}</div>;
}

const full = "sm:col-span-2";

/* ───────────── 1 · Cliente ───────────── */

export function StepCliente({ form }: StepProps) {
  const { data, set, errors } = form;
  return (
    <Grid>
      <Field id="f-nome" label="Nome completo" required error={errors.nome} valid={data.nome.trim().length >= 3} className={full}>
        {(a) => (
          <input
            {...a}
            className="field-input"
            value={data.nome}
            onChange={(e) => set("nome", e.target.value)}
            autoComplete="name"
            placeholder="Como devemos chamar você?"
          />
        )}
      </Field>
      <Field
        id="f-whatsapp"
        label="WhatsApp para contato"
        required
        error={errors.whatsapp}
        valid={onlyDigits(data.whatsapp).length >= 10}
        hint="Com DDD. É por ele que a confeiteira vai responder."
      >
        {(a) => (
          <input
            {...a}
            type="tel"
            inputMode="numeric"
            className="field-input"
            value={data.whatsapp}
            onChange={(e) => set("whatsapp", maskPhone(e.target.value))}
            autoComplete="tel-national"
            placeholder="(75) 99999-9999"
          />
        )}
      </Field>
      <Field id="f-email" label="E-mail" error={errors.email}>
        {(a) => (
          <input
            {...a}
            type="email"
            className="field-input"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
            placeholder="voce@email.com"
          />
        )}
      </Field>
    </Grid>
  );
}

/* ───────────── 2 · Evento ───────────── */

export function StepEvento({ form }: StepProps) {
  const { data, set, errors } = form;
  const people = Number(data.pessoas);
  const size = suggestSize(people);
  return (
    <Grid>
      <Field id="f-tipo" label="Tipo de evento" required error={errors.tipoEvento} group className={full}>
        {(a) => (
          <ChoiceGroup
            name="tipoEvento"
            value={data.tipoEvento}
            options={eventTypes}
            onChange={(v) => set("tipoEvento", v)}
            a11y={a}
            size="sm"
          />
        )}
      </Field>
      {data.tipoEvento === "Outro" ? (
        <Field id="f-tipo-outro" label="Qual evento?" required error={errors.tipoEventoOutro} className={full}>
          {(a) => (
            <input
              {...a}
              className="field-input"
              value={data.tipoEventoOutro}
              onChange={(e) => set("tipoEventoOutro", e.target.value)}
              placeholder="Ex.: bodas, aniversário de empresa, mesversário…"
            />
          )}
        </Field>
      ) : null}
      <Field id="f-data" label="Data do evento" required error={errors.data} valid={Boolean(data.data) && !errors.data}>
        {(a) => (
          <input {...a} type="date" min={todayISO()} className="field-input" value={data.data} onChange={(e) => set("data", e.target.value)} />
        )}
      </Field>
      <Field id="f-horario" label="Horário do evento" error={errors.horario}>
        {(a) => <input {...a} type="time" className="field-input" value={data.horario} onChange={(e) => set("horario", e.target.value)} />}
      </Field>
      <Field id="f-cidade" label="Cidade" required error={errors.cidade} valid={Boolean(data.cidade.trim())}>
        {(a) => (
          <input {...a} className="field-input" value={data.cidade} onChange={(e) => set("cidade", e.target.value)} autoComplete="address-level2" />
        )}
      </Field>
      <Field id="f-bairro" label="Bairro" required error={errors.bairro} valid={Boolean(data.bairro.trim())}>
        {(a) => <input {...a} className="field-input" value={data.bairro} onChange={(e) => set("bairro", e.target.value)} />}
      </Field>
      <Field
        id="f-endereco-evento"
        label="Endereço completo do evento"
        error={errors.enderecoEvento}
        hint="Necessário caso você queira entrega."
        className={full}
      >
        {(a) => (
          <input
            {...a}
            className="field-input"
            value={data.enderecoEvento}
            onChange={(e) => set("enderecoEvento", e.target.value)}
            autoComplete="street-address"
            placeholder="Rua, número, complemento e ponto de referência"
          />
        )}
      </Field>
      <Field id="f-pessoas" label="Quantidade de pessoas" required error={errors.pessoas} valid={people > 0 && !errors.pessoas}>
        {(a) => (
          <input
            {...a}
            type="number"
            min={1}
            inputMode="numeric"
            className="field-input"
            value={data.pessoas}
            onChange={(e) => set("pessoas", e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Ex.: 50"
          />
        )}
      </Field>
      <div className="self-end">
        {people > 0 ? (
          <motion.div
            key={size ? size.cm : "andares"}
            className="flex gap-3 rounded-2xl border border-dourado-400/40 bg-champanhe-100/60 p-4 text-sm text-tinta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-live="polite"
          >
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-dourado-600" />
            {size ? (
              <span>
                Referência do cardápio: um bolo de <strong>{size.cm} cm</strong> rende de {size.fatias} fatias.
              </span>
            ) : (
              <span>Para mais de 150 fatias, veja os <strong>tamanhos com andares</strong> no cardápio.</span>
            )}
          </motion.div>
        ) : null}
      </div>
    </Grid>
  );
}

/* ───────────── 3 · Bolo ───────────── */

const shapeIcon = (shape: string) => {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6 };
  switch (shape) {
    case "Redondo":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
        </svg>
      );
    case "Quadrado":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      );
    case "Retangular":
      return (
        <svg {...common}>
          <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
      );
  }
};

export function StepBolo({ form }: StepProps) {
  const { data, set, errors } = form;
  return (
    <Grid>
      <Field id="f-tema" label="Tema do bolo" required error={errors.tema} valid={Boolean(data.tema.trim())} className={full}>
        {(a) => (
          <input
            {...a}
            className="field-input"
            value={data.tema}
            onChange={(e) => set("tema", e.target.value)}
            placeholder="Ex.: jardim encantado, fundo do mar, floral clássico…"
          />
        )}
      </Field>
      <Field id="f-nome-idade" label="Nome ou idade no bolo" error={errors.nomeIdade}>
        {(a) => (
          <input {...a} className="field-input" value={data.nomeIdade} onChange={(e) => set("nomeIdade", e.target.value)} placeholder="Ex.: Pietra · 2 anos" />
        )}
      </Field>
      <Field id="f-peso" label="Peso desejado (KG)" error={errors.peso} hint="Não sabe? Deixe em branco — a confeiteira ajuda a calcular.">
        {(a) => (
          <div className="relative">
            <input
              {...a}
              inputMode="decimal"
              className="field-input pr-12"
              value={data.peso}
              onChange={(e) => set("peso", e.target.value.replace(/[^\d,.]/g, ""))}
              placeholder="Ex.: 2,5"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-tinta-suave">kg</span>
          </div>
        )}
      </Field>
      <Field id="f-andares" label="Quantidade de andares" error={errors.andares}>
        {(a) => (
          <select {...a} className="field-input" value={data.andares} onChange={(e) => set("andares", e.target.value)}>
            <option value="">Selecione</option>
            {tiers.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}
      </Field>
      <Field id="f-cores" label="Cores predominantes" error={errors.cores}>
        {(a) => (
          <input {...a} className="field-input" value={data.cores} onChange={(e) => set("cores", e.target.value)} placeholder="Ex.: rosa e dourado" />
        )}
      </Field>
      <Field id="f-formato" label="Formato" required error={errors.formato} group className={full}>
        {(a) => (
          <ChoiceGroup
            name="formato"
            value={data.formato}
            options={shapes.map((s) => ({ value: s, icon: shapeIcon(s) }))}
            onChange={(v) => set("formato", v)}
            a11y={a}
          />
        )}
      </Field>
      <Field id="f-estilo" label="Estilo" required error={errors.estilo} group className={full}>
        {(a) => (
          <ChoiceGroup
            name="estilo"
            value={data.estilo}
            options={styles}
            onChange={(v) => set("estilo", v)}
            a11y={a}
            columns="grid-cols-2 sm:grid-cols-3"
            size="sm"
          />
        )}
      </Field>
      <Field id="f-frase" label="Frase ou mensagem no bolo" error={errors.frase} className={full}>
        {(a) => (
          <textarea
            {...a}
            rows={2}
            className="field-input !min-h-[5rem]"
            value={data.frase}
            onChange={(e) => set("frase", e.target.value)}
            placeholder="Ex.: Feliz aniversário, Miguel!"
          />
        )}
      </Field>
    </Grid>
  );
}

/* ───────────── 4 · Sabores ───────────── */

export function StepSabores({ form }: StepProps) {
  const { data, set, errors, toggleRecheio } = form;
  const groups = ["Dos sonhos", "Especiais"];
  const coberturaPrice = (name: string) => {
    const p = prices.items.find((x) => x.name === name);
    if (!p) return undefined;
    const { int, cents } = splitPrice(p.price);
    return `R$ ${int}${cents}/kg`;
  };

  return (
    <Grid>
      <Field id="f-massa" label="Massa desejada" required error={errors.massa} valid={Boolean(data.massa)} className={full}>
        {(a) => (
          <select {...a} className="field-input" value={data.massa} onChange={(e) => set("massa", e.target.value)}>
            <option value="">Selecione a massa</option>
            {groups.map((g) => (
              <optgroup key={g} label={g === "Especiais" ? "Especiais (10% de acréscimo)" : "Massas dos sonhos"}>
                {massaOptions
                  .filter((m) => m.group === g)
                  .map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
              </optgroup>
            ))}
            <option value={NAO_DECIDI}>{NAO_DECIDI}</option>
          </select>
        )}
      </Field>

      <Field
        id="f-recheios"
        label={`Recheios (até ${recheios.maxPerCake} por andar)`}
        required
        error={errors.recheios}
        group
        className={full}
        hint={`${data.recheios.filter((r) => r !== NAO_DECIDI).length} de ${recheios.maxPerCake} selecionados · ${recheios.note}`}
      >
        {(a) => (
          <ChipGroup
            values={data.recheios}
            options={[...recheioOptions, { value: NAO_DECIDI }]}
            onToggle={toggleRecheio}
            max={recheios.maxPerCake}
            exclusive={NAO_DECIDI}
            a11y={a}
          />
        )}
      </Field>

      <Field id="f-cobertura" label="Cobertura" required error={errors.cobertura} group className={full}>
        {(a) => (
          <ChoiceGroup
            name="cobertura"
            value={data.cobertura}
            options={coberturas.map((c) => ({ value: c, hint: coberturaPrice(c) }))}
            onChange={(v) => set("cobertura", v)}
            a11y={a}
          />
        )}
      </Field>

      <Field id="f-complementos" label="Ingredientes ou complementos especiais" error={errors.complementos}>
        {(a) => (
          <input
            {...a}
            className="field-input"
            value={data.complementos}
            onChange={(e) => set("complementos", e.target.value)}
            placeholder="Ex.: frutas vermelhas, flores naturais…"
          />
        )}
      </Field>
      <Field id="f-restricoes" label="Restrições alimentares ou alergias" error={errors.restricoes}>
        {(a) => (
          <input
            {...a}
            className="field-input"
            value={data.restricoes}
            onChange={(e) => set("restricoes", e.target.value)}
            placeholder="Ex.: sem lactose, alergia a amendoim…"
          />
        )}
      </Field>
      <Field id="f-preferencias" label="Preferências adicionais" error={errors.preferencias} className={full}>
        {(a) => (
          <textarea
            {...a}
            rows={3}
            className="field-input"
            value={data.preferencias}
            onChange={(e) => set("preferencias", e.target.value)}
            placeholder="Algo mais sobre o sabor que você imagina?"
          />
        )}
      </Field>
    </Grid>
  );
}

/* ───────────── 6 · Comercial ───────────── */

export function StepComercial({ form }: StepProps) {
  const { data, set, errors } = form;
  const hasEventAddress = Boolean(data.enderecoEvento.trim());
  return (
    <Grid>
      <Field id="f-entrega" label="Retirada ou entrega" required error={errors.entregaModo} group className={full}>
        {(a) => (
          <ChoiceGroup
            name="entregaModo"
            value={data.entregaModo}
            options={deliveryModes.map((m) => ({ value: m.value, hint: m.hint, icon: m.value === "Entrega" ? <Truck size={20} /> : undefined }))}
            onChange={(v) => set("entregaModo", v)}
            a11y={a}
            columns="grid-cols-1 sm:grid-cols-2"
          />
        )}
      </Field>

      {data.entregaModo === "Entrega" ? (
        <motion.div
          className={`${full} space-y-4 rounded-2xl border border-creme-300 bg-creme-50 p-4 sm:p-5`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {hasEventAddress ? (
            <label className="flex cursor-pointer items-start gap-3 text-sm text-tinta">
              <input
                type="checkbox"
                checked={data.mesmoEndereco}
                onChange={(e) => set("mesmoEndereco", e.target.checked)}
                className="mt-0.5 size-5 accent-vinho-700"
              />
              <span>
                Entregar no endereço do evento: <strong className="font-semibold">{data.enderecoEvento}</strong>
              </span>
            </label>
          ) : null}
          {!hasEventAddress || !data.mesmoEndereco ? (
            <Field id="f-endereco-entrega" label="Endereço de entrega" required error={errors.enderecoEntrega}>
              {(a) => (
                <textarea
                  {...a}
                  rows={2}
                  className="field-input !min-h-[5rem]"
                  value={data.enderecoEntrega}
                  onChange={(e) => set("enderecoEntrega", e.target.value)}
                  placeholder="Rua, número, bairro e ponto de referência"
                />
              )}
            </Field>
          ) : null}
        </motion.div>
      ) : null}

      <Field id="f-montagem" label="Montagem no local" required error={errors.montagem} group>
        {(a) => (
          <ChoiceGroup
            name="montagem"
            value={data.montagem}
            options={assemblyOptions}
            onChange={(v) => set("montagem", v)}
            a11y={a}
            columns="grid-cols-3 sm:grid-cols-3"
            size="sm"
          />
        )}
      </Field>
      <Field id="f-orcamento" label="Faixa de orçamento" error={errors.orcamento}>
        {(a) => (
          <select {...a} className="field-input" value={data.orcamento} onChange={(e) => set("orcamento", e.target.value)}>
            <option value="">Selecione (opcional)</option>
            {budgetRanges.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        )}
      </Field>
      <Field id="f-observacoes" label="Observações adicionais" error={errors.observacoes} className={full}>
        {(a) => (
          <textarea
            {...a}
            rows={3}
            className="field-input"
            value={data.observacoes}
            onChange={(e) => set("observacoes", e.target.value)}
            placeholder="Algo mais que a confeiteira deva saber?"
          />
        )}
      </Field>
    </Grid>
  );
}
