import { db } from "@/lib/tareas/store";
import { denyIfNoSession } from "@/lib/tareas/auth";

export const dynamic = "force-dynamic";
const BUCKET = "froit-tareas";
const MAX = 4 * 1024 * 1024;

/** Sube una imagen pegada en la descripción de una tarea y devuelve su URL pública. */
export async function POST(req) {
  const denied = await denyIfNoSession(req);
  if (denied) return denied;
  try {
    const file = (await req.formData()).get("file");
    if (!file || !String(file.type).startsWith("image/")) return Response.json({ error: "Archivo inválido" }, { status: 400 });
    if (file.size > MAX) return Response.json({ error: "La imagen supera 4 MB" }, { status: 413 });
    const storage = db().storage;
    await storage.createBucket(BUCKET, { public: true }).catch(() => {}); // ya existe: ignorar
    const ext = file.type.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "png";
    const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
    const { error } = await storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (error) throw error;
    return Response.json({ url: storage.from(BUCKET).getPublicUrl(path).data.publicUrl });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
