/** Máscara de telefone brasileiro: (75) 99999-9999 */
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** 90 → { int: "90", cents: ",00" } */
export function splitPrice(value: number) {
  const [int, cents] = value.toFixed(2).split(".");
  return { int: Number(int).toLocaleString("pt-BR"), cents: `,${cents}` };
}

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** "2026-12-12" → "12/12/2026 (sábado)" */
export function formatDateBR(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
  return `${m[3]}/${m[2]}/${m[1]} (${weekday})`;
}

/** Data de hoje no formato do input[type=date] (fuso local). */
export function todayISO() {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
