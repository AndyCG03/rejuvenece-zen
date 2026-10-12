import { checkPassword, hasPasswordConfigured, startSession } from "@/lib/server/auth";
import { fail, handle, json } from "@/lib/server/http";

export const POST = handle(async (req: Request) => {
  if (!hasPasswordConfigured()) return fail("Falta configurar ADMIN_PASSWORD en Vercel.", 503);
  const { password } = await req.json().catch(() => ({}));
  await new Promise((r) => setTimeout(r, 400)); // frena intentos por fuerza bruta
  if (typeof password !== "string" || !checkPassword(password)) return fail("Contraseña incorrecta.", 401);
  await startSession();
  return json({ ok: true });
});
