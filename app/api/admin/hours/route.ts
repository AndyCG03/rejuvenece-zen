import { db } from "@/lib/server/db";
import { fail, guard, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const denied = await guard();
  if (denied) return denied;
  const q = await db();
  return json({ hours: await q("SELECT * FROM hours ORDER BY weekday") });
});

export const PUT = handle(async (req: Request) => {
  const denied = await guard();
  if (denied) return denied;
  const { hours } = await req.json().catch(() => ({}));
  if (!Array.isArray(hours) || hours.length !== 7) return fail("Horario no válido.");
  for (const h of hours) {
    if (h.is_open && !(h.open_min >= 0 && h.close_min <= 1440 && h.close_min > h.open_min)) return fail("La hora de cierre debe ser después de la de apertura.");
  }
  const q = await db();
  for (const h of hours) {
    await q("UPDATE hours SET is_open = $2, open_min = $3, close_min = $4 WHERE weekday = $1", [h.weekday, !!h.is_open, h.open_min, h.close_min]);
  }
  return json({ ok: true });
});
