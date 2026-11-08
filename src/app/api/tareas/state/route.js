import { readAll } from "@/lib/tareas/store";
import { today } from "@/lib/tareas/dates";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  try {
    const { projects, tasks, settings } = await readAll();
    const { sent, ...publicSettings } = settings;
    return Response.json({ projects, tasks, settings: publicSettings, today: today() });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
