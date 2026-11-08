import { tick } from "./lib/tareas/reminders";

// Programador de avisos por WhatsApp del módulo /crm/tareas (revisa cada minuto).
if (!globalThis.__tareasScheduler) {
  globalThis.__tareasScheduler = true;
  const run = () => tick().catch((e) => console.error("[recordatorios]", e.message));
  setInterval(run, 60_000);
  setTimeout(run, 10_000);
  console.log("[recordatorios] programador activo");
}
