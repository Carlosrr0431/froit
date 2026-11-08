import { readAll, saveSettings } from "./store";
import { today, nowHM, daysBetween, formatLong, formatShort } from "./dates";
import { sendText } from "./whatsapp";

export const isDone = (t, day) => (t.daily ? t.doneOn === day : !!t.done);

export function buildSummary(data, day = today()) {
  const blocks = [];
  let total = 0;

  for (const p of data.projects) {
    const pending = data.tasks.filter((t) => t.projectId === p.id && !isDone(t, day));
    const all = data.tasks.filter((t) => t.projectId === p.id && !t.daily);
    if (!pending.length && !p.deadline) continue;

    const overdue = pending.filter((t) => !t.daily && t.due && t.due < day);
    const dueToday = pending.filter((t) => !t.daily && t.due === day);
    const daily = pending.filter((t) => t.daily);
    const rest = pending.filter((t) => !t.daily && !overdue.includes(t) && !dueToday.includes(t));

    const pct = all.length ? Math.round((all.filter((t) => t.done).length / all.length) * 100) : null;
    let head = `*${p.name}*`;
    const meta = [];
    if (p.deadline) {
      const d = daysBetween(day, p.deadline);
      meta.push(d < 0 ? `?? vencido hace ${-d} d` : d === 0 ? "?? vence HOY" : `? entrega en ${d} d (${formatShort(p.deadline)})`);
    }
    if (pct !== null) meta.push(`${pct}%`);
    if (meta.length) head += `  ${meta.join(" · ")}`;

    const lines = [head];
    const add = (icon, label, list) => {
      if (!list.length) return;
      lines.push(`${icon} _${label}_`);
      list.slice(0, 8).forEach((t) => lines.push(`  • ${t.title}${!t.daily && t.due ? ` (${formatShort(t.due)})` : ""}`));
      if (list.length > 8) lines.push(`  … y ${list.length - 8} más`);
    };
    add("??", "Vencidas", overdue);
    add("??", "Para hoy", dueToday);
    add("??", "Diarias", daily);
    add("??", "Pendientes", rest);
    if (lines.length > 1) {
      blocks.push(lines.join("\n"));
      total += pending.length;
    }
  }

  if (!blocks.length) return null;
  return `?? *Resumen de tareas*\n${formatLong(day)}\n\nTenés *${total}* tarea${total === 1 ? "" : "s"} pendiente${total === 1 ? "" : "s"}.\n\n${blocks.join("\n\n")}`;
}

const trim = (o, n) => Object.fromEntries(Object.entries(o).slice(-n));

/** Env?a el resumen al n?mero configurado y lo anota en el historial. */
export async function sendReminder(reason = "manual") {
  const data = await readAll();
  const text = buildSummary(data) ?? "? No ten?s tareas pendientes. ?Todo al d?a!";
  const r = await sendText(data.settings.phone, text);
  const entry = { at: new Date().toISOString(), reason, ok: r.ok, message: r.ok ? "Enviado" : r.message || "Error" };
  await saveSettings({ log: [entry, ...data.settings.log].slice(0, 20) });
  return r;
}

/** Dispara los horarios configurados una vez por d?a (lo llama el cron / el programador local). */
export async function tick() {
  const { settings } = await readAll();
  const { reminders, times = [] } = settings;
  if (!reminders) return;
  const day = today();
  const [nh, nm] = nowHM().split(":").map(Number);

  for (const t of times) {
    const key = `${day} ${t}`;
    const [h, m] = t.split(":").map(Number);
    const late = nh * 60 + nm - (h * 60 + m);
    const sent = (await readAll()).settings.sent;
    if (late < 0 || late > 180 || sent[key]) continue;
    // Tras un error, esperar 15 min antes de reintentar (cuida la l?nea).
    if (Date.now() - (sent[`${key} fail`] || 0) < 15 * 60_000) continue;

    // Se reserva el horario antes de enviar para que dos ejecuciones no manden doble.
    await saveSettings({ sent: trim({ ...sent, [key]: true }, 40) });
    const r = await sendReminder(`auto ${t}`);
    if (!r.ok) {
      const { [key]: _, ...rest } = (await readAll()).settings.sent;
      await saveSettings({ sent: trim({ ...rest, [`${key} fail`]: Date.now() }, 40) });
    }
  }
}
