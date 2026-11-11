import { NAO_DECIDI, type ReferenceKind } from "@/data/form-options";
import { recheios } from "@/data/menu";
import { onlyDigits, todayISO } from "@/lib/format";

/* ───────────────────────── Tipos ───────────────────────── */

export type QuoteData = {
  // 1 · Cliente
  nome: string;
  whatsapp: string;
  email: string;
  // 2 · Evento
  tipoEvento: string;
  tipoEventoOutro: string;
  data: string;
  horario: string;
  cidade: string;
  bairro: string;
  enderecoEvento: string;
  pessoas: string;
  // 3 · Bolo
  tema: string;
  nomeIdade: string;
  peso: string;
  andares: string;
  formato: string;
  estilo: string;
  cores: string;
  frase: string;
  // 4 · Sabores
  massa: string;
  recheios: string[];
  cobertura: string;
  complementos: string;
  restricoes: string;
  preferencias: string;
  // 5 · Referências
  detalhes: string;
  // 6 · Comercial
  orcamento: string;
  entregaModo: string;
  montagem: string;
  mesmoEndereco: boolean;
  enderecoEntrega: string;
  observacoes: string;
};

export type RefImage = {
  id: string;
  file: File;
  url: string;
  kind: ReferenceKind;
};

export type Errors = Partial<Record<keyof QuoteData, string>>;

export const initialData: QuoteData = {
  nome: "",
  whatsapp: "",
  email: "",
  tipoEvento: "",
  tipoEventoOutro: "",
  data: "",
  horario: "",
  cidade: "Paulo Afonso",
  bairro: "",
  enderecoEvento: "",
  pessoas: "",
  tema: "",
  nomeIdade: "",
  peso: "",
  andares: "",
  formato: "",
  estilo: "",
  cores: "",
  frase: "",
  massa: "",
  recheios: [],
  cobertura: "",
  complementos: "",
  restricoes: "",
  preferencias: "",
  detalhes: "",
  orcamento: "",
  entregaModo: "",
  montagem: "",
  mesmoEndereco: true,
  enderecoEntrega: "",
  observacoes: "",
};

/* ───────────────────────── Etapas ───────────────────────── */

export const steps = [
  { key: "cliente", title: "Seus dados", short: "Cliente", description: "Para a confeiteira retornar o seu orçamento." },
  { key: "evento", title: "O evento", short: "Evento", description: "Quando, onde e para quantas pessoas." },
  { key: "bolo", title: "O bolo", short: "Bolo", description: "Tema, tamanho, formato e estilo." },
  { key: "sabores", title: "Sabores", short: "Sabores", description: "Massa, recheios e cobertura do cardápio." },
  { key: "referencias", title: "Referências", short: "Referências", description: "Fotos e detalhes que inspiram o seu bolo." },
  { key: "comercial", title: "Entrega e orçamento", short: "Entrega", description: "Retirada ou entrega, montagem e observações." },
  { key: "revisao", title: "Revisão e envio", short: "Revisão", description: "Confira tudo antes de enviar pelo WhatsApp." },
] as const;

export type StepKey = (typeof steps)[number]["key"];

/** Campos de cada etapa — usados para focar o primeiro erro. */
export const stepFields: Record<StepKey, (keyof QuoteData)[]> = {
  cliente: ["nome", "whatsapp", "email"],
  evento: ["tipoEvento", "tipoEventoOutro", "data", "horario", "cidade", "bairro", "enderecoEvento", "pessoas"],
  bolo: ["tema", "nomeIdade", "peso", "andares", "formato", "estilo", "cores", "frase"],
  sabores: ["massa", "recheios", "cobertura", "complementos", "restricoes", "preferencias"],
  referencias: ["detalhes"],
  comercial: ["orcamento", "entregaModo", "montagem", "enderecoEntrega", "observacoes"],
  revisao: [],
};

/* ───────────────────────── Validação ───────────────────────── */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(step: StepKey, d: QuoteData): Errors {
  const e: Errors = {};
  switch (step) {
    case "cliente": {
      if (d.nome.trim().length < 3) e.nome = "Informe seu nome completo.";
      const phone = onlyDigits(d.whatsapp);
      if (phone.length < 10 || phone.length > 11) e.whatsapp = "Informe um WhatsApp válido com DDD.";
      if (d.email.trim() && !emailRe.test(d.email.trim())) e.email = "Confira o e-mail informado.";
      break;
    }
    case "evento": {
      if (!d.tipoEvento) e.tipoEvento = "Escolha o tipo de evento.";
      if (d.tipoEvento === "Outro" && !d.tipoEventoOutro.trim()) e.tipoEventoOutro = "Conte qual é o evento.";
      if (!d.data) e.data = "Informe a data do evento.";
      else if (d.data < todayISO()) e.data = "A data precisa ser hoje ou uma data futura.";
      if (!d.cidade.trim()) e.cidade = "Informe a cidade.";
      if (!d.bairro.trim()) e.bairro = "Informe o bairro.";
      const n = Number(d.pessoas);
      if (!d.pessoas || !Number.isFinite(n) || n < 1) e.pessoas = "Informe a quantidade aproximada de pessoas.";
      else if (n > 5000) e.pessoas = "Confira a quantidade de pessoas.";
      break;
    }
    case "bolo": {
      if (!d.tema.trim()) e.tema = "Conte o tema do bolo (ou escreva “sem tema”).";
      if (d.peso) {
        const kg = Number(d.peso.replace(",", "."));
        if (!Number.isFinite(kg) || kg <= 0 || kg > 100) e.peso = "Informe o peso em KG (ex.: 2,5).";
      }
      if (!d.formato) e.formato = "Escolha um formato.";
      if (!d.estilo) e.estilo = "Escolha um estilo.";
      break;
    }
    case "sabores": {
      if (!d.massa) e.massa = "Escolha a massa ou marque “Ainda não decidi”.";
      if (d.recheios.length === 0) e.recheios = "Escolha até 2 recheios ou marque “Ainda não decidi”.";
      else if (d.recheios.filter((r) => r !== NAO_DECIDI).length > recheios.maxPerCake)
        e.recheios = `Você pode escolher até ${recheios.maxPerCake} recheios por bolo.`;
      if (!d.cobertura) e.cobertura = "Escolha a cobertura ou marque “Ainda não decidi”.";
      break;
    }
    case "comercial": {
      if (!d.entregaModo) e.entregaModo = "Escolha retirada ou entrega.";
      if (!d.montagem) e.montagem = "Informe se precisa de montagem no local.";
      if (d.entregaModo === "Entrega") {
        const usesEvent = d.mesmoEndereco && d.enderecoEvento.trim();
        if (!usesEvent && !d.enderecoEntrega.trim()) e.enderecoEntrega = "Informe o endereço de entrega.";
      }
      break;
    }
    default:
      break;
  }
  return e;
}

export function validateAll(d: QuoteData) {
  for (let i = 0; i < steps.length; i++) {
    const errors = validateStep(steps[i].key, d);
    if (Object.keys(errors).length) return { index: i, errors };
  }
  return null;
}

/** Endereço de entrega efetivo (reaproveita o do evento quando marcado). */
export function deliveryAddress(d: QuoteData) {
  if (d.entregaModo !== "Entrega") return "";
  if (d.mesmoEndereco && d.enderecoEvento.trim()) return d.enderecoEvento.trim();
  return d.enderecoEntrega.trim();
}

export function eventLabel(d: QuoteData) {
  return d.tipoEvento === "Outro" && d.tipoEventoOutro.trim() ? `Outro — ${d.tipoEventoOutro.trim()}` : d.tipoEvento;
}
