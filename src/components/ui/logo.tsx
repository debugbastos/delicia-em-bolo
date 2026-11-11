import { LOGO_PATH, LOGO_VIEWBOX } from "@/assets/logo-path";
import { images } from "@/data/images";
import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

/** Monograma vetorial (herda a cor do texto via currentColor). */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn("block", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
      fillRule="evenodd"
    >
      <path d={LOGO_PATH} />
    </svg>
  );
}

/** Logomarca original em marfim, com o relevo do arquivo enviado (para o Hero). */
export function LogoImage({ className, eager = false }: { className?: string; eager?: boolean }) {
  return (
    <picture>
      <source srcSet={images.logo.ivory} type="image/webp" />
      <img
        src={images.logo.ivoryPng}
        width={images.logo.width}
        height={images.logo.height}
        alt={`Logomarca ${brand.name}`}
        className={cn("block h-auto select-none", className)}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
