import { massas, prices, recheios } from "./menu";

/**
 * ─────────────────────────────────────────────────────────────
 *  OPÇÕES DO FORMULÁRIO DE ORÇAMENTO
 *  Sabores e coberturas vêm do cardápio (menu.ts) — ao atualizar
 *  o cardápio, o formulário acompanha automaticamente.
 * ─────────────────────────────────────────────────────────────
 */

export const NAO_DECIDI = "Ainda não decidi";

export const eventTypes = [
  "Aniversário",
  "Casamento",
  "15 anos",
  "Chá revelação",
  "Batizado",
  "Formatura",
  "Evento corporativo",
  "Outro",
];

export const shapes = ["Redondo", "Quadrado", "Retangular", "Personalizado"];

export const styles = ["Delicado", "Infantil", "Luxuoso", "Minimalista", "Temático", "Personalizado"];

export const tiers = ["1 andar", "2 andares", "3 andares", "4 andares", "5 andares", "6 andares", "Ainda não sei"];

/** Coberturas = os três primeiros itens da tabela "Valor do kg". */
export const coberturas = [...prices.items.slice(0, 3).map((p) => p.name), NAO_DECIDI];

export const massaOptions = [
  ...massas.dosSonhos.items.map((m) => ({ value: m, label: m, group: "Dos sonhos" })),
  ...massas.especiais.items.map((m) => ({ value: `${m} (especial)`, label: `${m} · +10%`, group: "Especiais" })),
  { value: NAO_DECIDI, label: NAO_DECIDI, group: "" },
];

export const recheioOptions = [
  ...recheios.comuns.items.map((r) => ({ value: r, special: false })),
  ...recheios.especiais.items.map((r) => ({ value: `${r} (especial)`, special: true })),
];

export const budgetRanges = [
  "Até R$ 150",
  "R$ 150 a R$ 300",
  "R$ 300 a R$ 500",
  "R$ 500 a R$ 1.000",
  "Acima de R$ 1.000",
  "Prefiro não informar",
];

export const deliveryModes = [
  { value: "Retirada", hint: "Retiro no ateliê" },
  { value: "Entrega", hint: "A entrega é cobrada à parte" },
];

export const assemblyOptions = ["Sim", "Não", "Ainda não sei"];

export const referenceKinds = ["Referência de bolo", "Tema da festa", "Outra foto"] as const;
export type ReferenceKind = (typeof referenceKinds)[number];

export const uploadRules = {
  accept: ["image/jpeg", "image/png", "image/webp"],
  acceptAttr: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
  maxFiles: 10,
  maxSizeMB: 10,
};
