import { db } from "@/lib/server/db";
import { HORIZON_DAYS, nowInMexico, type Hours, type Service } from "@/lib/server/booking";
import { handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  const q = await db();
  const services = await q<Service>("SELECT id, category, name, description, duration_min, price_mxn FROM services WHERE active ORDER BY sort, name");
  const hours = await q<Hours>("SELECT * FROM hours ORDER BY weekday");
  return json({ services, openDays: hours.filter((h) => h.is_open).map((h) => h.weekday), today: nowInMexico().date, horizonDays: HORIZON_DAYS });
});
