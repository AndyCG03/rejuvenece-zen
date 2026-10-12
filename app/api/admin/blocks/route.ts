import { db } from "@/lib/server/db";
import { isDate } from "@/lib/server/booking";
import { fail, guard, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const denied = await guard();
  if (denied) return denied;
  const q = await db();
  return json({ blocks: await q("SELECT * FROM blocks WHERE date >= to_char(NOW() - INTERVAL '1 day', 'YYYY-MM-DD') ORDER BY date, start_min") });
});

export const POST = handle(async (req: Request) => {
  const denied = await guard();
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const start = Number(b.start), end = Number(b.end);
  if (!isDate(b.date) || !(start >= 0 && end <= 1440 && end > start)) return fail("Revisa la fecha y el horario del bloqueo.");
  const q = await db();
  await q("INSERT INTO blocks (date, start_min, end_min, reason) VALUES ($1, $2, $3, $4)", [b.date, start, end, String(b.reason ?? "").slice(0, 120)]);
  return json({ ok: true }, 201);
});

export const DELETE = handle(async (req: Request) => {
  const denied = await guard();
  if (denied) return denied;
  const id = Number(new URL(req.url).searchParams.get("id"));
  const q = await db();
  await q("DELETE FROM blocks WHERE id = $1", [id]);
  return json({ ok: true });
});
