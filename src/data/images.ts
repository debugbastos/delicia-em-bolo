/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGENS CENTRALIZADAS
 *  Todas as imagens ficam em /public/images. Para trocar uma foto,
 *  substitua o arquivo mantendo o nome — ou altere o caminho aqui.
 * ─────────────────────────────────────────────────────────────
 */

const base = import.meta.env.BASE_URL ?? "/";

/** Monta o caminho público de uma imagem (respeita o "base" do Vite). */
export const asset = (path: string) => `${base}images/${path}`;

export const images = {
  hero: {
    src: asset("hero/hero-bolo-andares.webp"),
    srcMobile: asset("hero/hero-bolo-andares-760.webp"),
    width: 1200,
    height: 1600,
    alt: "Bolo branco de quatro andares com flores de açúcar, iluminado por lâmpadas pendentes",
  },
  logo: {
    /** Monograma marfim com transparência (para fundos escuros e fotos). */
    ivory: asset("marca/logo-monograma-marfim.webp"),
    ivoryPng: asset("marca/logo-monograma-marfim.png"),
    width: 487,
    height: 560,
  },
  award: {
    /**
     * Imagem oficial do Prêmio Excelências do Ano 2025.
     * Arquivo original enviado pela cliente, sem cortes nem edições
     * (/public/images/premiacao/premio-excelencias-2025.png).
     * Para trocar por uma versão em maior resolução, substitua o arquivo e
     * atualize width/height. Se for null, a seção exibe a moldura de "arquivo pendente".
     */
    src: asset("premiacao/premio-excelencias-2025.png") as string | null,
    width: 630,
    height: 769,
    alt: "Prêmio Excelências do Ano 2025 concedido à Delícias em Bolo",
  },
};
