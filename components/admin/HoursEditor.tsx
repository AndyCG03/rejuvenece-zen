"use client";
import { useEffect, useState } from "react";
import { fmtTime } from "@/lib/time";
import { api, send, toMin } from "./api";
import type { PanelProps } from "./AdminApp";

type Hours = { weekday: number; is_open: boolean; open_min: number; close_min: number };
const NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function HoursEditor({ onError, notify }: PanelProps) {
  const [hours, setHours] = useState<Hours[] | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api<{ hours: Hours[] }>("/api/admin/hours").then((d) => setHours(d.hours)).catch(onError); }, [onError]);

  const set = (wd: number, patch: Partial<Hours>) => setHours((h) => h!.map((x) => (x.weekday === wd ? { ...x, ...patch } : x)));

  async function save() {
    setSaving(true);
    try { await send("/api/admin/hours", "PUT", { hours }); notify("Horario guardado"); } catch (e) { onError(e); } finally { setSaving(false); }
  }

  return (
    <section>
      <div className="adm-bar"><div><h1 className="adm-h1">Horario de atención</h1><p className="muted">Define qué días y en qué horario se puede reservar en línea.</p></div></div>
      {hours === null ? <p className="muted">Cargando…</p> : (
        <div className="adm-card">
          <ul className="adm-hours">
            {ORDER.map((wd) => {
              const h = hours.find((x) => x.weekday === wd)!;
              return (
                <li key={wd}>
                  <label className="check"><input type="checkbox" checked={h.is_open} onChange={(e) => set(wd, { is_open: e.target.checked })} /><b>{NAMES[wd]}</b></label>
                  {h.is_open ? (
                    <div className="adm-hours-range">
                      <input type="time" step={1800} aria-label={`Apertura ${NAMES[wd]}`} value={fmtTime(h.open_min)} onChange={(e) => e.target.value && set(wd, { open_min: toMin(e.target.value) })} />
                      <span>a</span>
                      <input type="time" step={1800} aria-label={`Cierre ${NAMES[wd]}`} value={fmtTime(h.close_min)} onChange={(e) => e.target.value && set(wd, { close_min: toMin(e.target.value) })} />
                    </div>
                  ) : <span className="muted">Cerrado</span>}
                </li>
              );
            })}
          </ul>
          <button className="btn btn-primary" disabled={saving} onClick={save}>{saving ? "Guardando…" : "Guardar horario"}</button>
        </div>
      )}
    </section>
  );
}
