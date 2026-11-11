import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Info, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { referenceKinds, uploadRules, type ReferenceKind } from "@/data/form-options";
import { formatBytes } from "@/lib/format";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Field } from "./fields";
import type { QuoteForm } from "./useQuoteForm";

/** 5 · Personalização e referências — envio de imagens com pré-visualização. */
export function ReferencesStep({ form }: { form: QuoteForm }) {
  const { refs, addFiles, removeRef, setRefKind, uploadErrors, data, set, errors } = form;
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<ReferenceKind>("Referência de bolo");
  const [dragging, setDragging] = useState(false);
  const full = refs.length >= uploadRules.maxFiles;

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-vinho-800">
          Tipo das imagens que você vai adicionar
        </legend>
        <div className="flex flex-wrap gap-2">
          {referenceKinds.map((k) => (
            <label
              key={k}
              className={cn(
                "inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-dourado-500",
                kind === k ? "border-vinho-700 bg-vinho-700 font-semibold text-marfim" : "border-creme-300 bg-creme-50 hover:border-rosa-300",
              )}
            >
              <input type="radio" name="ref-kind" className="sr-only" checked={kind === k} onChange={() => setKind(k)} />
              {k}
            </label>
          ))}
        </div>
      </fieldset>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!full) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!full && e.dataTransfer.files.length) addFiles(e.dataTransfer.files, kind);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition-all duration-500",
          dragging ? "scale-[1.01] border-vinho-500 bg-rosa-100" : "border-creme-300 bg-creme-50",
          full && "opacity-60",
        )}
      >
        <span className={cn("grid size-16 place-items-center rounded-full transition-colors duration-500", dragging ? "bg-vinho-700 text-marfim" : "bg-rosa-100 text-vinho-700")}>
          <ImagePlus size={28} strokeWidth={1.6} />
        </span>
        <div>
          <p className="font-display text-xl text-vinho-800">{dragging ? "Solte as imagens aqui" : "Adicione fotos de referência"}</p>
          <p className="mt-1 text-sm text-tinta-suave">
            Bolos que você gostou, o tema da festa, convite, paleta de cores… JPG, JPEG, PNG ou WEBP · até {uploadRules.maxSizeMB} MB cada ·
            máximo {uploadRules.maxFiles}.
          </p>
        </div>
        <button type="button" disabled={full} onClick={() => inputRef.current?.click()} className="btn btn-vinho">
          <Upload size={16} /> Escolher imagens
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={uploadRules.acceptAttr}
          className="sr-only"
          tabIndex={-1}
          aria-label="Selecionar imagens de referência"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files, kind);
            e.target.value = "";
          }}
        />
      </div>

      {uploadErrors.length ? (
        <ul role="alert" className="space-y-1 rounded-2xl border border-framboesa/30 bg-framboesa/5 px-4 py-3 text-sm text-framboesa">
          {uploadErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      {refs.length ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-vinho-800" aria-live="polite">
            {refs.length} {refs.length === 1 ? "imagem selecionada" : "imagens selecionadas"}
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AnimatePresence initial={false}>
              {refs.map((r, i) => (
                <motion.li
                  key={r.id}
                  className="overflow-hidden rounded-2xl border border-creme-300 bg-creme-50"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="relative aspect-square bg-creme-200">
                    <img src={r.url} alt={`Referência ${i + 1}: ${r.file.name}`} className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeRef(r.id)}
                      aria-label={`Remover ${r.file.name}`}
                      className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-vinho-950/70 text-marfim backdrop-blur transition hover:bg-framboesa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="space-y-1.5 p-2.5">
                    <select
                      value={r.kind}
                      onChange={(e) => setRefKind(r.id, e.target.value as ReferenceKind)}
                      aria-label={`Tipo da imagem ${i + 1}`}
                      className="w-full rounded-lg border border-creme-300 bg-white px-2 py-1.5 text-xs text-tinta"
                    >
                      {referenceKinds.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                    <p className="truncate text-[0.7rem] text-tinta-suave" title={r.file.name}>
                      {formatBytes(r.file.size)} · {r.file.name}
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      ) : null}

      <div className="flex gap-3 rounded-2xl border border-dourado-400/40 bg-champanhe-100/60 p-4 text-sm leading-relaxed text-tinta">
        <Info size={18} className="mt-0.5 shrink-0 text-dourado-600" />
        <p>
          <strong>Importante:</strong> o WhatsApp não recebe anexos automaticamente pelo site. As imagens servem para você revisar o
          pedido aqui; depois de enviar a mensagem, <strong>anexe essas mesmas fotos na conversa</strong> — vamos lembrar você no final.
        </p>
      </div>

      <Field id="f-detalhes" label="Explique os detalhes desejados" error={errors.detalhes}>
        {(a) => (
          <textarea
            {...a}
            rows={4}
            className="field-input"
            value={data.detalhes}
            onChange={(e) => set("detalhes", e.target.value)}
            placeholder="O que você gostou em cada referência? Topo, flores, personagens, textura, acabamento…"
          />
        )}
      </Field>
    </div>
  );
}
