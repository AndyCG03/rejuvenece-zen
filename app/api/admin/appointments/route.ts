import { db } from "@/lib/server/db";
import { isDate } from "@/lib/server/booking";
import { fail, guard, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async (req: Request) => {
  const denied = await guard();
  if (denied) return denied;
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!isDate(from) || !isDate(to)) return fail("Rango de fechas no válido.");
  const q = await db();
  const appointments = await q("SELECT * FROM appointments WHERE date BETWEEN $1 AND $2 ORDER BY date, start_min", [from, to]);
  const [{ pending }] = await q<{ pending: number }>("SELECT COUNT(*)::int AS pending FROM appointments WHERE status = 'pending' AND date >= $1", [from]);
  return json({ appointments, pending });
});
