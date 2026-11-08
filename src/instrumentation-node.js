import { tick } from "./lib/tareas/reminders";

// Programador local de avisos del módulo /crm/tareas (revisa cada minuto).
// En Vercel lo reemplaza el cron de vercel.json (/api/tareas/cron).
if (!process.env.VERCEL && !globalThis.__tareasScheduler) {
  globalThis.__tareasScheduler = true;
  const run = () => tick().catch((e) => console.error("[recordatorios]", e.message));
  setInterval(run, 60_000);
  setTimeout(run, 10_000);
  console.log("[recordatorios] programador local activo");
}
