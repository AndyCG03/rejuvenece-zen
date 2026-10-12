"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, durationLabel, fmtTime, iso, longDate, shortDate } from "@/lib/time";
import { ChevronL, ChevronR, WhatsApp } from "../icons";
import { api, send, toMin } from "./api";
import type { PanelProps } from "./AdminApp";

type Appt = {
  id: number; service_name: string; duration_min: number; date: string; start_min: number; end_min: number;
  customer_name: string; phone: string; email: string; notes: string; status: string; created_at: string;
};

export const STATUS: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada", no_show: "No asistió" };

const mondayOf = (d: string) => addDays(d, -((new Date(d + "T12:00:00Z").getUTCDay() + 6) % 7));
const todayMx = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(new Date());
const waNumber = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.length === 10 ? `52${d}` : d;
};

export default function Agenda({ onError, notify }: PanelProps) {
  const today = todayMx();
  const [week, setWeek] = useState(mondayOf(today));
  const [items, setItems] = useState<Appt[] | null>(null);
  const [pending, setPending] = useState(0);
  const [filter, setFilter] = useState<"all" | "pending" | "active">("active");
  const [editing, setEditing] = useState<number | null>(null);

  const load = useCallback(() => {
    api<{ appointments: Appt[]; pending: number }>(`/api/admin/appointments?from=${week}&to=${addDays(week, 6)}`)
      .then((d) => { setItems(d.appointments); setPending(d.pending); })
      .catch(onError);
  }, [week, onError]);
  useEffect(load, [load]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week, i)), [week]);
  const visible = (items ?? []).filter((a) =>
    filter === "pending" ? a.status === "pending" : filter === "active" ? a.status !== "cancelled" : true
  );

  async function update(a: Appt, body: Record<string, unknown>, msg: string) {
    try {
      await send(`/api/admin/appointments/${a.id}`, "PATCH", body);
      notify(msg);
      setEditing(null);
      load();
    } catch (e) {
      onError(e);
    }
  }

  const confirmText = (a: Appt) =>
    encodeURIComponent(`Hola ${a.customer_name.split(" ")[0]}, te confirmamos tu cita en Rejuvenece Zen Spa: ${a.service_name}, ${longDate(a.date)} a las ${fmtTime(a.start_min)} h. Te esperamos en Luis Moya 51, Centro. ¡Gracias!`);

  return (
    <section>
      <div className="adm-bar">
        <div>
          <h1 className="adm-h1">Agenda</h1>
          <p className="muted">{pending ? `${pending} ${pending === 1 ? "cita pendiente" : "citas pendientes"} por confirmar` : "Sin citas pendientes por confirmar"}</p>
        </div>
        <div className="adm-week">
          <button className="ctrl" aria-label="Semana anterior" onClick={() => setWeek(addDays(week, -7))}><ChevronL /></button>
          <button className="btn btn-outline" onClick={() => setWeek(mondayOf(today))}>Hoy</button>
          <button className="ctrl" aria-label="Semana siguiente" onClick={() => setWeek(addDays(week, 7))}><ChevronR /></button>
          <span className="adm-range">{shortDate(week)} – {shortDate(addDays(week, 6))}</span>
        </div>
      </div>

      <div className="adm-filters" role="tablist">
        {([["active", "Activas"], ["pending", "Pendientes"], ["all", "Todas"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={filter === k} className="tab" onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      {items === null ? <p className="muted">Cargando citas…</p> : (
        <div className="adm-days">
          {days.map((d) => {
            const list = visible.filter((a) => a.date === d);
            return (
              <div key={d} className={`adm-day ${d === today ? "is-today" : ""}`}>
                <h2>{shortDate(d)}{d === today && <span className="chip-mini">Hoy</span>}</h2>
                {list.length === 0 ? <p className="adm-empty">Sin citas</p> : list.map((a) => (
                  <article key={a.id} className={`appt st-${a.status}`}>
                    <div className="appt-time"><b>{fmtTime(a.start_min)}</b><span>{fmtTime(a.end_min)}</span></div>
                    <div className="appt-body">
                      <div className="appt-head">
                        <b>{a.customer_name}</b>
                        <span className={`pill-st st-${a.status}`}>{STATUS[a.status] ?? a.status}</span>
                      </div>
                      <p>{a.service_name} · {durationLabel(a.duration_min)}</p>
                      <p className="appt-contact">
                        <a href={`https://wa.me/${waNumber(a.phone)}`} target="_blank" rel="noopener noreferrer"><WhatsApp size={14} />{a.phone}</a>
                        {a.email && <a href={`mailto:${a.email}`}>{a.email}</a>}
                      </p>
                      {a.notes && <p className="appt-notes">“{a.notes}”</p>}

                      {editing === a.id ? (
                        <form className="appt-edit" onSubmit={(e) => {
                          e.preventDefault();
                          const f = new FormData(e.currentTarget);
                          update(a, { date: f.get("date"), start: toMin(String(f.get("time"))) }, "Cita reagendada");
                        }}>
                          <input type="date" name="date" defaultValue={a.date} required aria-label="Nueva fecha" />
                          <input type="time" name="time" step={300} defaultValue={fmtTime(a.start_min)} required aria-label="Nueva hora" />
                          <button className="btn btn-primary">Guardar</button>
                          <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancelar</button>
                        </form>
                      ) : (
                        <div className="appt-actions">
                          {a.status === "pending" && (
                            <>
                              <button className="btn btn-primary" onClick={() => update(a, { status: "confirmed" }, "Cita confirmada")}>Confirmar</button>
                              <a className="btn btn-outline" href={`https://wa.me/${waNumber(a.phone)}?text=${confirmText(a)}`} target="_blank" rel="noopener noreferrer"
                                onClick={() => update(a, { status: "confirmed" }, "Cita confirmada")}><WhatsApp size={16} />Confirmar y avisar</a>
                            </>
                          )}
                          {a.status === "confirmed" && (
                            <>
                              <button className="btn btn-primary" onClick={() => update(a, { status: "completed" }, "Marcada como completada")}>Completada</button>
                              <button className="btn btn-outline" onClick={() => update(a, { status: "no_show" }, "Marcada como no asistió")}>No asistió</button>
                            </>
                          )}
                          {(a.status === "pending" || a.status === "confirmed") && (
                            <>
                              <button className="btn btn-outline" onClick={() => setEditing(a.id)}>Reagendar</button>
                              <button className="btn btn-ghost-danger" onClick={() => update(a, { status: "cancelled" }, "Cita cancelada")}>Cancelar</button>
                            </>
                          )}
                          {(a.status === "cancelled" || a.status === "no_show") && (
                            <button className="btn btn-outline" onClick={() => update(a, { status: "pending" }, "Cita reactivada")}>Reactivar</button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            );
          })}
        </div>
      )}
      <p className="muted adm-foot">Semana del {longDate(week)} · Hora del centro de México · {iso(new Date()).slice(0, 4)}</p>
    </section>
  );
}
