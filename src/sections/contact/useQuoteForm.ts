import { useCallback, useEffect, useRef, useState } from "react";
import { NAO_DECIDI, uploadRules, type ReferenceKind } from "@/data/form-options";
import { recheios } from "@/data/menu";
import { initialData, steps, validateAll, validateStep, type Errors, type QuoteData, type RefImage } from "./quote-model";

const DRAFT_KEY = "delicias-em-bolo:orcamento:v1";

function loadDraft(): QuoteData | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuoteData>;
    const merged = { ...initialData, ...parsed };
    if (!Array.isArray(merged.recheios)) merged.recheios = [];
    return merged;
  } catch {
    return null;
  }
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Estado do formulário de orçamento: dados, etapas, validação, rascunho e imagens. */
export function useQuoteForm() {
  const [data, setData] = useState<QuoteData>(() => loadDraft() ?? initialData);
  const [restored] = useState(() => {
    const d = loadDraft();
    return Boolean(d && JSON.stringify(d) !== JSON.stringify(initialData));
  });
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [refs, setRefs] = useState<RefImage[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const refsRef = useRef(refs);
  refsRef.current = refs;

  // Rascunho salvo neste dispositivo (as imagens não são salvas).
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {
        /* armazenamento indisponível */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  // Libera as pré-visualizações ao desmontar.
  useEffect(() => () => refsRef.current.forEach((r) => URL.revokeObjectURL(r.url)), []);

  const set = useCallback(<K extends keyof QuoteData>(key: K, value: QuoteData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const toggleRecheio = useCallback(
    (value: string) => {
      setData((d) => {
        let list = d.recheios;
        if (value === NAO_DECIDI) list = list.includes(NAO_DECIDI) ? [] : [NAO_DECIDI];
        else if (list.includes(value)) list = list.filter((v) => v !== value);
        else {
          list = list.filter((v) => v !== NAO_DECIDI);
          if (list.length < recheios.maxPerCake) list = [...list, value];
        }
        return { ...d, recheios: list };
      });
      setErrors((e) => {
        if (!e.recheios) return e;
        const next = { ...e };
        delete next.recheios;
        return next;
      });
    },
    [],
  );

  const goTo = useCallback(
    (index: number) => {
      if (index <= furthest) {
        setErrors({});
        setStep(index);
      }
    },
    [furthest],
  );

  /** Valida a etapa atual e avança. Retorna os erros (vazio se avançou). */
  const next = useCallback(() => {
    const e = validateStep(steps[step].key, data);
    setErrors(e);
    if (Object.keys(e).length) return e;
    const target = Math.min(step + 1, steps.length - 1);
    setStep(target);
    setFurthest((f) => Math.max(f, target));
    return e;
  }, [data, step]);

  const back = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }, []);

  /** Valida tudo antes do envio; se algo faltar, volta para a etapa com erro. */
  const validateForSubmit = useCallback(() => {
    const result = validateAll(data);
    if (result) {
      setStep(result.index);
      setErrors(result.errors);
      return result;
    }
    return null;
  }, [data]);

  const addFiles = useCallback((files: FileList | File[], kind: ReferenceKind) => {
    const problems: string[] = [];
    const accepted: RefImage[] = [];
    const current = refsRef.current.length;
    for (const file of Array.from(files)) {
      if (current + accepted.length >= uploadRules.maxFiles) {
        problems.push(`Você pode enviar até ${uploadRules.maxFiles} imagens.`);
        break;
      }
      const typeOk = uploadRules.accept.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
      if (!typeOk) {
        problems.push(`“${file.name}” não é uma imagem JPG, JPEG, PNG ou WEBP.`);
        continue;
      }
      if (file.size > uploadRules.maxSizeMB * 1024 * 1024) {
        problems.push(`“${file.name}” tem mais de ${uploadRules.maxSizeMB} MB.`);
        continue;
      }
      accepted.push({ id: uid(), file, url: URL.createObjectURL(file), kind });
    }
    if (accepted.length) setRefs((r) => [...r, ...accepted]);
    setUploadErrors(problems);
  }, []);

  const removeRef = useCallback((id: string) => {
    setRefs((r) => {
      const found = r.find((x) => x.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return r.filter((x) => x.id !== id);
    });
  }, []);

  const setRefKind = useCallback((id: string, kind: ReferenceKind) => {
    setRefs((r) => r.map((x) => (x.id === id ? { ...x, kind } : x)));
  }, []);

  const reset = useCallback(() => {
    refsRef.current.forEach((r) => URL.revokeObjectURL(r.url));
    setRefs([]);
    setData(initialData);
    setErrors({});
    setStep(0);
    setFurthest(0);
    setUploadErrors([]);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignora */
    }
  }, []);

  return {
    data,
    set,
    toggleRecheio,
    errors,
    step,
    furthest,
    goTo,
    next,
    back,
    validateForSubmit,
    refs,
    addFiles,
    removeRef,
    setRefKind,
    uploadErrors,
    reset,
    restored,
  };
}

export type QuoteForm = ReturnType<typeof useQuoteForm>;
