import { read, write, uid } from "@/lib/tareas/store";
import { today } from "@/lib/tareas/dates";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";

const clean = (s) => String(s ?? "").trim();

const actions = {
  addProject(d, { name, client, color, deadline }) {
    d.projects.push({ id: uid(), name: clean(name), client: clean(client), color: color || "#6366f1", deadline: deadline || null });
  },
  updateProject(d, { id, ...patch }) {
    const p = d.projects.find((x) => x.id === id);
    if (!p) return;
    for (const k of ["name", "client", "color", "deadline"]) if (k in patch) p[k] = patch[k] || (k === "deadline" ? null : p[k]);
  },
  deleteProject(d, { id }) {
    d.projects = d.projects.filter((p) => p.id !== id);
    d.tasks = d.tasks.filter((t) => t.projectId !== id);
  },
  addTask(d, { projectId, title, due, daily }) {
    if (!clean(title)) return;
    d.tasks.push({ id: uid(), projectId, title: clean(title), due: daily ? null : due || null, daily: !!daily, done: false, doneOn: null });
  },
  toggleTask(d, { id }) {
    const t = d.tasks.find((x) => x.id === id);
    if (!t) return;
    if (t.daily) t.doneOn = t.doneOn === today() ? null : today();
    else t.done = !t.done;
  },
  updateTask(d, { id, title, due }) {
    const t = d.tasks.find((x) => x.id === id);
    if (!t) return;
    if (clean(title)) t.title = clean(title);
    if (!t.daily) t.due = due || null;
  },
  deleteTask(d, { id }) {
    d.tasks = d.tasks.filter((t) => t.id !== id);
  },
  saveSettings(d, { phone, reminders, times }) {
    if (phone !== undefined) d.settings.phone = clean(phone);
    if (reminders !== undefined) d.settings.reminders = !!reminders;
    if (Array.isArray(times)) d.settings.times = [...new Set(times.filter((t) => /^\d{2}:\d{2}$/.test(t)))].sort();
  },
};

export async function POST(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  const { type, ...payload } = await req.json();
  const fn = actions[type];
  if (!fn) return Response.json({ error: "Acción inválida" }, { status: 400 });
  const data = read();
  fn(data, payload);
  write(data);
  return Response.json({ ok: true });
}
