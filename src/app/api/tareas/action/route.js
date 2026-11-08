import { projects, tasks, saveSettings, must, db } from "@/lib/tareas/store";
import { today } from "@/lib/tareas/dates";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

const clean = (s) => String(s ?? "").trim();

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
    if (Object.keys(upd).length) must(await projects().update(upd).eq("id", id));
  },
  async deleteProject({ id }) {
    must(await projects().delete().eq("id", id)); // las tareas se borran en cascada
  },
  async addTask({ projectId, title, due, daily }) {
    if (!clean(title)) return;
    must(await tasks().insert({ project_id: projectId, title: clean(title), due: daily ? null : due || null, daily: !!daily }));
  },
  async toggleTask({ id }) {
    const t = must(await tasks().select("daily, done, done_on").eq("id", id).maybeSingle());
    if (!t) return;
    const upd = t.daily ? { done_on: t.done_on === today() ? null : today() } : { done: !t.done };
    must(await tasks().update(upd).eq("id", id));
  },
  async updateTask({ id, title, due }) {
    const t = must(await tasks().select("daily").eq("id", id).maybeSingle());
    if (!t) return;
    const upd = {};
    if (clean(title)) upd.title = clean(title);
    if (!t.daily) upd.due = due || null;
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
    await fn(payload);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
