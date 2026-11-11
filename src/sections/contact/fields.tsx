import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type FieldA11y = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  /** Mostra o selo de "ok" quando preenchido corretamente. */
  valid?: boolean;
  className?: string;
  /** Para grupos (radio/checkbox) o rótulo vira <legend>. */
  group?: boolean;
  children: (a11y: FieldA11y) => ReactNode;
};

/** Envoltório de campo: rótulo, ajuda, validação acessível e microinterações. */
export function Field({ id, label, required, hint, error, valid, className, group, children }: FieldProps) {
  const hintId = hint ? `${id}-ajuda` : undefined;
  const errorId = error ? `${id}-erro` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const a11y: FieldA11y = { id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required || undefined };

  const labelClass =
    "mb-2 flex w-full items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-vinho-800 transition-colors group-focus-within/field:text-vinho-500";
  const labelContent = (
    <>
      {label}
      {required ? (
        <span className="text-framboesa" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="text-[0.68rem] font-semibold normal-case tracking-normal text-tinta-suave/80">(opcional)</span>
      )}
      <AnimatePresence>
        {valid && !error ? (
          <motion.span
            key="ok"
            className="ml-auto grid size-5 place-items-center rounded-full bg-emerald-600/90 text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            aria-hidden="true"
          >
            <Check size={12} strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </>
  );

  const body = (
    <>
      {children(a11y)}
      {hint ? (
        <p id={hintId} className="mt-2 text-[0.82rem] leading-relaxed text-tinta-suave">
          {hint}
        </p>
      ) : null}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key={error}
            id={errorId}
            className="anim-shake mt-2 flex items-start gap-1.5 text-[0.82rem] font-semibold text-framboesa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <CircleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  );

  if (group) {
    return (
      <fieldset className={cn("group/field relative min-w-0", className)} aria-describedby={describedBy}>
        <legend className={labelClass}>{labelContent}</legend>
        {body}
      </fieldset>
    );
  }
  return (
    <div className={cn("group/field relative min-w-0", className)}>
      <label htmlFor={id} className={labelClass}>
        {labelContent}
      </label>
      {body}
    </div>
  );
}

/* ───────────── Grupo de opções em cartões (radio) ───────────── */

type Choice = { value: string; label?: string; hint?: string; icon?: ReactNode };

export function ChoiceGroup({
  name,
  value,
  options,
  onChange,
  columns = "grid-cols-2 sm:grid-cols-4",
  a11y,
  size = "md",
}: {
  name: string;
  value: string;
  options: (string | Choice)[];
  onChange: (v: string) => void;
  columns?: string;
  a11y: FieldA11y;
  size?: "sm" | "md";
}) {
  const list: Choice[] = options.map((o) => (typeof o === "string" ? { value: o } : o));
  return (
    <div role="radiogroup" aria-invalid={a11y["aria-invalid"]} aria-describedby={a11y["aria-describedby"]} className={cn("grid gap-2.5", columns)} id={a11y.id}>
      {list.map((opt) => {
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-3 rounded-2xl border bg-creme-50 transition-all duration-300 ease-[var(--ease-cine)] hover:-translate-y-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dourado-500 has-[:focus-visible]:ring-offset-2",
              size === "sm" ? "min-h-11 px-3.5 py-2.5" : "min-h-14 px-4 py-3",
              checked
                ? "border-vinho-700 bg-vinho-700 text-marfim shadow-[0_12px_28px_-16px_rgba(83,2,28,0.8)]"
                : "border-creme-300 text-tinta hover:border-rosa-300",
              a11y["aria-invalid"] && !value && "border-framboesa/60",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.icon ? <span className={cn("shrink-0", checked ? "text-champanhe-200" : "text-vinho-500")}>{opt.icon}</span> : null}
            <span className="min-w-0">
              <span className={cn(size === "sm" ? "text-sm" : "text-[0.95rem]", "block font-semibold leading-tight")}>
                {opt.label ?? opt.value}
              </span>
              {opt.hint ? (
                <span className={cn("mt-0.5 block text-xs", checked ? "text-creme-200/85" : "text-tinta-suave")}>{opt.hint}</span>
              ) : null}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "ml-auto grid size-5 shrink-0 place-items-center rounded-full border transition-all duration-300",
                checked ? "scale-100 border-champanhe-200 bg-champanhe-200 text-vinho-800" : "scale-90 border-creme-300",
              )}
            >
              {checked ? <Check size={12} strokeWidth={3} /> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ───────────── Chips de múltipla escolha com limite ───────────── */

export function ChipGroup({
  values,
  options,
  onToggle,
  max,
  exclusive,
  a11y,
}: {
  values: string[];
  options: { value: string; special?: boolean }[];
  onToggle: (v: string) => void;
  max: number;
  /** Valor que, quando marcado, desmarca os demais (ex.: "Ainda não decidi"). */
  exclusive?: string;
  a11y: FieldA11y;
}) {
  const count = values.filter((v) => v !== exclusive).length;
  return (
    <div className="flex flex-wrap gap-2" id={a11y.id} aria-describedby={a11y["aria-describedby"]}>
      {options.map((opt) => {
        const checked = values.includes(opt.value);
        const disabled = !checked && opt.value !== exclusive && count >= max;
        return (
          <label
            key={opt.value}
            className={cn(
              "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dourado-500 has-[:focus-visible]:ring-offset-2",
              checked
                ? "border-vinho-700 bg-vinho-700 font-semibold text-marfim"
                : "border-creme-300 bg-creme-50 text-tinta hover:border-rosa-300",
              disabled && "cursor-not-allowed opacity-40 hover:border-creme-300",
            )}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              disabled={disabled}
              onChange={() => onToggle(opt.value)}
            />
            {checked ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : null}
            {opt.value.replace(" (especial)", "")}
            {opt.special ? (
              <span className={cn("rounded-full px-1.5 py-px text-[0.6rem] font-bold uppercase tracking-wider", checked ? "bg-champanhe-200 text-vinho-800" : "bg-champanhe-200/60 text-dourado-600")}>
                especial
              </span>
            ) : null}
          </label>
        );
      })}
    </div>
  );
}
