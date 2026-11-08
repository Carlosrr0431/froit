export const TZ = "America/Argentina/Salta";

export function today() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function nowHM() {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

const ms = (d) => Date.parse(`${d}T00:00:00Z`);

/** Días desde a hasta b (negativo si b es anterior). */
export function daysBetween(a, b) {
  return Math.round((ms(b) - ms(a)) / 86400000);
}

export function formatLong(d) {
  return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(ms(d));
}

export function formatShort(d) {
  return new Intl.DateTimeFormat("es-AR", { timeZone: "UTC", day: "numeric", month: "short" }).format(ms(d));
}
