// Lógica de tareas recurrentes (cada N días). Sirve en cliente y servidor.
const ms = (d) => Date.parse(`${d}T00:00:00Z`);
export const addDays = (d, n) => new Date(ms(d) + n * 86400000).toISOString().slice(0, 10);

/** Próxima fecha en que toca una tarea recurrente: hecha + N días, o su inicio si nunca se hizo. */
export const nextDue = (t, today) => (t.doneOn ? addDays(t.doneOn, t.every || 1) : t.startOn || today);

/** Una recurrente cuenta como "resuelta" si ya se hizo hoy o todavía no le toca. */
export const isDone = (t, day) => (t.daily ? t.doneOn === day || nextDue(t, day) > day : !!t.done);

export const everyLabel = (n) => (n <= 1 ? "Todos los días" : n === 7 ? "Cada semana" : `Cada ${n} días`);
