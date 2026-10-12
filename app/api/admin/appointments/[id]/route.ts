import { db } from "@/lib/server/db";
import { isDate } from "@/lib/server/booking";
import { fail, guard, handle, json } from "@/lib/server/http";

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export const PATCH = handle(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  const denied = await guard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  const body = await req.json().catch(() => ({}));
  const q = await db();
  const [appt] = await q<{ id: number; duration_min: number; status: string }>("SELECT id, duration_min, status FROM appointments WHERE id = $1", [id]);
  if (!appt) return fail("La cita no existe.", 404);

  if (body.date !== undefined || body.start !== undefined) {
    const start = Number(body.start);
    if (!isDate(body.date) || !Number.isInteger(start) || start < 0 || start >= 1440) return fail("Fecha u hora no válidas.");
    const end = start + appt.duration_min;
    const clash = await q(
      `SELECT 1 FROM appointments WHERE id <> $1 AND date = $2 AND status IN ('pending', 'confirmed') AND start_min < $4 AND end_min > $3
       UNION ALL SELECT 1 FROM blocks WHERE date = $2 AND start_min < $4 AND end_min > $3`,
      [id, body.date, start, end]
    );
    if (clash.length) return fail("Ese horario se encima con otra cita o un bloqueo.", 409);
    await q("UPDATE appointments SET date = $2, start_min = $3, end_min = $4 WHERE id = $1", [id, body.date, start, end]);
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return fail("Estado no válido.");
    try {
      await q("UPDATE appointments SET status = $2 WHERE id = $1", [id, body.status]);
    } catch (e) {
      if ((e as { code?: string }).code === "23505") return fail("Ya hay otra cita activa a esa hora.", 409);
      throw e;
    }
  }
  return json({ ok: true });
});
