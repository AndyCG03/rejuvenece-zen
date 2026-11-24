"use client";
import { useEffect, useMemo, useState } from "react";
import { booking, services as catalog, site, waLink } from "@/lib/content";
import { addDays, durationLabel, fmtTime, longDate, monthLabel } from "@/lib/time";
import { Check, ChevronL, ChevronR, WhatsApp } from "./icons";

// Reserva 100 % en el navegador: la clienta elige servicio, día y hora, y la solicitud
// se envía por WhatsApp con el mensaje ya escrito. El spa confirma por ahí mismo.

type Service = { id: string; category: string; name: string; description: string; duration: number };

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];
const STEPS = ["Servicio", "Fecha y hora", "Tus datos"];

const SERVICES: Service[] = catalog.flatMap((cat) =>
  cat.items.map(([name, description]) => ({
    id: `${cat.id}-${name}`,
    category: cat.short,
    name,
    description,
    duration: booking.durations[name] ?? 60,
  }))
);
const CATEGORIES = [...new Set(SERVICES.map((s) => s.category))];

function nowInMexico() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: booking.timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function slotsFor(service: Service, date: string, now: { date: string; minutes: number }) {
  const earliest = date === now.date ? now.minutes + booking.leadMin : 0;
  const out: number[] = [];
  for (let t = booking.openMin; t + service.duration <= booking.closeMin; t += booking.stepMin) if (t >= earliest) out.push(t);
  return out;
}

export default function Booking() {
  const [now, setNow] = useState<{ date: string; minutes: number } | null>(null);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  // La fecha se calcula en el navegador (el HTML es estático y se genera una sola vez).
  useEffect(() => {
    const n = nowInMexico();
    setNow(n);
    const [y, m] = n.date.split("-").map(Number);
    setView({ y, m: m - 1 });
  }, []);

  const last = now ? addDays(now.date, booking.horizonDays) : "";
  const slots = useMemo(() => (service && date && now ? slotsFor(service, date, now) : null), [service, date, now]);

  const days = useMemo(() => {
    if (!view) return [];
    const first = new Date(Date.UTC(view.y, view.m, 1, 12));
    const offset = (first.getUTCDay() + 6) % 7; // semana inicia en lunes
    const count = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => new Date(Date.UTC(view.y, view.m, i + 1, 12)).toISOString().slice(0, 10))];
  }, [view]);

  const selectable = (d: string) => !!now && d >= now.date && d <= last && booking.openDays.includes(new Date(d + "T12:00:00Z").getUTCDay());
  const ym = view ? `${view.y}-${String(view.m + 1).padStart(2, "0")}` : "";
  const canPrev = !!now && ym > now.date.slice(0, 7);
  const canNext = !!now && ym < last.slice(0, 7);
  const move = (d: number) => view && setView({ y: view.y + Math.floor((view.m + d) / 12), m: (view.m + d + 12) % 12 });

  const summary = service && date && start !== null ? `${service.name} · ${longDate(date)} · ${fmtTime(start)} h` : "";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!summary) return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const msg = [
      `Hola, soy ${name}. Quiero agendar una cita desde la página:`,
      `• Servicio: ${service!.name}`,
      `• Día: ${longDate(date!)}`,
      `• Hora: ${fmtTime(start!)} h`,
      `• Mi WhatsApp: ${f.get("phone")}`,
      f.get("email") ? `• Correo: ${f.get("email")}` : "",
      f.get("notes") ? `• Notas: ${f.get("notes")}` : "",
      "¿Me confirman disponibilidad? Gracias.",
    ].filter(Boolean).join("\n");
    window.open(waLink(msg), "_blank", "noopener");
    setSent(name);
  }

  if (sent) {
    const reset = () => { setSent(null); setStep(0); setService(null); setDate(null); setStart(null); };
    return (
      <div className="bk bk-state fade-in">
        <h3>¡Gracias, {sent.split(" ")[0]}!</h3>
        <p className="bk-summary">{summary}</p>
        <p>Se abrió WhatsApp con tu solicitud lista. Solo pulsa <b>enviar</b> y te confirmamos la cita por ahí.</p>
        <div className="bk-actions">
          <button className="btn btn-outline" onClick={reset}>Agendar otra cita</button>
        </div>
        <small className="muted">¿No se abrió? Escríbenos al WhatsApp {site.whatsapp}.</small>
      </div>
    );
  }

  return (
    <div className="bk">
      <ol className="bk-steps" aria-label="Pasos para reservar">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "current" : i < step ? "done" : ""}>
            <button type="button" disabled={i > step} onClick={() => setStep(i)}>
              <span>{i < step ? <Check /> : i + 1}</span>{s}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="fade-in">
          <div className="bk-cats" role="tablist">
            {CATEGORIES.map((c) => (
              <button key={c} role="tab" aria-selected={c === category} className="tab" onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="bk-services">
            {SERVICES.filter((s) => s.category === category).map((s) => (
              <button key={s.id} className={`bk-service ${service?.id === s.id ? "selected" : ""}`} onClick={() => { setService(s); setDate(null); setStart(null); setStep(1); }}>
                <b>{s.name}</b>
                <span>{s.description}</span>
                <em>{durationLabel(s.duration)} aprox.</em>
              </button>
            ))}
          </div>
        </div>
      ) : step === 1 ? (
        <div className="bk-when fade-in">
          <div className="bk-cal">
            <div className="bk-cal-head">
              <button className="ctrl" aria-label="Mes anterior" disabled={!canPrev} onClick={() => move(-1)}><ChevronL /></button>
              <b>{view && monthLabel(view.y, view.m)}</b>
              <button className="ctrl" aria-label="Mes siguiente" disabled={!canNext} onClick={() => move(1)}><ChevronR /></button>
            </div>
            <div className="bk-grid">
              {WEEK.map((d, i) => <span key={i} className="bk-wd">{d}</span>)}
              {days.map((d, i) =>
                d ? (
                  <button key={d} disabled={!selectable(d)} aria-pressed={d === date} className={`bk-day ${d === now?.date ? "today" : ""}`} onClick={() => { setDate(d); setStart(null); }}>
                    {Number(d.slice(8))}
                  </button>
                ) : <span key={`x${i}`} />
              )}
            </div>
          </div>
          <div className="bk-slots">
            <p className="bk-label">{service?.name} · {service && durationLabel(service.duration)}</p>
            {!date ? (
              <p className="bk-hint">Elige un día en el calendario. Los domingos atendemos con cita: pídela por WhatsApp.</p>
            ) : !slots || slots.length === 0 ? (
              <p className="bk-hint">Ya no hay horarios para hoy. Prueba otro día.</p>
            ) : (
              <>
                <p className="bk-day-label">{longDate(date)}</p>
                <div className="bk-times">
                  {slots.map((t) => (
                    <button key={t} aria-pressed={t === start} onClick={() => setStart(t)}>{fmtTime(t)}</button>
                  ))}
                </div>
              </>
            )}
            <button className="btn btn-primary bk-next" disabled={start === null} onClick={() => setStep(2)}>Continuar</button>
          </div>
        </div>
      ) : (
        <form className="bk-form fade-in" onSubmit={submit}>
          <div className="bk-recap">
            <span className="bk-label">Tu cita</span>
            <b>{service?.name}</b>
            <span>{date && longDate(date)} · {start !== null && fmtTime(start)} h</span>
            <span>{service && durationLabel(service.duration)} · {site.address.split(",").slice(0, 2).join(",")}</span>
            <button type="button" className="link" onClick={() => setStep(1)}>Cambiar horario</button>
          </div>
          <div className="bk-fields">
            <div className="row">
              <div className="field"><label htmlFor="bk-name">Nombre completo</label><input id="bk-name" name="name" required autoComplete="name" minLength={2} /></div>
              <div className="field"><label htmlFor="bk-phone">WhatsApp</label><input id="bk-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="55 1234 5678" /></div>
            </div>
            <div className="field"><label htmlFor="bk-email">Correo (opcional)</label><input id="bk-email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="bk-notes">Algo que debamos saber (opcional)</label><textarea id="bk-notes" name="notes" rows={3} placeholder="Alergias, embarazo, primera visita…" /></div>
            <button className="btn btn-primary"><WhatsApp size={18} />Enviar solicitud por WhatsApp</button>
            <small>Sin pago anticipado. Te confirmamos la cita por WhatsApp.</small>
          </div>
        </form>
      )}
    </div>
  );
}
