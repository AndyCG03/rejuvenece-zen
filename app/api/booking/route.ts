import { db } from "@/lib/server/db";
import { getAvailability } from "@/lib/server/booking";
import { fail, handle, json } from "@/lib/server/http";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const POST = handle(async (req: Request) => {
  const body = await req.json().catch(() => ({}));
  if (body.website) return json({ ok: true }); // honeypot anti-spam

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const email = clean(body.email, 120);
  const notes = clean(body.notes, 500);
  const date = clean(body.date, 10);
  const start = Number(body.start);

  if (name.length < 2) return fail("Escribe tu nombre.");
  if (phone.replace(/\D/g, "").length < 10) return fail("Escribe un teléfono de 10 dígitos.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("El correo no es válido.");

  const { service, slots } = await getAvailability(clean(body.service, 80), date);
  if (!service) return fail("Elige un servicio y una fecha válidos.");
  if (!slots.includes(start)) return fail("Ese horario ya no está disponible. Elige otro.", 409);

  const end = start + service.duration_min;
  const q = await db();
  try {
    const rows = await q<{ id: number }>(
      `INSERT INTO appointments (service_id, service_name, duration_min, date, start_min, end_min, customer_name, phone, email, notes)
       SELECT $1::text, $2::text, $3::int, $4::text, $5::int, $6::int, $7::text, $8::text, $9::text, $10::text
       WHERE NOT EXISTS (
         SELECT 1 FROM appointments WHERE date = $4::text AND status IN ('pending', 'confirmed') AND start_min < $6::int AND end_min > $5::int
       ) AND NOT EXISTS (
         SELECT 1 FROM blocks WHERE date = $4::text AND start_min < $6::int AND end_min > $5::int
       )
       RETURNING id`,
      [service.id, service.name, service.duration_min, date, start, end, name, phone, email, notes]
    );
    if (!rows.length) return fail("Ese horario se acaba de ocupar. Elige otro.", 409);
    return json({ ok: true, id: rows[0].id }, 201);
  } catch (e) {
    if ((e as { code?: string }).code === "23505") return fail("Ese horario se acaba de ocupar. Elige otro.", 409);
    throw e;
  }
});
