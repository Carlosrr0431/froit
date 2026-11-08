"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle, ArrowLeft, CalendarCheck, Check, CheckCircle2, Clock, Eye, FolderKanban, Info, LayoutDashboard,
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
    <div className="ring" style={{ "--s": `${size}px` }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--soft)" strokeWidth={stroke} />
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

  const notify = useCallback((text, bad) => setToast({ text, bad }), []);
  const load = useCallback(() => api("/api/tareas/state").then((d) => d.projects && setData(d)), []);
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

  if (!data) return <div className="ft" />;
  const { projects, tasks, settings, today } = data;
  const project = projects.find((p) => p.id === view);
  const pending = (p) => tasks.filter((t) => t.projectId === p.id && !isDone(t, today)).length;
  const [waLabel, waTone] = WA[wa?.status] ?? ["Verificando…", ""];

  const newProject = () => {
    const name = prompt("Nombre del proyecto");
    if (name?.trim()) act("addProject", { name, client: name, color: COLORS[projects.length % COLORS.length] });
  };

  return (
    <div className="ft">
      <div className="app">
        <aside className="side">
          <div className="brand"><i><ListTodo size={18} /></i><div>Tareas<small>Proyectos y avisos</small></div></div>
          <button className={`nav ${view === "hoy" ? "on" : ""}`} onClick={() => setView("hoy")}><LayoutDashboard size={18} />Hoy</button>
          <div className="label">Proyectos <button className="btn ghost" style={{ padding: 2 }} onClick={newProject} title="Nuevo proyecto"><Plus size={15} /></button></div>
          {projects.map((p) => (
            <button key={p.id} className={`nav ${view === p.id ? "on" : ""}`} onClick={() => setView(p.id)}>
              <span className="dot" style={{ background: p.color }} />{p.name}
              {pending(p) > 0 && <span className="n">{pending(p)}</span>}
            </button>
          ))}
          <div className="grow" />
          <button className={`wa-card ${view === "wa" ? "on" : ""}`} onClick={() => setView("wa")}>
            <b><MessageCircle size={16} color="#25d366" />WhatsApp</b>
            <span className={`pill ${waTone}`} style={{ padding: 0, background: "none", marginLeft: -24 }}><i />{waLabel}</span>
          </button>
          <a className="exit" href="/crm"><ArrowLeft size={14} />Volver al CRM</a>
        </aside>

        <main className="main" key={view}>
          {view === "hoy" && <Today {...{ projects, tasks, today, act, setView, newProject }} />}
          {project && <ProjectView key={project.id} {...{ project, tasks, today, act, onDeleted: () => setView("hoy") }} />}
          {view === "wa" && <WhatsApp {...{ wa, loadWa, settings, act, notify }} />}
        </main>
      </div>
      {toast && <div className="toast">{toast.bad ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{toast.text}</div>}
    </div>
  );
}

function TaskRow({ t, today, act }) {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(t.title);
  const [due, setDue] = useState(t.due || "");
  const done = isDone(t, today);

  const save = () => {
    act("updateTask", { id: t.id, title, due });
    setEdit(false);
  };

  return (
    <div className={`task ${done ? "done" : ""}`}>
      <input type="checkbox" className="cb" checked={done} onChange={() => act("toggleTask", { id: t.id })} aria-label="Completar tarea" />
      {edit ? (
        <>
          <input className="inp t" style={{ flex: 1 }} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEdit(false); }} />
          {!t.daily && <input type="date" className="inp" value={due} onChange={(e) => setDue(e.target.value)} />}
          <button className="btn ghost" onClick={save} title="Guardar"><Check size={16} /></button>
          <button className="btn ghost" onClick={() => setEdit(false)} title="Cancelar"><X size={16} /></button>
        </>
      ) : (
        <>
          <span className="t" onDoubleClick={() => setEdit(true)}>{t.title}</span>
          {dueTag(t, today)}
          <span className="acts">
            <button className="btn ghost" onClick={() => setEdit(true)} title="Editar"><Pencil size={15} /></button>
            <button className="btn ghost" onClick={() => act("deleteTask", { id: t.id })} title="Eliminar"><Trash2 size={15} /></button>
          </span>
        </>
      )}
    </div>
  );
}

function Today({ projects, tasks, today, act, setView, newProject }) {
  const pending = tasks.filter((t) => !isDone(t, today));
  const overdue = pending.filter((t) => !t.daily && t.due && t.due < today);
  const dueToday = pending.filter((t) => !t.daily && t.due === today);
  const daily = tasks.filter((t) => t.daily);
  const focus = tasks.filter((t) => t.daily || (!t.done && t.due && t.due <= today));
  const pct = (p) => {
    const own = tasks.filter((t) => t.projectId === p.id && !t.daily);
    return own.length ? Math.round((own.filter((t) => t.done).length / own.length) * 100) : 0;
  };
  const stats = [
    { n: pending.filter((t) => !t.daily).length, l: "Pendientes", Icon: ListTodo, c: "#5b5bf0" },
    { n: overdue.length, l: "Vencidas", Icon: AlertTriangle, c: "#ef4444" },
    { n: dueToday.length, l: "Para hoy", Icon: CalendarCheck, c: "#f59e0b" },
    { n: `${daily.filter((t) => t.doneOn === today).length}/${daily.length}`, l: "Diarias hechas", Icon: Repeat, c: "#10b981" },
  ];

  return (
    <>
      <h1>Hola, ¿qué toca hoy?</h1>
      <p className="sub cap">{new Date(`${today}T00:00:00Z`).toLocaleDateString("es-AR", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" })}</p>

      <div className="stats">
        {stats.map(({ n, l, Icon, c }) => (
          <div className="stat" key={l}>
            <div className="ic" style={{ background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c }}><Icon size={20} /></div>
            <div><b>{n}</b><span>{l}</span></div>
          </div>
        ))}
      </div>

      <div className="projects">
        {projects.map((p) => (
          <button key={p.id} className="pcard" style={{ "--c": p.color }} onClick={() => setView(p.id)}>
            <div className="top">
              <Ring pct={pct(p)} color={p.color} />
              <div><strong>{p.name}</strong><small>{tasks.filter((t) => t.projectId === p.id && !isDone(t, today)).length} pendientes</small></div>
            </div>
            {deadlineTag(p.deadline, today) || <span className="tag">Sin fecha límite</span>}
          </button>
        ))}
        <button className="pcard" style={{ "--c": "var(--brand)", placeItems: "center", color: "var(--muted)", borderStyle: "dashed", boxShadow: "none" }} onClick={newProject}>
          <Plus size={22} /><small>Nuevo proyecto</small>
        </button>
      </div>

      {projects.map((p) => {
        const list = focus.filter((t) => t.projectId === p.id);
        if (!list.length) return null;
        return (
          <div className="card" key={p.id}>
            <div className="card-h"><h2 className="row gap-s"><span className="dot" style={{ background: p.color }} />{p.name}</h2></div>
            {list.map((t) => <TaskRow key={t.id} {...{ t, today, act }} />)}
          </div>
        );
      })}
      {!focus.length && <div className="card empty"><Sparkles size={28} />Nada urgente para hoy. Sumá tareas desde cada proyecto.</div>}
    </>
  );
}

const FILTERS = [["all", "Todas"], ["pending", "Pendientes"], ["done", "Hechas"], ["daily", "Diarias"]];

function ProjectView({ project: p, tasks, today, act, onDeleted }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [daily, setDaily] = useState(false);
  const [filter, setFilter] = useState("all");
  const own = tasks.filter((t) => t.projectId === p.id);
  const normal = own.filter((t) => !t.daily);
  const done = normal.filter((t) => t.done).length;
  const pct = normal.length ? Math.round((done / normal.length) * 100) : 0;
  const shown = own
    .filter((t) => filter === "all" || (filter === "pending" && !isDone(t, today)) || (filter === "done" && isDone(t, today)) || (filter === "daily" && t.daily))
    .sort((a, b) => Number(isDone(a, today)) - Number(isDone(b, today)) || (a.due || "9").localeCompare(b.due || "9"));

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    act("addTask", { projectId: p.id, title, due, daily });
    setTitle(""); setDue(""); setDaily(false);
  };

  return (
    <>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <div className="row" style={{ gap: 16 }}>
          <Ring pct={pct} color={p.color} size={64} stroke={7} />
          <div>
            <input className="inp" style={{ fontSize: 24, fontWeight: 750, letterSpacing: "-.03em", padding: "2px 8px", marginLeft: -8, background: "transparent" }} defaultValue={p.name} onBlur={(e) => e.target.value.trim() && e.target.value !== p.name && act("updateProject", { id: p.id, name: e.target.value })} />
            <p className="sub" style={{ margin: "2px 0 0" }}>{normal.length ? `${done} de ${normal.length} tareas completadas` : "Sin tareas todavía"}</p>
          </div>
        </div>
        <button className="btn danger" onClick={() => confirm(`¿Eliminar "${p.name}" y todas sus tareas?`) && (act("deleteProject", { id: p.id }), onDeleted())}><Trash2 size={15} />Eliminar</button>
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <div className="row between" style={{ alignItems: "flex-end" }}>
          <label className="fld">Cliente<input className="inp" defaultValue={p.client} onBlur={(e) => act("updateProject", { id: p.id, client: e.target.value })} /></label>
          <label className="fld">Fecha límite<input type="date" className="inp" value={p.deadline || ""} onChange={(e) => act("updateProject", { id: p.id, deadline: e.target.value })} /></label>
          <div className="fld">Color<div className="swatches">{COLORS.map((c) => <button key={c} className={p.color === c ? "on" : ""} style={{ background: c }} onClick={() => act("updateProject", { id: p.id, color: c })} aria-label={`Color ${c}`} />)}</div></div>
          {deadlineTag(p.deadline, today)}
        </div>
      </div>

      <form className="card composer" onSubmit={submit}>
        <Plus size={18} color="var(--muted)" />
        <input className="inp t" placeholder="Agregar una tarea…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" className="inp" value={due} disabled={daily} onChange={(e) => setDue(e.target.value)} title="Fecha límite" />
        <label className="chk"><input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} />Todos los días</label>
        <button className="btn primary" disabled={!title.trim()}>Agregar</button>
      </form>

      <div className="card">
        <div className="seg">{FILTERS.map(([k, l]) => <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>)}</div>
        {shown.length ? shown.map((t) => <TaskRow key={t.id} {...{ t, today, act }} />) : <div className="empty"><ListTodo size={26} />{own.length ? "No hay tareas en este filtro." : "Agregá la primera tarea de la lista."}</div>}
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
              <div key={l.at}>{l.ok ? <CheckCircle2 size={15} color="var(--ok)" /> : <AlertTriangle size={15} color="var(--bad)" />}{new Date(l.at).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })} · {l.reason} · {l.message}</div>
            ))}</div>
          ) : <div className="empty"><Send size={24} />Todavía no se envió ningún resumen.</div>}
        </div>
      </div>
    </>
  );
}
