import { asset } from "./images";

/**
 * ─────────────────────────────────────────────────────────────
 *  MOSTRUÁRIO — fotografias reais do ateliê
 *  • "src"  → versão otimizada para a grade (900 px de largura)
 *  • "full" → versão ampliada para o lightbox (até 1600 px)
 *  • "alt"  → descrição para leitores de tela (NUNCA é exibida
 *             sobre a foto — a galeria não usa títulos).
 *  Para adicionar uma foto: exporte em WebP para /public/images/galeria
 *  e inclua um novo item abaixo com largura e altura reais.
 * ─────────────────────────────────────────────────────────────
 */

export type GalleryPhoto = {
  id: string;
  src: string;
  full: string;
  width: number;
  height: number;
  alt: string;
};

const photo = (id: string, width: number, height: number, alt: string): GalleryPhoto => ({
  id,
  src: asset(`galeria/${id}-900.webp`),
  full: asset(`galeria/${id}.webp`),
  width,
  height,
  alt,
});

export const gallery: GalleryPhoto[] = [
  photo("bolo-01", 1200, 1600, "Bolo branco de quatro andares com flores de açúcar, sob luzes de lâmpadas pendentes"),
  photo("bolo-02", 960, 1280, "Bolo branco com babado rosa na base e flores brancas de açúcar no topo"),
  photo("bolo-03", 1200, 1600, "Bolo de casamento branco de três andares com iniciais douradas e flores azuis e brancas"),
  photo("bolo-04", 1200, 1600, "Bolo branco decorado com flores coloridas e velas finas, em mesa florida"),
  photo("bolo-05", 900, 1600, "Bolo de dois andares com ursinhos e laço bege, tema chá de bebê"),
  photo("bolo-06", 1000, 1500, "Bolo temático em forma de árvore com personagens modelados e bandeirinhas com nome"),
  photo("bolo-07", 1068, 1600, "Bolo alto com tema fundo do mar, polvo e esferas transparentes"),
  photo("bolo-08", 1242, 1222, "Bolo temático de safári com carro laranja e animais modelados"),
  photo("bolo-09", 1000, 1500, "Bolo temático de casinha com personagens modelados e número 10"),
  photo("bolo-10", 1600, 1068, "Bolo com tema fundo do mar em mesa decorada com flores"),
  photo("bolo-11", 1068, 1600, "Bolo com tema de sereia e polvo azul, número 1"),
  photo("bolo-12", 900, 1600, "Bolo temático em formato de cubo amarelo"),
];

/** Fotos exibidas no carrossel circular da seção "Sobre". */
export const aboutCarousel = ["bolo-03", "bolo-02", "bolo-04", "bolo-05", "bolo-06", "bolo-07"]
  .map((id) => gallery.find((p) => p.id === id))
  .filter((p): p is GalleryPhoto => Boolean(p));
