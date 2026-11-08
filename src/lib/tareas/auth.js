import { getToken } from "next-auth/jwt";

/** Devuelve una Response 401 si no hay sesión de NextAuth; si hay sesión, null. */
export async function denyIfNoSession(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  return token ? null : Response.json({ error: "No autorizado" }, { status: 401 });
}
