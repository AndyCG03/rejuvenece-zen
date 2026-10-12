import { db } from "@/lib/server/db";
import { fail, guard, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const denied = await guard();
  if (denied) return denied;
  const q = await db();
  return json({ services: await q("SELECT * FROM services ORDER BY sort, name") });
});

export const PATCH = handle(async (req: Request) => {
  const denied = await guard();
  if (denied) return denied;
  const s = await req.json().catch(() => ({}));
  const duration = Number(s.duration_min);
  const price = s.price_mxn === null || s.price_mxn === "" ? null : Number(s.price_mxn);
  if (!(duration >= 15 && duration <= 300) || duration % 5) return fail("La duración debe estar entre 15 y 300 minutos, en múltiplos de 5.");
  if (price !== null && !(price >= 0)) return fail("El precio no es válido.");
  const q = await db();
  await q("UPDATE services SET duration_min = $2, price_mxn = $3, active = $4 WHERE id = $1", [s.id, duration, price, !!s.active]);
  return json({ ok: true });
});
