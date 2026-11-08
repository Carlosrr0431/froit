import { tick } from "@/lib/tareas/reminders";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Lo invoca Vercel Cron (ver vercel.json) con Authorization: Bearer CRON_SECRET. */
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    await tick();
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
