import { brand, links } from "@/data/site";
import { formatDateBR } from "@/lib/format";
import {
  deliveryAddress,
  eventLabel,
  type QuoteData,
  type RefImage,
} from "@/sections/contact/quote-model";

type Line = [label: string, value: string | undefined | null];

const block = (title: string, lines: Line[]) => {
  const filled = lines.filter(([, v]) => v && String(v).trim());
  if (!filled.length) return "";
  return [`*${title}*`, ...filled.map(([k, v]) => `• ${k}: ${String(v).trim()}`)].join("\n");
};

/**
 * Gera a mensagem estruturada, organizada por categorias, que abre no
 * WhatsApp da confeitaria. Usa a formatação nativa do WhatsApp (*negrito*).
 */
export function buildQuoteMessage(d: QuoteData, refs: RefImage[]) {
  const kg = d.peso ? `${d.peso.replace(".", ",")} kg` : "";
  const refsCount = refs.length;
  const refsSummary = refsCount
    ? `${refsCount} ${refsCount === 1 ? "imagem selecionada" : "imagens selecionadas"} — vou enviar aqui na conversa (${summarizeKinds(refs)})`
    : "Nenhuma imagem selecionada";

  const parts = [
    `*SOLICITAÇÃO DE ORÇAMENTO · ${brand.nameUpper}*`,
    "",
    block("1. DADOS DO CLIENTE", [
      ["Nome", d.nome],
      ["WhatsApp", d.whatsapp],
      ["E-mail", d.email],
    ]),
    block("2. EVENTO", [
      ["Tipo", eventLabel(d)],
      ["Data", d.data ? formatDateBR(d.data) : ""],
      ["Horário", d.horario],
      ["Cidade", d.cidade],
      ["Bairro", d.bairro],
      ["Endereço do evento", d.enderecoEvento],
      ["Quantidade de pessoas", d.pessoas],
    ]),
    block("3. CARACTERÍSTICAS DO BOLO", [
      ["Tema", d.tema],
      ["Nome/idade no bolo", d.nomeIdade],
      ["Peso desejado", kg],
      ["Andares", d.andares],
      ["Formato", d.formato],
      ["Estilo", d.estilo],
      ["Cores predominantes", d.cores],
      ["Frase/mensagem no bolo", d.frase],
    ]),
    block("4. SABORES E COMPOSIÇÃO", [
      ["Massa", d.massa],
      ["Recheio(s)", d.recheios.join(" + ")],
      ["Cobertura", d.cobertura],
      ["Complementos especiais", d.complementos],
      ["Restrições/alergias", d.restricoes],
      ["Preferências", d.preferencias],
    ]),
    block("5. PERSONALIZAÇÃO E REFERÊNCIAS", [
      ["Imagens", refsSummary],
      ["Detalhes desejados", d.detalhes],
    ]),
    block("6. INFORMAÇÕES COMERCIAIS", [
      ["Faixa de orçamento", d.orcamento],
      ["Retirada ou entrega", d.entregaModo],
      ["Endereço de entrega", deliveryAddress(d)],
      ["Montagem no local", d.montagem],
      ["Observações", d.observacoes],
    ]),
    "",
    "_Mensagem gerada pelo formulário do site._",
  ];

  return parts.filter((p, i, arr) => !(p === "" && arr[i - 1] === "")).join("\n\n").replace(/\n{3,}/g, "\n\n");
}

const kindLabel: Record<string, [singular: string, plural: string]> = {
  "Referência de bolo": ["referência de bolo", "referências de bolo"],
  "Tema da festa": ["imagem do tema da festa", "imagens do tema da festa"],
  "Outra foto": ["outra foto", "outras fotos"],
};

function summarizeKinds(refs: RefImage[]) {
  const count = new Map<string, number>();
  refs.forEach((r) => count.set(r.kind, (count.get(r.kind) ?? 0) + 1));
  return [...count.entries()]
    .map(([k, n]) => {
      const [one, many] = kindLabel[k] ?? [k.toLowerCase(), k.toLowerCase()];
      return `${n} ${n === 1 ? one : many}`;
    })
    .join(", ");
}

export const quoteLink = (message: string) => links.whatsapp(message);
