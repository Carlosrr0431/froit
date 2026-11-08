import * as wa from "@/lib/tareas/whatsapp";
import { sendReminder, buildSummary } from "@/lib/tareas/reminders";
import { readAll } from "@/lib/tareas/store";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  const status = await wa.status();
  const qr = status.status === "need_scan" ? await wa.qr().catch(() => null) : null;
  return Response.json({ ...status, qr_image: qr, agent: wa.agentCode() });
}

export async function POST(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  const { action } = await req.json();
  try {
    if (action === "connect" || action === "refresh-qr") return Response.json(await wa.connect({ refresh: action === "refresh-qr" }));
    if (action === "reset") return Response.json(await wa.reset());
    if (action === "reminder") return Response.json(await sendReminder("manual"));
    if (action === "preview") return Response.json({ ok: true, text: buildSummary(await readAll()) ?? "✅ No tenés tareas pendientes. ¡Todo al día!" });
  } catch (e) {
    return Response.json({ ok: false, message: `No se pudo contactar whatsmeow-api: ${e.message}` });
  }
  return Response.json({ ok: false, message: "Acción inválida" }, { status: 400 });
}
