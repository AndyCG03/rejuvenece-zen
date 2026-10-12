import { db } from "./db";

export const TZ = "America/Mexico_City";
export const STEP_MIN = 30;
export const LEAD_MIN = 120; // anticipación mínima para reservar el mismo día
export const HORIZON_DAYS = 60;
export const ACTIVE = ["pending", "confirmed"] as const;

export type Service = { id: string; category: string; name: string; description: string; duration_min: number; price_mxn: number | null; active: boolean; sort: number };
export type Hours = { weekday: number; is_open: boolean; open_min: number; close_min: number };

export function nowInMexico() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export const isDate = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
export const weekday = (date: string) => new Date(date + "T12:00:00Z").getUTCDay();
export const addDays = (date: string, n: number) => {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export async function getAvailability(serviceId: string, date: string) {
  const q = await db();
  const [service] = await q<Service>("SELECT * FROM services WHERE id = $1 AND active", [serviceId]);
  if (!service || !isDate(date)) return { service: null, slots: [] as number[] };

  const now = nowInMexico();
  if (date < now.date || date > addDays(now.date, HORIZON_DAYS)) return { service, slots: [] };

  const [hours] = await q<Hours>("SELECT * FROM hours WHERE weekday = $1", [weekday(date)]);
  if (!hours?.is_open) return { service, slots: [] };

  const busy = await q<{ start_min: number; end_min: number }>(
    `SELECT start_min, end_min FROM appointments WHERE date = $1 AND status IN ('pending', 'confirmed')
     UNION ALL SELECT start_min, end_min FROM blocks WHERE date = $1`,
    [date]
  );

  const earliest = date === now.date ? now.minutes + LEAD_MIN : 0;
  const slots: number[] = [];
  for (let t = hours.open_min; t + service.duration_min <= hours.close_min; t += STEP_MIN) {
    if (t < earliest) continue;
    const end = t + service.duration_min;
    if (busy.some((b) => t < b.end_min && end > b.start_min)) continue;
    slots.push(t);
  }
  return { service, slots };
}

export const fmtTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
