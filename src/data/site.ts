/**
 * ─────────────────────────────────────────────────────────────
 *  INFORMAÇÕES COMERCIAIS CENTRALIZADAS
 *  Altere aqui e o site inteiro é atualizado (navbar, rodapé,
 *  formulário, localização, botões de WhatsApp e Instagram).
 * ─────────────────────────────────────────────────────────────
 */

export const brand = {
  /** Nome comercial exibido no site. */
  name: "Delícias em Bolo",
  nameUpper: "DELÍCIAS EM BOLO",
  /** Selo e assinatura usados no cardápio oficial do ateliê. */
  label: "Ateliê",
  slogan: "Realizando sonhos",
  city: "Paulo Afonso – BA",
  /** Nome da confeiteira como aparece no cardápio ("Bolos da Dany"). */
  confeiteira: "Dany",
} as const;

export const contact = {
  /**
   * WhatsApp oficial. O cardápio da confeitaria traz o número com o 9º dígito:
   * (75) 99199-0879 — é este o formato usado nos links (55 + DDD + número).
   */
  whatsappDisplay: "(75) 99199-0879",
  whatsappE164: "5575991990879",
  whatsappGreeting: "Olá! Vim pelo site da Delícias em Bolo e gostaria de fazer um orçamento.",
  instagramHandle: "@deliciaembolodani",
  instagramUrl: "https://www.instagram.com/deliciaembolodani/",
} as const;

export const address = {
  street: "R. da Alegria, 640",
  district: "Vila Poty",
  city: "Paulo Afonso",
  state: "BA",
  zip: "48601-470",
  country: "Brasil",
  full: "R. da Alegria, 640 - Vila Poty, Paulo Afonso - BA, 48601-470, Brasil",
} as const;

const encodedAddress = encodeURIComponent(address.full);

export const links = {
  whatsapp: (text?: string) =>
    `https://wa.me/${contact.whatsappE164}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
  route: `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`,
  mapEmbed: `https://maps.google.com/maps?q=${encodedAddress}&z=16&hl=pt-BR&output=embed`,
} as const;

export type NavItem = { id: string; label: string };

export const nav: NavItem[] = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "mostruario", label: "Mostruário" },
  { id: "cardapio", label: "Cardápio" },
  { id: "localizacao", label: "Localização" },
  { id: "contato", label: "Contato" },
];

/** Seções que não aparecem no menu, mas acendem um item dele quando visíveis. */
export const navAliases: Record<string, string> = {
  premiacao: "sobre",
};

/** Textos institucionais — curtos, verdadeiros e fáceis de editar. */
export const about = {
  eyebrow: "Sobre o ateliê",
  title: "Bolos feitos à mão, pensados para o seu momento.",
  paragraphs: [
    "A Delícias em Bolo é um ateliê de confeitaria em Paulo Afonso – BA dedicado a bolos personalizados para aniversários, casamentos, chás e celebrações. Cada encomenda começa pelo seu tema, pelas suas cores e pela história que você quer contar.",
    "Por trás de cada criação estão as mãos da confeiteira Dany — do primeiro rascunho do pedido ao último detalhe da decoração.",
  ],
  pillars: [
    { n: "01", title: "Personalização", text: "Tema, cores, nome e mensagem definidos junto com você." },
    { n: "02", title: "Por quilo", text: "Valores por KG conforme a cobertura escolhida." },
    { n: "03", title: "Tamanhos", text: "De bolos de 12 cm a estruturas de até 6 andares." },
  ],
} as const;

/** Seção especial — Prêmio Excelências do Ano 2025. */
export const award = {
  eyebrow: "Prêmio Excelências do Ano",
  year: "2025",
  place: "Paulo Afonso · BA",
  heading: "UM RECONHECIMENTO QUE NOS ENCHE DE ORGULHO",
  title: "Prêmio Excelências do Ano 2025",
  quote: "Uma conquista que representa o reconhecimento e a valorização do nosso trabalho.",
} as const;

/** Aviso comercial obrigatório exibido no cardápio e na revisão do pedido. */
export const quoteNotice =
  "Trabalhamos com bolos personalizados por quilo (KG). O valor final é definido exclusivamente pelo WhatsApp, após uma análise personalizada do pedido, considerando peso, recheios, decoração e nível de personalização.";
