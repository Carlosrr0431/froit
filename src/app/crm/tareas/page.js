"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle, ArrowLeft, CalendarCheck, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Eye, FolderKanban, Info, LayoutDashboard,
  ListTodo, LogOut, MessageCircle, Pencil, Plus, QrCode, RefreshCw, Repeat, Send, Sparkles, Trash2, X,
} from "lucide-react";
import "./tareas.css";

const COLORS = ["#5b5bf0", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#14b8a6", "#8b5cf6"];
const WA = {
  connected: ["Conectado", "ok"],
  need_scan: ["Esperando QR", "warn"],
  logged_out: ["Sin vincular", "warn"],
  disconnected: ["Desconectado", "bad"],
  api_offline: ["API sin conexión", "bad"],
  no_key: ["Falta API key", "bad"],
  bad_key: ["API key inválida", "bad"],
  error: ["Error", "bad"],
};
const WA_HELP = {
  api_offline: "No se puede contactar a whatsmeow-api. Revisá WHATSMEOW_URL y que el servicio de Railway esté encendido.",
  no_key: "Falta WHATSMEOW_API_KEY en .env.local (o en las variables de Vercel).",
  bad_key: "La API key fue rechazada. Verificá que coincida con la de whatsmeow-api.",
};

const api = (url, body) =>
  fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" }).then((r) => r.json());

const isDone = (t, today) => (t.daily ? t.doneOn === today : t.done);
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const short = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString("es-AR", { timeZone: "UTC", day: "numeric", month: "short" });

function Ring({ pct, color, size = 56, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="pring" style={{ "--s": `${size}px` }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#cdd3e6" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <span>{pct}%</span>
    </div>
  );
}

function deadlineTag(deadline, today) {
  if (!deadline) return null;
  const d = days(today, deadline);
  const tone = d < 0 ? "bad" : d <= 3 ? "warn" : "ok";
  const text = d < 0 ? `Vencido hace ${-d} d` : d === 0 ? "Vence hoy" : d === 1 ? "Vence mañana" : `Faltan ${d} d`;
  return <span className={`tag ${tone}`}><Clock size={12} />{text}</span>;
}

function dueTag(t, today) {
  if (t.daily) return <span className="tag brand"><Repeat size={12} />Diaria</span>;
  if (!t.due) return null;
  if (t.done) return <span className="tag">{short(t.due)}</span>;
  const d = days(today, t.due);
  if (d < 0) return <span className="tag bad"><AlertTriangle size={12} />Venció hace {-d} d</span>;
  if (d === 0) return <span className="tag warn">Hoy</span>;
  return <span className="tag">{d === 1 ? "Mañana" : short(t.due)}</span>;
}

export default function TareasPage() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("hoy");
  const [wa, setWa] = useState(null);
  const [toast, setToast] = useState(null);
  const openNewRef = useRef(() => {});
  const [modal, setModal] = useState(null); // { projectId }
  const [open, setOpen] = useState(true); // sidebar: se achica al ir al centro, se expande al pasar por él

  const notify = useCallback((text, bad) => setToast({ text, bad }), []);
  const [error, setError] = useState("");
  const load = useCallback(() => api("/api/tareas/state").then((d) => (d.projects ? (setError(""), setData(d)) : setError(d.error || "Error al cargar"))).catch((e) => setError(e.message)), []);
  const loadWa = useCallback(() => api("/api/tareas/wa").then((d) => setWa(d.error ? { status: "error" } : d)).catch(() => setWa({ status: "api_offline" })), []);

  useEffect(() => { load(); loadWa(); }, [load, loadWa]);
  useEffect(() => {
    if (view !== "wa") return;
    const i = setInterval(loadWa, wa?.status === "need_scan" ? 2500 : 8000);
    return () => clearInterval(i);
  }, [view, loadWa, wa?.status]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const act = useCallback(async (type, payload = {}) => {
    await api("/api/tareas/action", { type, ...payload });
    await load();
  }, [load]);

  // Atajo "C": nueva tarea (si no se está escribiendo en un campo)
  useEffect(() => {
    const onKey = (e) => {
      const el = document.activeElement;
      if (e.key.toLowerCase() !== "c" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (el?.matches?.("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      openNewRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!data) {
    return (
      <div className="ft">
        <main className="main">
          {error ? (
            <div className="card"><h2>No se pudo cargar el módulo</h2><div className="alert"><Info size={18} />{error}. Verificá que ejecutaste <code>supabase/froit_tareas.sql</code> y que están las variables FROIT_SUPABASE_URL y FROIT_SUPABASE_SERVICE_KEY.</div></div>
          ) : null}
        </main>
      </div>
    );
  }
  const { projects, tasks, settings, today } = data;
  const project = projects.find((p) => p.id === view);
  const pending = (p) => tasks.filter((t) => t.projectId === p.id && !isDone(t, today)).length;
  const [waLabel, waTone] = WA[wa?.status] ?? ["Verificando…", ""];

  const openNew = () => projects.length && setModal({ projectId: project?.id });
  openNewRef.current = openNew;

  const newProject = () => {
    const name = prompt("Nombre del proyecto");
    if (name?.trim()) act("addProject", { name, client: name, color: COLORS[projects.length % COLORS.length] });
  };

  return (
    <div className="ft">
      <div className={`app ${open ? "" : "min"}`}>
        <aside className="side" onMouseEnter={() => setOpen(true)}>
          <div className="brand"><i><ListTodo size={20} /></i><div className="lb">Tareas<small>Proyectos y avisos</small></div></div>
          <button className="newbtn" onClick={openNew} title="Nueva tarea (C)"><Plus size={18} /><span className="lb">Nueva tarea</span><kbd className="lb">C</kbd></button>
          <button className={`nav ${view === "hoy" ? "on" : ""}`} onClick={() => setView("hoy")} title="Hoy"><LayoutDashboard size={20} /><span className="lb">Hoy</span></button>
          <div className="label"><span className="lb">Proyectos</span><button className="btn ghost" style={{ padding: 2 }} onClick={newProject} title="Nuevo proyecto"><Plus size={16} /></button></div>
          {projects.map((p) => (
            <button key={p.id} className={`nav ${view === p.id ? "on" : ""}`} onClick={() => setView(p.id)} title={p.name}>
              <span className="dot" style={{ background: p.color }} /><span className="lb">{p.name}</span>
              {pending(p) > 0 && <span className="n">{pending(p)}</span>}
            </button>
          ))}
          <div className="grow" />
          <button className={`wa-card ${view === "wa" ? "on" : ""}`} onClick={() => setView("wa")} title={`WhatsApp · ${waLabel}`}>
            <span className="ic"><MessageCircle size={22} color="#16a34a" /><i className={`sdot ${waTone}`} /></span>
            <span className="lb"><b>WhatsApp</b><small>{waLabel}</small></span>
          </button>
          <a className="exit" href="/crm" title="Volver al CRM"><ArrowLeft size={16} /><span className="lb">Volver al CRM</span></a>
        </aside>

        <main className="main" key={view} onMouseEnter={() => setOpen(false)}>
          {view === "hoy" && <Today {...{ projects, tasks, today, act, setView, newProject }} />}
          {project && <ProjectView key={project.id} {...{ project, tasks, today, act, openNew, onDeleted: () => setView("hoy") }} />}
          {view === "wa" && <WhatsApp {...{ wa, loadWa, settings, act, notify }} />}
        </main>
      </div>
      {modal && <NewTaskModal projects={projects} defaultProject={modal.projectId} today={today} act={act} notify={notify} onClose={() => setModal(null)} />}
      {toast && <div className="toast">{toast.bad ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{toast.text}</div>}
    </div>
  );
}

const addDays = (d, n) => new Date(Date.parse(`${d}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

/** Chip de fecha con menú rápido (Hoy, Mañana, +1 semana, fecha exacta). */
function DateChip({ value, today, onChange, placeholder = "Sin fecha" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const d = value ? days(today, value) : null;
  const tone = d === null ? "" : d < 0 ? "bad" : d === 0 ? "warn" : "";
  const label = d === null ? placeholder : d === 0 ? "Hoy" : d === 1 ? "Mañana" : d === -1 ? "Ayer" : short(value);
  const pick = (v) => { onChange(v); setOpen(false); };

  return (
    <span className="pop" ref={ref}>
      <button type="button" className={`chip ${tone} ${value ? "set" : ""}`} onClick={() => setOpen((o) => !o)}>
        <CalendarDays size={14} />{label}
      </button>
      {open && (
        <div className="menu">
          {[["Hoy", 0], ["Mañana", 1], ["En 1 semana", 7]].map(([l, n]) => (
            <button key={l} type="button" onClick={() => pick(addDays(today, n))}>{l}<small>{short(addDays(today, n))}</small></button>
          ))}
          <input type="date" className="inp" value={value || ""} onChange={(e) => e.target.value && pick(e.target.value)} />
          {value && <button type="button" className="rm" onClick={() => pick("")}><X size={13} />Quitar fecha</button>}
        </div>
      )}
    </span>
  );
}

/** Modal "Nueva tarea" estilo Linear: título grande, proyecto y fecha como chips. */
function NewTaskModal({ projects, defaultProject, today, act, notify, onClose }) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(defaultProject || projects[0]?.id);
  const [due, setDue] = useState("");
  const [daily, setDaily] = useState(false);
  const [again, setAgain] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    await act("addTask", { projectId, title, due: daily ? "" : due, daily });
    setBusy(false);
    notify("Tarea creada");
    if (again) { setTitle(""); setDue(""); } else onClose();
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-top">
          <span className="crumb">Nueva tarea</span>
          <button type="button" className="btn ghost" onClick={onClose} aria-label="Cerrar"><X size={16} /></button>
        </div>
        <input className="modal-title" autoFocus placeholder="¿Qué hay que hacer?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="chips">
          {projects.map((p) => (
            <button type="button" key={p.id} className={`chip ${projectId === p.id ? "on" : ""}`} onClick={() => setProjectId(p.id)}>
              <span className="dot" style={{ background: p.color, width: 9, height: 9 }} />{p.name}
            </button>
          ))}
        </div>
        <div className="chips">
          {!daily && <DateChip value={due} today={today} onChange={setDue} placeholder="Fecha límite" />}
          <button type="button" className={`chip ${daily ? "on" : ""}`} onClick={() => setDaily((v) => !v)}><Repeat size={14} />Todos los días</button>
        </div>
        <div className="modal-foot">
          <label className="chk"><input type="checkbox" checked={again} onChange={(e) => setAgain(e.target.checked)} />Crear otra</label>
          <div className="row gap-s">
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button className="btn primary" disabled={!title.trim() || busy}>Crear tarea<kbd>↵</kbd></button>
          </div>
        </div>
      </form>
    </div>
  );
}

/** Fila para agregar una tarea sin salir de la lista. */
function QuickAdd({ projectId, daily, today, act }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    act("addTask", { projectId, title, due: daily ? "" : due, daily });
    setTitle(""); setDue("");
  };
  return (
    <form className="qa" onSubmit={submit}>
      <Plus size={16} />
      <input placeholder={daily ? "Agregar tarea diaria…" : "Agregar tarea…"} value={title} onChange={(e) => setTitle(e.target.value)} />
      {title.trim() && !daily && <DateChip value={due} today={today} onChange={setDue} />}
      {title.trim() && <kbd>↵</kbd>}
    </form>
  );
}

function TaskGroup({ title, Icon, color, list, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="grp">
      <button className="grp-h" onClick={() => setOpen((o) => !o)}>
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        <Icon size={15} style={{ color }} /><span>{title}</span><small>{list.length}</small>
      </button>
      {open && <div className="grp-b">{children}</div>}
    </section>
  );
}

function TaskRow({ t, today, act, project }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(t.title);
  const done = isDone(t, today);

  const save = () => {
    act("updateTask", { id: t.id, title, due: t.due || "" });
    setEdit(false);
  };

  return (
    <div className={`task ${done ? "done" : ""}`}>
      <input type="checkbox" className="cb" checked={done} onChange={() => act("toggleTask", { id: t.id })} aria-label="Completar tarea" />
      {edit ? (
        <input className="t-edit" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onBlur={save} onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setTitle(t.title); setEdit(false); } }} />
      ) : (
        <span className="t" onDoubleClick={() => setEdit(true)}>{t.title}</span>
      )}
      {project && <span className="pchip"><span className="dot" style={{ background: project.color, width: 8, height: 8 }} />{project.name}</span>}
      {t.daily ? <span className="chip static"><Repeat size={13} />Diaria</span> : <DateChip value={t.due} today={today} onChange={(v) => act("updateTask", { id: t.id, due: v })} />}
      <span className="acts">
        <button className="btn ghost" onClick={() => setEdit(true)} title="Editar"><Pencil size={14} /></button>
        <button className="btn ghost" onClick={() => act("deleteTask", { id: t.id })} title="Eliminar"><Trash2 size={14} /></button>
      </span>
    </div>
  );
}

function Group({ title, Icon, color, list, projects, today, act }) {
  if (!list.length) return null;
  return (
    <TaskGroup {...{ title, Icon, color, list }}>
      {list.map((t) => <TaskRow key={t.id} {...{ t, today, act }} project={projects.find((p) => p.id === t.projectId)} />)}
    </TaskGroup>
  );
}

function Today({ projects, tasks, today, act, setView, newProject }) {
  const pending = tasks.filter((t) => !isDone(t, today));
  const overdue = pending.filter((t) => !t.daily && t.due && t.due < today);
  const dueToday = pending.filter((t) => !t.daily && t.due === today);
  const dailyAll = tasks.filter((t) => t.daily);
  const daily = dailyAll.filter((t) => !isDone(t, today));
  const soon = pending.filter((t) => !t.daily && t.due && days(today, t.due) > 0 && days(today, t.due) <= 7);
  const doneToday = dailyAll.length - daily.length;
  const pct = (p) => {
    const own = tasks.filter((t) => t.projectId === p.id && !t.daily);
    return own.length ? Math.round((own.filter((t) => t.done).length / own.length) * 100) : 0;
  };
  const stats = [
    { n: pending.filter((t) => !t.daily).length, l: "Tareas pendientes", Icon: ListTodo, c: "#4f46e5" },
    { n: overdue.length, l: "Vencidas", Icon: AlertTriangle, c: "#dc2626" },
    { n: dueToday.length, l: "Vencen hoy", Icon: CalendarCheck, c: "#d97706" },
    { n: `${doneToday}/${dailyAll.length}`, l: "Diarias hechas", Icon: Repeat, c: "#059669" },
  ];
  const nothing = !overdue.length && !dueToday.length && !daily.length && !soon.length;

  return (
    <>
      <h1>Hola, ¿qué toca hoy?</h1>
      <p className="sub cap">{new Date(`${today}T00:00:00Z`).toLocaleDateString("es-AR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" })}</p>

      <div className="stats">
        {stats.map(({ n, l, Icon, c }) => (
          <div className="stat" key={l}>
            <div className="ic" style={{ background: `color-mix(in srgb, ${c} 13%, white)`, color: c }}><Icon size={22} /></div>
            <div><b>{n}</b><span>{l}</span></div>
          </div>
        ))}
      </div>

      <div className="section-t">Tus proyectos</div>
      <div className="projects">
        {projects.map((p) => (
          <button key={p.id} className="pcard" style={{ "--c": p.color }} onClick={() => setView(p.id)}>
            <div className="top">
              <Ring pct={pct(p)} color={p.color} />
              <div><strong>{p.name}</strong><small>{pending.filter((t) => t.projectId === p.id).length} pendientes</small></div>
            </div>
            {deadlineTag(p.deadline, today) || <span className="tag">Sin fecha límite</span>}
          </button>
        ))}
        <button className="pcard add" onClick={newProject}><Plus size={24} /><small>Nuevo proyecto</small></button>
      </div>

      <div className="section-t">Qué hacer</div>
      <div className={nothing ? "" : "list"}>
      <Group title="Vencidas" hint="Pasó la fecha, resolvelas primero" Icon={AlertTriangle} color="#dc2626" list={overdue} {...{ projects, today, act }} />
      <Group title="Para hoy" hint="Vencen hoy" Icon={CalendarCheck} color="#d97706" list={dueToday} {...{ projects, today, act }} />
      <Group title="Todos los días" hint="Rutinas que se reinician cada día" Icon={Repeat} color="#059669" list={daily} {...{ projects, today, act }} />
      <Group title="Próximos 7 días" hint="Para ir adelantando" Icon={Clock} color="#4f46e5" list={soon} {...{ projects, today, act }} />
      </div>
      {nothing && (
        <div className="card empty">
          <Sparkles size={30} />
          {tasks.length ? "¡Todo al día! No tenés nada pendiente por ahora." : "Todavía no cargaste tareas. Entrá a un proyecto y agregá la primera."}
        </div>
      )}
    </>
  );
}

function ProjectView({ project: p, tasks, today, act, openNew, onDeleted }) {
  const own = tasks.filter((t) => t.projectId === p.id);
  const normal = own.filter((t) => !t.daily);
  const todo = normal.filter((t) => !t.done).sort((a, b) => (a.due || "9").localeCompare(b.due || "9"));
  const finished = normal.filter((t) => t.done);
  const daily = own.filter((t) => t.daily);
  const pct = normal.length ? Math.round((finished.length / normal.length) * 100) : 0;
  const rowProps = { today, act };

  return (
    <>
      <div className="crumbs"><span>Proyectos</span><ChevronRight size={14} /><span className="dot" style={{ background: p.color, width: 9, height: 9 }} />{p.name}</div>

      <div className="row between" style={{ margin: "14px 0 18px" }}>
        <input className="h-edit" defaultValue={p.name} onBlur={(e) => e.target.value.trim() && e.target.value !== p.name && act("updateProject", { id: p.id, name: e.target.value })} />
        <div className="row gap-s">
          <button className="btn primary" onClick={openNew}><Plus size={15} />Nueva tarea<kbd>C</kbd></button>
          <button className="btn ghost danger" title="Eliminar proyecto" onClick={() => confirm(`¿Eliminar "${p.name}" y todas sus tareas?`) && (act("deleteProject", { id: p.id }), onDeleted())}><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="props">
        <label className="prop"><span>Cliente</span><input defaultValue={p.client} onBlur={(e) => act("updateProject", { id: p.id, client: e.target.value })} /></label>
        <div className="prop"><span>Entrega</span><DateChip value={p.deadline} today={today} placeholder="Sin fecha límite" onChange={(v) => act("updateProject", { id: p.id, deadline: v })} /></div>
        <div className="prop"><span>Color</span><div className="swatches">{COLORS.map((c) => <button key={c} className={p.color === c ? "on" : ""} style={{ background: c }} onClick={() => act("updateProject", { id: p.id, color: c })} aria-label={`Color ${c}`} />)}</div></div>
        <div className="prop grow"><span>Progreso · {finished.length}/{normal.length}</span><div className="bar"><i style={{ width: `${pct}%`, background: p.color }} /></div></div>
      </div>

      <div className="list">
        <TaskGroup title="Por hacer" Icon={ListTodo} color="#4f46e5" list={todo}>
          {todo.map((t) => <TaskRow key={t.id} t={t} {...rowProps} />)}
          <QuickAdd projectId={p.id} today={today} act={act} />
        </TaskGroup>
        <TaskGroup title="Todos los días" Icon={Repeat} color="#059669" list={daily}>
          {daily.map((t) => <TaskRow key={t.id} t={t} {...rowProps} />)}
          <QuickAdd projectId={p.id} daily today={today} act={act} />
        </TaskGroup>
        {finished.length > 0 && (
          <TaskGroup title="Hechas" Icon={CheckCircle2} color="#64748b" list={finished} defaultOpen={false}>
            {finished.map((t) => <TaskRow key={t.id} t={t} {...rowProps} />)}
          </TaskGroup>
        )}
      </div>
    </>
  );
}

function WhatsApp({ wa, loadWa, settings, act, notify }) {
  const [busy, setBusy] = useState("");
  const [qr, setQr] = useState(null);
  const [preview, setPreview] = useState("");
  const [newTime, setNewTime] = useState("12:00");

  const run = async (action, okText) => {
    setBusy(action);
    const r = await api("/api/tareas/wa", { action }).catch((e) => ({ ok: false, message: e.message }));
    setBusy("");
    if (r.qr_image) setQr(r.qr_image);
    if (r.text) setPreview(r.text);
    else if (r.ok === false || r.error) notify(r.message || r.error || "No se pudo completar", true);
    else if (okText) notify(okText);
    loadWa();
    return r;
  };

  const status = wa?.status;
  const connected = status === "connected";
  const [label, tone] = WA[status] ?? ["Verificando…", ""];
  const image = connected ? null : wa?.qr_image || qr;
  const help = WA_HELP[status];

  return (
    <>
      <h1>WhatsApp</h1>
      <p className="sub">Vinculá tu número para recibir tus tareas y fechas límite por mensaje.</p>

      <div className="card">
        <div className="row between">
          <div className="wa-hero">
            <div className="ic" style={{ background: connected ? "#25d366" : "var(--soft)", color: connected ? "#fff" : "var(--muted)" }}><MessageCircle size={26} /></div>
            <div>
              <h2>{connected ? "WhatsApp en línea" : "Vincular WhatsApp"}</h2>
              <span className={`pill ${tone}`} style={{ marginTop: 6 }}><i />{label}{wa?.phone ? ` · +${wa.phone}` : ""}</span>
            </div>
          </div>
          <div className="row gap-s">
            {!connected && !help && <button className="btn primary" disabled={!!busy} onClick={() => run(image ? "refresh-qr" : "connect")}>{busy ? <RefreshCw size={15} className="spin" /> : <QrCode size={16} />}{busy ? "Generando…" : image ? "Nuevo QR" : "Generar QR"}</button>}
            {(connected || status === "disconnected") && <button className="btn danger" disabled={!!busy} onClick={() => confirm("¿Desvincular WhatsApp?") && (setQr(null), run("reset", "Sesión cerrada"))}><LogOut size={15} />Desvincular</button>}
          </div>
        </div>

        {help && <div className="alert"><Info size={18} />{help}</div>}

        {!connected && !help && (
          <div className="qrbox">
            {image ? <img className="qr" src={image} alt="Código QR de WhatsApp" /> : <div className="qr qr-ph"><QrCode size={48} /></div>}
            <ol className="steps">
              <li>Tocá <b>Generar QR</b> y esperá unos segundos.</li>
              <li>En tu celular abrí WhatsApp → <b>Dispositivos vinculados</b>.</li>
              <li>Elegí <b>Vincular un dispositivo</b> y escaneá el código (dura ~60 s).</li>
            </ol>
          </div>
        )}
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-h"><h2>Avisos automáticos</h2>
            <label className="chk"><input type="checkbox" checked={settings.reminders} onChange={(e) => act("saveSettings", { reminders: e.target.checked })} />Activados</label>
          </div>
          <label className="fld" style={{ marginBottom: 14 }}>Tu número
            <input type="tel" className="inp" defaultValue={settings.phone} onBlur={(e) => act("saveSettings", { phone: e.target.value })} />
          </label>
          <div className="fld" style={{ marginBottom: 6 }}>Horarios de envío</div>
          <div className="times">
            {settings.times.map((t) => (
              <span key={t} className="tag brand"><Clock size={12} />{t}
                <button className="btn ghost" style={{ padding: 0 }} onClick={() => act("saveSettings", { times: settings.times.filter((x) => x !== t) })} aria-label={`Quitar ${t}`}><X size={13} /></button>
              </span>
            ))}
            <input type="time" className="inp" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            <button className="btn" onClick={() => act("saveSettings", { times: [...settings.times, newTime] })}><Plus size={14} />Agregar</button>
          </div>
          <p className="sub" style={{ margin: "14px 0" }}>Incluye lo vencido, lo de hoy, tus tareas diarias y los días que faltan para cada entrega. Salen mientras el servidor del CRM esté corriendo.</p>
          <div className="row gap-s">
            <button className="btn wa" disabled={!connected || !!busy} onClick={() => run("reminder", "Resumen enviado a tu WhatsApp")}><Send size={15} />Enviar ahora</button>
            <button className="btn" disabled={!!busy} onClick={() => run("preview")}><Eye size={15} />Vista previa</button>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h2>{preview ? "Así se ve el mensaje" : "Últimos envíos"}</h2>{preview && <button className="btn ghost" onClick={() => setPreview("")}><X size={15} /></button>}</div>
          {preview ? (
            <div className="chatbg"><div className="bubble">{preview.replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1")}</div></div>
          ) : settings.log?.length ? (
            <div className="log">{settings.log.slice(0, 6).map((l) => (
              <div key={l.at}>{l.ok ? <CheckCircle2 size={15} style={{ color: "var(--ok)" }} /> : <AlertTriangle size={15} style={{ color: "var(--bad)" }} />}{new Date(l.at).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })} · {l.reason} · {l.message}</div>
            ))}</div>
          ) : <div className="empty"><Send size={24} />Todavía no se envió ningún resumen.</div>}
        </div>
      </div>
    </>
  );
}
