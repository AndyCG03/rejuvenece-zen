import { services as catalog } from "@/lib/content";

type Query = <T = Record<string, unknown>>(text: string, params?: unknown[]) => Promise<T[]>;

let client: Query | null = null;
let ready: Promise<void> | null = null;

// Neon en producción (DATABASE_URL, lo agrega la integración de Vercel); PGlite embebido en local.
async function getClient(): Promise<Query> {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    client = (text, params = []) => sql.query(text, params) as never;
  } else {
    if (process.env.VERCEL) throw new Error("Falta DATABASE_URL: conecta la base de Neon al proyecto en Vercel.");
    const { PGlite } = await import("@electric-sql/pglite");
    const db = new PGlite(process.env.PGLITE_DIR ?? "./.pglite");
    client = async (text, params = []) => (await db.query(text, params)).rows as never;
  }
  return client;
}

const schema = [
  `CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    duration_min INT NOT NULL,
    price_mxn INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS hours (
    weekday INT PRIMARY KEY,
    is_open BOOLEAN NOT NULL,
    open_min INT NOT NULL,
    close_min INT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS blocks (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    start_min INT NOT NULL,
    end_min INT NOT NULL,
    reason TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    service_id TEXT NOT NULL REFERENCES services(id),
    service_name TEXT NOT NULL,
    duration_min INT NOT NULL,
    date TEXT NOT NULL,
    start_min INT NOT NULL,
    end_min INT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (date)`,
  `CREATE INDEX IF NOT EXISTS blocks_date_idx ON blocks (date)`,
  // Respaldo contra dos reservas exactamente en el mismo inicio.
  `CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot ON appointments (date, start_min) WHERE status IN ('pending', 'confirmed')`,
];

// Duraciones iniciales (editables desde el backoffice).
const durations: Record<string, number> = {
  EMSZERO: 30, Radiofrecuencia: 45, "Cavitación Ultrasónica": 45, Presoterapia: 40,
  Hydrafacial: 60, "Peeling Químico": 45, Dermapen: 60, "Masaje Kobido": 60,
  "Masaje Terapéutico": 60, "Piedras Calientes": 75, Aromaterapia: 60, "Drenaje Linfático": 60,
};

export const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function setup(q: Query) {
  for (const stmt of schema) await q(stmt);
  const [{ n }] = await q<{ n: number }>("SELECT COUNT(*)::int AS n FROM services");
  if (n === 0) {
    let sort = 0;
    for (const cat of catalog) {
      for (const [name, desc] of cat.items) {
        await q(
          "INSERT INTO services (id, category, name, description, duration_min, sort) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING",
          [slug(name), cat.short, name, desc, durations[name] ?? 60, sort++]
        );
      }
    }
  }
  const [{ h }] = await q<{ h: number }>("SELECT COUNT(*)::int AS h FROM hours");
  if (h === 0) {
    // 0 = domingo. Lunes a sábado 10:00–20:00; domingo cerrado (se abre desde el backoffice).
    for (let d = 0; d < 7; d++) {
      await q("INSERT INTO hours (weekday, is_open, open_min, close_min) VALUES ($1, $2, 600, 1200) ON CONFLICT DO NOTHING", [d, d !== 0]);
    }
  }
}

export async function db(): Promise<Query> {
  const q = await getClient();
  if (!ready) ready = setup(q).catch((e) => { ready = null; throw e; });
  await ready;
  return q;
}
