import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Partículas luminosas douradas (canvas leve).
 * • Sprite pré-renderizado (sem shadowBlur por quadro).
 * • Pausa fora da tela e com a aba oculta.
 * • Com movimento reduzido, desenha um único quadro estático.
 */
export function GoldParticles({ className, density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sprite de brilho
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const s = sprite.getContext("2d")!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,244,220,1)");
    g.addColorStop(0.18, "rgba(238,214,160,0.85)");
    g.addColorStop(0.45, "rgba(201,162,102,0.25)");
    g.addColorStop(1, "rgba(201,162,102,0)");
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    type P = { x: number; y: number; r: number; vy: number; vx: number; phase: number; speed: number };
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      visible = false;
    let particles: P[] = [];

    const seed = () => {
      const count = Math.round(Math.min(110, Math.max(28, ((w * h) / 16000) * density)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * Math.random() * 9,
        vy: -(0.04 + Math.random() * 0.18),
        vx: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.012,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase + t * p.speed));
        ctx.globalAlpha = twinkle * (p.r > 6 ? 0.55 : 0.9);
        const size = p.r * 2;
        ctx.drawImage(sprite, p.x - p.r, p.y - p.r, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let last = performance.now();
    let elapsed = 0;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(48, now - last);
      last = now;
      elapsed += dt / 16.67;
      for (const p of particles) {
        p.y += p.vy * (dt / 16.67) * 2;
        p.x += (p.vx + Math.sin(elapsed * 0.01 + p.phase) * 0.05) * (dt / 16.67) * 2;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      draw(elapsed);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, density]);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none block h-full w-full", className)} />;
}
