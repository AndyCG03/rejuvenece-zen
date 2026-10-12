"use client";
import { useCallback, useEffect, useState } from "react";
import { fmtTime, longDate } from "@/lib/time";
import { api, send, toMin } from "./api";
import type { PanelProps } from "./AdminApp";

type Block = { id: number; date: string; start_min: number; end_min: number; reason: string };

export default function Blocks({ onError, notify }: PanelProps) {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [allDay, setAllDay] = useState(false);
  const load = useCallback(() => { api<{ blocks: Block[] }>("/api/admin/blocks").then((d) => setBlocks(d.blocks)).catch(onError); }, [onError]);
  useEffect(load, [load]);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await send("/api/admin/blocks", "POST", {
        date: f.get("date"),
        start: allDay ? 0 : toMin(String(f.get("start"))),
        end: allDay ? 1440 : toMin(String(f.get("end"))),
        reason: f.get("reason"),
      });
      notify("Horario bloqueado");
      form.reset();
      setAllDay(false);
      load();
    } catch (err) { onError(err); }
  }

  return (
    <section>
      <div className="adm-bar"><div><h1 className="adm-h1">Bloqueos</h1><p className="muted">Cierra horarios por vacaciones, comida, mantenimiento o días festivos. Nadie podrá reservar en ellos.</p></div></div>
      <div className="adm-two">
        <form className="adm-card adm-form" onSubmit={add}>
          <h2>Nuevo bloqueo</h2>
          <div className="field"><label htmlFor="b-date">Fecha</label><input id="b-date" type="date" name="date" required /></div>
          <label className="check"><input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />Todo el día</label>
          {!allDay && (
            <div className="row">
              <div className="field"><label htmlFor="b-start">Desde</label><input id="b-start" type="time" name="start" step={300} defaultValue="14:00" required /></div>
              <div className="field"><label htmlFor="b-end">Hasta</label><input id="b-end" type="time" name="end" step={300} defaultValue="15:00" required /></div>
            </div>
          )}
          <div className="field"><label htmlFor="b-reason">Motivo (opcional)</label><input id="b-reason" name="reason" maxLength={120} placeholder="Comida, día festivo…" /></div>
          <button className="btn btn-primary">Bloquear horario</button>
        </form>
        <div className="adm-card">
          <h2>Próximos bloqueos</h2>
          {blocks === null ? <p className="muted">Cargando…</p> : blocks.length === 0 ? <p className="adm-empty">No hay bloqueos programados.</p> : (
            <ul className="adm-list">
              {blocks.map((b) => (
                <li key={b.id}>
                  <div>
                    <b className="cap">{longDate(b.date)}</b>
                    <span>{b.start_min === 0 && b.end_min === 1440 ? "Todo el día" : `${fmtTime(b.start_min)} – ${fmtTime(b.end_min)}`}{b.reason && ` · ${b.reason}`}</span>
                  </div>
                  <button className="btn btn-ghost-danger" onClick={() => send(`/api/admin/blocks?id=${b.id}`, "DELETE").then(() => { notify("Bloqueo eliminado"); load(); }).catch(onError)}>Quitar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
