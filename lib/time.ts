export const fmtTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
export const toDate = (s: string) => new Date(s + "T12:00:00Z");
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (s: string, n: number) => {
  const d = toDate(s);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};
export const longDate = (s: string) =>
  toDate(s).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
export const shortDate = (s: string) =>
  toDate(s).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
export const monthLabel = (y: number, m: number) =>
  new Date(Date.UTC(y, m, 1, 12)).toLocaleDateString("es-MX", { month: "long", year: "numeric", timeZone: "UTC" });
export const durationLabel = (m: number) => (m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m / 60} h`);
