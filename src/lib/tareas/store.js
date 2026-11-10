import { createClient } from "@supabase/supabase-js";

/**
 * Almacenamiento en Supabase (tablas froit_*). Se usan variables FROIT_SUPABASE_*
 * porque NEXT_PUBLIC_SUPABASE_* de este proyecto apuntan a otra base.
 * Solo servidor: usa la service_role key.
 */
export function db() {
  const url = process.env.FROIT_SUPABASE_URL;
  const key = process.env.FROIT_SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Faltan FROIT_SUPABASE_URL / FROIT_SUPABASE_SERVICE_KEY");
  globalThis.__froitDb ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return globalThis.__froitDb;
}

const must = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

const toProject = (r) => ({ id: r.id, name: r.name, client: r.client, color: r.color, deadline: r.deadline, description: r.description || "" });
const toTask = (r) => ({ id: r.id, projectId: r.project_id, title: r.title, due: r.due, daily: r.daily, done: r.done, doneOn: r.done_on, description: r.description || "", every: r.every_days || 1, startOn: r.start_on });

export async function readAll() {
  const [p, t, s] = await Promise.all([
    db().from("froit_projects").select("*").order("created_at"),
    db().from("froit_tasks").select("*").order("created_at"),
    db().from("froit_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  const st = must(s) ?? {};
  return {
    projects: must(p).map(toProject),
    tasks: must(t).map(toTask),
    settings: {
      phone: st.phone ?? "3878630173",
      reminders: st.reminders ?? true,
      times: st.times ?? ["09:00", "18:00"],
      sent: st.sent ?? {},
      log: st.log ?? [],
    },
  };
}

export async function saveSettings(patch) {
  must(await db().from("froit_settings").upsert({ id: 1, ...patch, updated_at: new Date().toISOString() }));
}

export const projects = () => db().from("froit_projects");
export const tasks = () => db().from("froit_tasks");
export { must };
