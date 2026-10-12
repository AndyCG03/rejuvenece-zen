"use client";
import { useEffect, useState } from "react";
import { api, send } from "./api";
import type { PanelProps } from "./AdminApp";

type Service = { id: string; category: string; name: string; duration_min: number; price_mxn: number | null; active: boolean };

export default function ServicesEditor({ onError, notify }: PanelProps) {
  const [services, setServices] = useState<Service[] | null>(null);
  useEffect(() => { api<{ services: Service[] }>("/api/admin/services").then((d) => setServices(d.services)).catch(onError); }, [onError]);

  async function save(s: Service) {
    try { await send("/api/admin/services", "PATCH", s); notify(`${s.name} actualizado`); } catch (e) { onError(e); }
  }
  const set = (id: string, patch: Partial<Service>) => setServices((list) => list!.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const categories = [...new Set(services?.map((s) => s.category))];
  return (
    <section>
      <div className="adm-bar"><div><h1 className="adm-h1">Servicios</h1><p className="muted">La duración define cuánto tiempo ocupa cada cita en la agenda. Los servicios ocultos no aparecen en la reserva en línea.</p></div></div>
      {services === null ? <p className="muted">Cargando…</p> : categories.map((c) => (
        <div key={c} className="adm-card adm-svc-group">
          <h2>{c}</h2>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Servicio</th><th>Duración (min)</th><th>Precio (MXN)</th><th>Visible</th><th /></tr></thead>
              <tbody>
                {services.filter((s) => s.category === c).map((s) => (
                  <tr key={s.id}>
                    <td><b>{s.name}</b></td>
                    <td><input type="number" min={15} max={300} step={5} value={s.duration_min} onChange={(e) => set(s.id, { duration_min: Number(e.target.value) })} aria-label={`Duración de ${s.name}`} /></td>
                    <td><input type="number" min={0} step={50} placeholder="—" value={s.price_mxn ?? ""} onChange={(e) => set(s.id, { price_mxn: e.target.value === "" ? null : Number(e.target.value) })} aria-label={`Precio de ${s.name}`} /></td>
                    <td><input type="checkbox" checked={s.active} onChange={(e) => set(s.id, { active: e.target.checked })} aria-label={`Mostrar ${s.name}`} /></td>
                    <td><button className="btn btn-outline" onClick={() => save(s)}>Guardar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}
