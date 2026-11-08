/**
 * Cliente de whatsmeow-api para el módulo de tareas (misma convención que Marxel):
 * - API en Railway con X-API-Key, una sesión propia por agent_code.
 * - Envío con dígitos directos: NO se llama check-number (es lo que más penaliza Meta).
 * - Si la API devuelve señales de bloqueo, se pausa la línea un rato.
 */

const BAN_PAUSE_MS = 45 * 60_000;
const BAN_RE = /banned|blocked|forbidden|\bspam\b|rate.?limit|too many|not.?authorized|\b403\b|\b401\b|iq.?error|connection.?closed/i;

const base = () => (process.env.WHATSMEOW_URL || "https://whatsmeow-api-production.up.railway.app").replace(/\/$/, "");
const apiKey = () => String(process.env.WHATSMEOW_API_KEY || "").trim();
export const agentCode = () => (process.env.WHATSMEOW_AGENT_CODE || "FROIT_TAREAS").trim();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const g = globalThis;
g.__waPausedUntil ??= 0;

async function call(path, { method = "GET", body } = {}) {
  const res = await fetch(`${base()}${path}`, {
    method,
    headers: { Accept: "application/json", "X-API-Key": apiKey(), ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok && json.success !== false, status: res.status, message: json.message || json.error, data: json.data ?? null };
}

/** Celular argentino → 549XXXXXXXXXX (corrige el 307 que a veces reemplaza al 387 de Salta). */
export function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "").replace(/^0+/, "");
  if (d.startsWith("54") && !d.startsWith("549")) d = "549" + d.slice(2);
  else if (d.length >= 8 && d.length <= 11 && !d.startsWith("549")) d = "549" + d;
  if (d.startsWith("549307") && d.length === 13) d = "549387" + d.slice(6);
  return d;
}

export const hasKey = () => Boolean(apiKey());

export async function status() {
  if (!hasKey()) return { status: "no_key" };
  try {
    const r = await call(`/api/status?agent_code=${encodeURIComponent(agentCode())}`);
    if (r.status === 404) return { status: "logged_out" };
    if (r.status === 401 || r.status === 403) return { status: "bad_key" };
    if (!r.data) return { status: "error", message: r.message };
    return { status: r.data.connected ? "connected" : r.data.status || "disconnected", phone: r.data.phone || null };
  } catch {
    return { status: "api_offline" };
  }
}

export async function qr() {
  const r = await call(`/api/session/qr?agent_code=${encodeURIComponent(agentCode())}`);
  return r.ok ? r.data?.qr_image || null : null;
}

async function waitForQr() {
  for (let i = 0; i < 12; i++) {
    const img = await qr().catch(() => null);
    if (img) return img;
    await sleep(700);
  }
  return null;
}

/** Conecta la sesión y espera el QR. Con refresh=true corta primero la sesión previa (QR nuevo). */
export async function connect({ refresh = false } = {}) {
  if (refresh) {
    await call("/api/session/disconnect", { method: "POST", body: { agent_code: agentCode() } }).catch(() => null);
    await sleep(400);
  }
  const r = await call("/api/session/connect", { method: "POST", body: { agent_code: agentCode() } });
  if (!r.ok) return { ok: false, message: r.message || "No se pudo iniciar la sesión" };
  if (r.data?.needs_qr === false) return { ok: true, qr_image: null };
  const img = r.data?.qr_image || (await waitForQr());
  return img ? { ok: true, qr_image: img } : { ok: false, message: "No se pudo generar el QR. Probá de nuevo." };
}

/** Igual que Marxel: logout + disconnect. */
export async function reset() {
  await call("/api/session/logout", { method: "POST", body: { agent_code: agentCode() } }).catch(() => null);
  await sleep(350);
  await call("/api/session/disconnect", { method: "POST", body: { agent_code: agentCode() } }).catch(() => null);
  return { ok: true };
}

export async function sendText(phone, message) {
  if (!hasKey()) return { ok: false, message: "Falta WHATSMEOW_API_KEY" };
  if (Date.now() < g.__waPausedUntil) return { ok: false, message: "Línea en pausa anti-bloqueo" };
  const to = normalizePhone(phone);
  if (!to) return { ok: false, message: "Número inválido" };

  const send = () => call("/api/messages/send", { method: "POST", body: { agent_code: agentCode(), phone: to, message } });
  let r = await send();
  if (!r.ok && /websocket not connected|not connected/i.test(r.message || "")) {
    await sleep(4000);
    r = await send();
  }
  if (!r.ok && BAN_RE.test(r.message || "")) g.__waPausedUntil = Date.now() + BAN_PAUSE_MS;
  return { ok: r.ok, message: r.ok ? "Enviado" : r.message || `Error ${r.status}` };
}
