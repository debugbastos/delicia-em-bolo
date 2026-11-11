import { motion } from "framer-motion";
import { Check, Copy, CreditCard, Info, Landmark, ArrowRight } from "lucide-react";
import { useState } from "react";
import { andares, informacoes, massas, pagamento, prices, recheios, tamanhos } from "@/data/menu";
import { quoteNotice } from "@/data/site";
import { splitPrice } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { cn, scrollToSection } from "@/lib/utils";

const item = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.08 + i * 0.05, ease: EASE },
});

function Diamond({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block size-1.5 shrink-0 rotate-45 bg-dourado-400", className)} />;
}

function PanelTitle({ children, note }: { children: string; note?: string }) {
  return (
    <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl font-light italic text-champanhe-200 md:text-[1.7rem]">
      {children}
      {note ? <span className="font-sans text-[0.7rem] font-semibold not-italic uppercase tracking-[0.2em] text-champanhe-300/70">{note}</span> : null}
    </h3>
  );
}

/* ───────────────────────── Valores ───────────────────────── */

export function PricesPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10 lg:col-span-7">
        <PanelTitle>{prices.title}</PanelTitle>
        <ul className="mt-8 divide-y divide-champanhe-300/10">
          {prices.items.map((p, i) => {
            const { int, cents } = splitPrice(p.price);
            return (
              <motion.li key={p.name} {...item(i)} className="group flex items-end gap-3 py-4 sm:gap-4">
                <div className="min-w-0">
                  {p.tag ? (
                    <span className="mb-1 inline-block rounded-full bg-champanhe-300/15 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-champanhe-200">
                      {p.tag}
                    </span>
                  ) : null}
                  <p className="font-display text-[1.25rem] leading-tight text-marfim transition-colors group-hover:text-champanhe-100 sm:text-[1.45rem]">
                    {p.name}
                  </p>
                </div>
                <span aria-hidden="true" className="mb-2 h-px flex-1 border-b border-dotted border-champanhe-300/35" />
                <p className="shrink-0 text-right leading-none">
                  <span className="sr-only">
                    R$ {int}
                    {cents} por {p.unit === "kg" ? "quilo" : "unidade"}
                  </span>
                  <span aria-hidden="true" className="flex items-baseline justify-end gap-1">
                    <span className="text-xs font-semibold text-champanhe-300">R$</span>
                    <span className="font-display text-[2rem] font-normal text-marfim sm:text-[2.3rem]">
                      {int}
                      <span className="text-base text-marfim/80">{cents}</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-champanhe-300/80">
                    {p.unit === "kg" ? "por kg" : "por unidade"}
                  </span>
                </p>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <motion.aside {...item(3)} className="flex flex-col rounded-[2rem] bg-marfim p-6 text-tinta sm:p-10 lg:col-span-5">
        <span className="grid size-12 place-items-center rounded-full bg-vinho-700 text-marfim">
          <Info size={20} />
        </span>
        <h3 className="mt-6 font-display text-2xl text-vinho-800">Como o valor é definido</h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-tinta-suave">{quoteNotice}</p>
        <ul className="mt-6 space-y-3 text-sm text-tinta">
          <li className="flex gap-3">
            <Diamond className="mt-1.5" /> Massas especiais (ameixa e nozes) têm 10% de acréscimo.
          </li>
          <li className="flex gap-3">
            <Diamond className="mt-1.5" /> Flores, topper, modelagem, pinturas, glitter ou estruturas são cobrados à parte.
          </li>
          <li className="flex gap-3">
            <Diamond className="mt-1.5" /> Pagamento no cartão acrescenta a taxa.
          </li>
        </ul>
        <div className="mt-auto pt-8">
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contato");
            }}
            className="btn btn-vinho"
          >
            Solicitar orçamento <ArrowRight size={16} className="arrow" />
          </a>
        </div>
      </motion.aside>
    </div>
  );
}

/* ───────────────────────── Massas e recheios ───────────────────────── */

function FlavorList({ items, columns = 1, start = 0 }: { items: string[]; columns?: 1 | 2; start?: number }) {
  return (
    <ul className={cn("mt-5 grid gap-x-8 gap-y-3", columns === 2 && "sm:grid-cols-2")}>
      {items.map((name, i) => (
        <motion.li key={name} {...item(start + i)} className="flex items-center gap-3 text-[1.02rem] text-creme-100">
          <Diamond />
          {name}
        </motion.li>
      ))}
    </ul>
  );
}

export function FlavorsPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10 lg:col-span-5">
        <p className="eyebrow text-champanhe-300/80">Massas</p>
        <div className="mt-6 space-y-9">
          <div>
            <PanelTitle>{massas.dosSonhos.title}</PanelTitle>
            <FlavorList items={massas.dosSonhos.items} columns={2} />
          </div>
          <div>
            <PanelTitle note={massas.especiais.note}>{massas.especiais.title}</PanelTitle>
            <FlavorList items={massas.especiais.items} columns={2} start={6} />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10 lg:col-span-7">
        <p className="eyebrow text-champanhe-300/80">Recheios</p>
        <div className="mt-6 space-y-9">
          <div>
            <PanelTitle>{recheios.comuns.title}</PanelTitle>
            <FlavorList items={recheios.comuns.items} columns={2} />
          </div>
          <div>
            <PanelTitle>{recheios.especiais.title}</PanelTitle>
            <FlavorList items={recheios.especiais.items} columns={2} start={4} />
          </div>
        </div>
        <p className="mt-9 rounded-2xl border border-dourado-400/30 bg-dourado-400/10 px-5 py-4 text-sm font-semibold text-champanhe-200">
          * {recheios.note}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── Tamanhos ───────────────────────── */

function CakeSilhouette({ cm, max = 40, className }: { cm: number; max?: number; className?: string }) {
  const w = 34 + ((cm - 12) / (max - 12)) * 62; // 34% → 96%
  return (
    <svg viewBox="0 0 100 40" className={cn("w-full", className)} aria-hidden="true">
      <g transform={`translate(${(100 - w) / 2} 0)`}>
        <rect x="0" y="10" width={w} height="24" rx="3.5" fill="currentColor" />
        <path
          d={`M2 13 Q ${w * 0.17} 21 ${w * 0.33} 14 T ${w * 0.66} 14 T ${w - 2} 13 V 12 H 2 Z`}
          fill="var(--color-marfim)"
          opacity="0.9"
        />
        <rect x={-3} y="33" width={w + 6} height="3.2" rx="1.6" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  );
}

function TierStack({ tiers }: { tiers: number[] }) {
  const max = 40;
  const tierH = 15;
  const totalH = tiers.length * tierH + 6;
  return (
    <svg viewBox={`0 0 200 ${totalH}`} className="w-full" role="img" aria-label={`Bolo de ${tiers.length} andares: ${tiers.join(", ")} cm`}>
      {tiers.map((cm, i) => {
        const w = 18 + (cm / max) * 88;
        const x = 64 - w / 2;
        const y = i * tierH;
        return (
          <g key={i}>
            <rect x={x} y={y + 1} width={w} height={tierH - 2} rx="2.5" fill="var(--color-champanhe-200)" />
            <path
              d={`M${x + 1.5} ${y + 3} q ${w * 0.12} 6 ${w * 0.25} 1.5 t ${w * 0.25} 0 t ${w * 0.25} 0 t ${w * 0.25 - 3} -1 v -2 h ${-w + 3} z`}
              fill="var(--color-marfim)"
            />
            <line x1={x + w + 4} x2="150" y1={y + tierH / 2} y2={y + tierH / 2} stroke="var(--color-champanhe-300)" strokeDasharray="2 2.5" strokeWidth="0.6" opacity="0.7" />
            <text x="154" y={y + tierH / 2 + 3.2} fontSize="9" fill="var(--color-marfim)" fontFamily="var(--font-display)">
              {cm} cm
            </text>
          </g>
        );
      })}
      <rect x={64 - (18 + (tiers[tiers.length - 1] / max) * 88) / 2 - 5} y={tiers.length * tierH} width={18 + (tiers[tiers.length - 1] / max) * 88 + 10} height="3.5" rx="1.75" fill="var(--color-dourado-400)" />
    </svg>
  );
}

export function SizesPanel() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <PanelTitle>Bolos de um andar</PanelTitle>
          <p className="text-sm text-creme-200/70">Diâmetro e rendimento aproximado em fatias.</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {tamanhos.items.map((t, i) => (
            <motion.li
              key={t.cm}
              {...item(i * 0.6)}
              className="group rounded-2xl border border-champanhe-300/10 bg-vinho-950/30 px-3 pb-4 pt-5 text-center transition-colors duration-500 hover:border-champanhe-300/40 hover:bg-vinho-950/50"
            >
              <CakeSilhouette cm={t.cm} className="mx-auto h-10 text-vinho-400 transition-colors duration-500 group-hover:text-champanhe-300" />
              <p className="mt-3 font-display text-2xl text-marfim">
                {t.cm}
                <span className="ml-0.5 text-sm text-champanhe-300">cm</span>
              </p>
              <p className="mt-0.5 text-xs text-creme-200/75">{t.fatias} fatias</p>
            </motion.li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-champanhe-200/80">* {tamanhos.note}</p>
      </div>

      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10">
        <PanelTitle>Tamanhos com andares</PanelTitle>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {andares.map((tiers, i) => (
            <motion.li key={i} {...item(i)} className="rounded-2xl border border-champanhe-300/10 bg-vinho-950/30 p-5">
              <p className="eyebrow text-champanhe-300/80">{tiers.length} andares</p>
              <div className="mt-4">
                <TierStack tiers={tiers} />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── Pagamento e informações ───────────────────────── */

export function PaymentPanel() {
  const [copied, setCopied] = useState(false);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10">
          <PanelTitle>Forma de pagamento</PanelTitle>
          <ul className="mt-6 flex flex-wrap gap-2">
            {pagamento.formas.map((f, i) => (
              <motion.li
                key={f.label}
                {...item(i)}
                className="inline-flex items-center gap-2 rounded-full border border-champanhe-300/30 px-4 py-2 text-sm text-marfim"
              >
                {f.label === "Cartão" ? <CreditCard size={15} className="text-champanhe-300" /> : <Diamond />}
                {f.label}
                {f.note ? <span className="text-xs text-creme-200/60">({f.note})</span> : null}
              </motion.li>
            ))}
          </ul>
        </div>

        {pagamento.mostrarDadosBancarios ? (
          <div className="rounded-[2rem] bg-marfim p-6 text-tinta sm:p-8">
            <p className="eyebrow flex items-center gap-2 text-dourado-600">
              <Landmark size={14} /> Dados para pagamento
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {pagamento.dados.map((d) => (
                <div key={d.tipo} className="rounded-2xl border border-vinho-700/10 bg-creme-50 p-4">
                  <p className="font-display text-lg text-vinho-800">{d.tipo}</p>
                  {d.linhas.map((l, i) => (
                    <p key={l} className={cn("text-sm", i === 0 ? "mt-1 font-semibold text-tinta" : "text-tinta-suave")}>
                      {l}
                    </p>
                  ))}
                  {d.copiar ? (
                    <button
                      type="button"
                      onClick={() => copy(d.copiar!)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-vinho-700 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-marfim transition hover:bg-vinho-600"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Chave copiada" : "Copiar chave Pix"}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? "Chave Pix copiada para a área de transferência." : ""}
            </p>
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-champanhe-300/15 bg-vinho-900/50 p-6 sm:p-10 lg:col-span-7">
        <PanelTitle>Informações importantes</PanelTitle>
        <ol className="mt-7 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {informacoes.map((info, i) => (
            <motion.li key={info} {...item(i)} className="flex gap-4 text-[0.95rem] leading-relaxed text-creme-100/90">
              <span className="font-display text-sm italic text-dourado-400">{String(i + 1).padStart(2, "0")}</span>
              <span>{info}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
