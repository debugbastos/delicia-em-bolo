/**
 * ─────────────────────────────────────────────────────────────
 *  CARDÁPIO — transcrição fiel do material oficial do ateliê
 *  (ZIP "cardápio e forma de pagamento", 8 imagens, conferido
 *  item a item). Nenhum preço, sabor ou produto foi inventado.
 *  As imagens do cardápio NÃO são usadas no site.
 * ─────────────────────────────────────────────────────────────
 */

export type PriceItem = {
  name: string;
  /** Valor em reais. */
  price: number;
  /** "kg" ou "unidade" — exatamente como no material original. */
  unit: "kg" | "unidade";
  /** Selo exibido junto ao item (ex.: "Edição especial"). */
  tag?: string;
};

export const prices: { title: string; items: PriceItem[] } = {
  title: "Valor do kg",
  items: [
    { name: "Chantininho", price: 90, unit: "kg" },
    { name: "Ganache", price: 120, unit: "kg" },
    { name: "Pasta americana", price: 140, unit: "kg" },
    { name: "Bolo de noiva", price: 130, unit: "kg", tag: "Edição especial" },
    { name: "Bolo de rolo", price: 60, unit: "kg" },
    { name: "Bem-casados", price: 6, unit: "unidade" },
  ],
};

export const massas = {
  dosSonhos: {
    title: "Dos sonhos",
    items: ["Branca", "Chocolate 50%", "Dupla", "Coco", "Red velvet", "Mesclada"],
  },
  especiais: {
    title: "Especiais",
    note: "10% de acréscimo",
    items: ["Ameixa", "Nozes"],
  },
};

export const recheios = {
  comuns: {
    title: "Comuns",
    items: [
      "Ninho",
      "Chocolate 50%",
      "Cocada cremosa",
      "Brigadeiro branco",
      "Limão",
      "Castanha",
      "Paçoca",
      "Crocante salgado",
      "Crocante pé de moleque (amendoim)",
      "Geleia de maracujá e brigadeiro branco",
      "Doce de leite",
    ],
  },
  especiais: {
    title: "Especiais",
    items: ["Abacaxi e brigadeiro branco", "Geleia de morango com brigadeiro branco", "Nozes", "Nutella", "Ameixa"],
  },
  note: "Você pode escolher até 2 recheios por bolo.",
  maxPerCake: 2,
};

/** Bolos de um andar — diâmetro e rendimento aproximado. */
export const tamanhos = {
  items: [
    { cm: 12, fatias: "8 a 10" },
    { cm: 14, fatias: "12 a 14" },
    { cm: 16, fatias: "16 a 20" },
    { cm: 18, fatias: "20 a 24" },
    { cm: 20, fatias: "25 a 30" },
    { cm: 22, fatias: "35 a 40" },
    { cm: 24, fatias: "40 a 48" },
    { cm: 26, fatias: "50 a 60" },
    { cm: 28, fatias: "60 a 70" },
    { cm: 30, fatias: "70 a 80" },
    { cm: 32, fatias: "80 a 100" },
    { cm: 35, fatias: "100 a 110" },
    { cm: 38, fatias: "110 a 130" },
    { cm: 40, fatias: "130 a 150" },
  ],
  note: "O número de fatias pode variar de acordo com a espessura que for cortada.",
};

/** Tamanhos com andares — diâmetros de cada andar, do topo para a base. */
export const andares: number[][] = [
  [14, 20, 26, 32, 38],
  [12, 18, 22, 28, 34],
  [14, 18, 22, 26, 30, 34],
  [12, 16, 20, 24, 28, 32],
];

export const pagamento = {
  formas: [
    { label: "Pix" },
    { label: "Transferência" },
    { label: "Cartão", note: "acrescenta a taxa" },
  ],
  /** Coloque false para ocultar os dados bancários do site. */
  mostrarDadosBancarios: true,
  dados: [
    {
      tipo: "Transferência",
      linhas: ["AG: 3052 · C/P: 1009896-3", "Maria Daniella Rodrigues Silva", "Poupança Bradesco"],
      copiar: undefined as string | undefined,
    },
    {
      tipo: "Pix",
      linhas: ["(75) 99199-0879", "Maria Daniella Rodrigues Silva", "Banco Bradesco"],
      copiar: "75991990879",
    },
  ],
};

/** "Informações importantes" — texto do cardápio, com ajustes mínimos de grafia. */
export const informacoes: string[] = [
  "Pedidos com antecedência de no máximo 5 dias (dependendo da disponibilidade da agenda).",
  "Orçamentos de segunda a quinta. Os enviados de sexta a domingo serão respondidos na segunda.",
  "Cobramos a entrega.",
  "Para finalizar o agendamento é necessário o adiantamento de 50%.",
  "Detalhes acrescentados no bolo são cobrados à parte, como flores, topper, modelagem, pinturas, glitter ou estruturas.",
  "Você pode escolher até 2 recheios por bolo.",
  "O número de fatias pode variar de acordo com a espessura que for cortada.",
  "Não nos responsabilizamos por acidentes depois da entrega do bolo.",
  "Em caso de desistência da encomenda 15 dias antes da entrega, não haverá devolução do valor de 50% pago.",
];

/** Retorna o tamanho sugerido (referência do cardápio) para uma quantidade de pessoas. */
export function suggestSize(people: number) {
  if (!Number.isFinite(people) || people <= 0) return null;
  const parsed = tamanhos.items.map((t) => {
    const [min, max] = t.fatias.split(" a ").map(Number);
    return { ...t, min, max };
  });
  return parsed.find((t) => people <= t.max) ?? null;
}
