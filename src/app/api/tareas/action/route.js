import { projects, tasks, saveSettings, must, db } from "@/lib/tareas/store";
import { today } from "@/lib/tareas/dates";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

const clean = (s) => String(s ?? "").trim();

// Sanitiza el HTML de la descripción (solo la edita el usuario autenticado; esto es defensa extra).
const cleanHtml = (h) =>
  String(h ?? "")
    .slice(0, 200000)
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[\s\S]*?(<\/\s*\1\s*>|$)/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:/gi, "$1=$2#")
    .replace(/<img[^>]+src\s*=\s*["']?data:[^>]*>/gi, "");

const actions = {
  async addProject({ name, client, color, deadline }) {
    if (!clean(name)) return;
    must(await projects().insert({ name: clean(name), client: clean(client), color: color || "#5b5bf0", deadline: deadline || null }));
  },
  async updateProject({ id, ...patch }) {
    const upd = {};
    if (clean(patch.name)) upd.name = clean(patch.name);
    if ("client" in patch) upd.client = clean(patch.client);
    if (patch.color) upd.color = patch.color;
    if ("deadline" in patch) upd.deadline = patch.deadline || null;
    if ("description" in patch) upd.description = cleanHtml(patch.description);
    if (Object.keys(upd).length) must(await projects().update(upd).eq("id", id));
  },
  async deleteProject({ id }) {
    must(await projects().delete().eq("id", id)); // las tareas se borran en cascada
  },
  async addTask({ projectId, title, due, daily, every, description }) {
    if (!clean(title)) return;
    const row = { project_id: projectId, title: clean(title), due: daily ? null : due || null, daily: !!daily };
    if (daily) Object.assign(row, { every_days: Math.min(365, Math.max(1, parseInt(every) || 1)), start_on: today() });
    if (description) row.description = cleanHtml(description);
    return must(await tasks().insert(row).select("id").single());
  },
  async toggleTask({ id }) {
    const t = must(await tasks().select("daily, done, done_on").eq("id", id).maybeSingle());
    if (!t) return;
    const upd = t.daily ? { done_on: t.done_on === today() ? null : today() } : { done: !t.done };
    must(await tasks().update(upd).eq("id", id));
  },
  async updateTask({ id, title, due, every, description }) {
    const t = must(await tasks().select("daily, done_on").eq("id", id).maybeSingle());
    if (!t) return;
    const upd = {};
    if (clean(title)) upd.title = clean(title);
    if (every !== undefined) {
      // 0 = no se repite; N>0 = cada N días
      const n = Math.min(365, Math.max(0, parseInt(every) || 0));
      upd.daily = n > 0;
      if (n > 0) { upd.every_days = n; upd.due = null; if (!t.daily) upd.start_on = today(); }
      else upd.done_on = null;
    } else if (!t.daily && due !== undefined) upd.due = due || null;
    if (description !== undefined) upd.description = cleanHtml(description);
    if (Object.keys(upd).length) must(await tasks().update(upd).eq("id", id));
  },
  async deleteTask({ id }) {
    must(await tasks().delete().eq("id", id));
  },
  async saveSettings({ phone, reminders, times }) {
    const upd = {};
    if (phone !== undefined) upd.phone = clean(phone);
    if (reminders !== undefined) upd.reminders = !!reminders;
    if (Array.isArray(times)) upd.times = [...new Set(times.filter((t) => /^\d{2}:\d{2}$/.test(t)))].sort();
    if (Object.keys(upd).length) await saveSettings(upd);
  },
};

export async function POST(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  const { type, ...payload } = await req.json();
  const fn = actions[type];
  if (!fn) return Response.json({ error: "Acción inválida" }, { status: 400 });
  try {
    db();
    const result = await fn(payload);
    return Response.json({ ok: true, result });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
