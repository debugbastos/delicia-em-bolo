import { motion } from "framer-motion";
import { ImagePlus, Pencil, RotateCcw, Share2 } from "lucide-react";
import { useMemo } from "react";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { EASE } from "@/lib/motion";
import type { RefImage } from "./quote-model";

/**
 * Tela exibida depois que o WhatsApp é aberto. Não afirma que o pedido foi
 * "enviado": quem envia é o cliente, dentro da conversa. Também orienta o
 * envio manual das imagens de referência.
 */
export function SuccessPanel({
  url,
  refs,
  onEdit,
  onReset,
}: {
  url: string;
  refs: RefImage[];
  onEdit: () => void;
  onReset: () => void;
}) {
  const files = useMemo(() => refs.map((r) => r.file), [refs]);
  const canShareFiles =
    typeof navigator !== "undefined" && files.length > 0 && typeof navigator.canShare === "function" && navigator.canShare({ files });

  const shareFiles = async () => {
    try {
      await navigator.share({ files, title: "Referências do meu bolo" });
    } catch {
      /* compartilhamento cancelado */
    }
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      role="status"
    >
      <motion.span
        className="mx-auto grid size-20 place-items-center rounded-full bg-vinho-700 text-marfim shadow-[var(--shadow-bolo)]"
        initial={{ scale: 0.6, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <WhatsAppIcon size={36} />
      </motion.span>
      <h3 className="mt-7 font-display text-[clamp(1.7rem,3vw,2.3rem)] font-light text-vinho-800">Seu pedido está pronto no WhatsApp</h3>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-tinta-suave">
        Abrimos a conversa com a confeiteira já com todas as informações organizadas. <strong className="text-tinta">Para concluir, toque em
        enviar na conversa.</strong> Se a janela não abriu, use o botão abaixo.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-vinho">
          <WhatsAppIcon size={18} /> Abrir o WhatsApp novamente
        </a>
        <button type="button" onClick={onEdit} className="btn btn-contorno text-vinho-700">
          <Pencil size={15} /> Revisar pedido
        </button>
      </div>

      {refs.length ? (
        <div className="mx-auto mt-10 max-w-xl rounded-[1.5rem] border border-dourado-400/40 bg-champanhe-100/60 p-6 text-left">
          <p className="flex items-center gap-2 font-display text-lg text-vinho-800">
            <ImagePlus size={20} className="text-dourado-600" /> Não esqueça das suas {refs.length} {refs.length === 1 ? "imagem" : "imagens"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-tinta">
            Depois de enviar a mensagem, anexe estas fotos na mesma conversa (ícone de clipe ou câmera do WhatsApp).
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {refs.map((r, i) => (
              <li key={r.id}>
                <img src={r.url} alt={`Referência ${i + 1}`} className="size-16 rounded-xl border border-creme-300 object-cover" />
              </li>
            ))}
          </ul>
          {canShareFiles ? (
            <button type="button" onClick={shareFiles} className="btn btn-ouro mt-5">
              <Share2 size={16} /> Compartilhar imagens
            </button>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-tinta-suave transition hover:text-vinho-700"
      >
        <RotateCcw size={15} /> Começar um novo pedido
      </button>
    </motion.div>
  );
}
