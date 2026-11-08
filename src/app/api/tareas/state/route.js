import { read } from "@/lib/tareas/store";
import { today } from "@/lib/tareas/dates";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  const { projects, tasks, settings } = read();
  const { sent, ...publicSettings } = settings;
  return Response.json({ projects, tasks, settings: publicSettings, today: today() });
}
