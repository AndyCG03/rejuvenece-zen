"use client";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/content";
import { addDays, durationLabel, fmtTime, longDate, monthLabel } from "@/lib/time";
import { Check, ChevronL, ChevronR, WhatsApp } from "./icons";

type Service = { id: string; category: string; name: string; description: string; duration_min: number; price_mxn: number | null };
type Config = { services: Service[]; openDays: number[]; today: string; horizonDays: number };

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];
const STEPS = ["Servicio", "Fecha y hora", "Tus datos"];

export default function Booking() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<number[] | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ name: string; id?: number } | null>(null);
  const [notified, setNotified] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("/api/booking/config")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((c: Config) => {
        setConfig(c);
        setCategory(c.services[0]?.category ?? "");
        const [y, m] = c.today.split("-").map(Number);
        setView({ y, m: m - 1 });
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (!service || !date) return;
    setSlots(null);
    setStart(null);
    const ctrl = new AbortController();
    fetch(`/api/booking/availability?service=${service.id}&date=${date}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => {});
    return () => ctrl.abort();
  }, [service, date, refresh]);

  const categories = useMemo(() => [...new Set(config?.services.map((s) => s.category))], [config]);
  const last = config ? addDays(config.today, config.horizonDays) : "";

  const days = useMemo(() => {
    if (!view) return [];
    const first = new Date(Date.UTC(view.y, view.m, 1, 12));
    const offset = (first.getUTCDay() + 6) % 7; // semana inicia en lunes
    const count = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => new Date(Date.UTC(view.y, view.m, i + 1, 12)).toISOString().slice(0, 10))];
  }, [view]);

  const selectable = (d: string) => !!config && d >= config.today && d <= last && config.openDays.includes(new Date(d + "T12:00:00Z").getUTCDay());
  const canPrev = !!view && !!config && `${view.y}-${String(view.m + 1).padStart(2, "0")}` > config.today.slice(0, 7);
  const canNext = !!view && !!config && `${view.y}-${String(view.m + 1).padStart(2, "0")}` < last.slice(0, 7);
  const move = (d: number) => view && setView({ y: view.y + Math.floor((view.m + d) / 12), m: (view.m + d + 12) % 12 });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service || !date || start === null) return;
    setSending(true);
    setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, service: service.id, date, start }) }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setSending(false);
    if (!res?.ok) {
      setError(data?.error ?? "No pudimos registrar tu cita. Revisa tu conexión e inténtalo de nuevo.");
      if (res?.status === 409) { setStep(1); setRefresh((n) => n + 1); }
      return;
    }
    setNotified(false);
    setDone({ name: String(f.name), id: data?.id });
  }

  const summary = service && date && start !== null ? `${service.name} · ${longDate(date)} · ${fmtTime(start)} h` : "";
  const waText = summary && done ? encodeURIComponent(`Hola, soy ${done.name}. Acabo de reservar en la web${done.id ? ` (folio #${done.id})` : ""}: ${summary}. Quedo atenta a la confirmación.`) : "";

  if (loadError) {
    return (
      <div className="bk bk-state">
        <p>La agenda en línea no está disponible en este momento.</p>
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><WhatsApp size={18} />Agenda por WhatsApp</a>
      </div>
    );
  }

  if (done) {
    const reset = () => { setDone(null); setStep(0); setService(null); setDate(null); setStart(null); };
    return (
      <div className="bk bk-state fade-in">
        <ol className="bk-finish" aria-label="Pasos finales">
          <li className="done"><span><Check /></span>Solicitud registrada</li>
          <li className={notified ? "done" : "current"}><span>{notified ? <Check /> : 2}</span>Avísanos por WhatsApp</li>
        </ol>
        <h3>{notified ? `¡Gracias, ${done.name.split(" ")[0]}!` : `Último paso, ${done.name.split(" ")[0]}`}</h3>
        <p className="bk-summary">{summary}{done.id ? ` · Folio #${done.id}` : ""}</p>
        {notified ? (
          <p>Recibimos tu aviso. Te confirmaremos la cita por WhatsApp en breve.</p>
        ) : (
          <div className="bk-required" role="alert">
            <b>Tu cita aún no está apartada.</b>
            <span>Para confirmarla es <b>obligatorio</b> enviarnos el mensaje por WhatsApp. Ya está escrito, solo pulsa enviar.</span>
          </div>
        )}
        <div className="bk-actions">
          <a href={`https://wa.me/525620049792?text=${waText}`} target="_blank" rel="noopener noreferrer"
            className={`btn btn-primary ${notified ? "" : "btn-xl pulse"}`} onClick={() => setNotified(true)}>
            <WhatsApp size={20} />{notified ? "Abrir WhatsApp de nuevo" : "Enviar aviso por WhatsApp"}
          </a>
          {notified && <button className="btn btn-outline" onClick={reset}>Agendar otra cita</button>}
        </div>
        {!notified && <small className="muted">WhatsApp {site.whatsapp}</small>}
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

      {!config ? (
        <div className="bk-skeleton" aria-busy="true">Cargando agenda…</div>
      ) : step === 0 ? (
        <div className="fade-in">
          <div className="bk-cats" role="tablist">
            {categories.map((c) => (
              <button key={c} role="tab" aria-selected={c === category} className="tab" onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="bk-services">
            {config.services.filter((s) => s.category === category).map((s) => (
              <button key={s.id} className={`bk-service ${service?.id === s.id ? "selected" : ""}`} onClick={() => { setService(s); setDate(null); setStart(null); setStep(1); }}>
                <b>{s.name}</b>
                <span>{s.description}</span>
                <em>{durationLabel(s.duration_min)}{s.price_mxn ? ` · $${s.price_mxn.toLocaleString("es-MX")}` : ""}</em>
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
                  <button key={d} disabled={!selectable(d)} aria-pressed={d === date} className={`bk-day ${d === config.today ? "today" : ""}`} onClick={() => setDate(d)}>
                    {Number(d.slice(8))}
                  </button>
                ) : <span key={`x${i}`} />
              )}
            </div>
          </div>
          <div className="bk-slots">
            <p className="bk-label">{service?.name} · {service && durationLabel(service.duration_min)}</p>
            {!date ? (
              <p className="bk-hint">Elige un día en el calendario para ver los horarios libres.</p>
            ) : slots === null ? (
              <p className="bk-hint">Buscando horarios…</p>
            ) : slots.length === 0 ? (
              <p className="bk-hint">No quedan horarios libres el {longDate(date)}. Prueba otro día.</p>
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
            {error && <p className="bk-error" role="alert">{error}</p>}
            <button className="btn btn-primary bk-next" disabled={start === null} onClick={() => { setError(""); setStep(2); }}>Continuar</button>
          </div>
        </div>
      ) : (
        <form className="bk-form fade-in" onSubmit={submit}>
          <div className="bk-recap">
            <span className="bk-label">Tu cita</span>
            <b>{service?.name}</b>
            <span>{date && longDate(date)} · {start !== null && fmtTime(start)} h</span>
            <span>{service && durationLabel(service.duration_min)} · {site.address.split(",").slice(0, 2).join(",")}</span>
            <button type="button" className="link" onClick={() => setStep(1)}>Cambiar horario</button>
          </div>
          <div className="bk-fields">
            <div className="row">
              <div className="field"><label htmlFor="bk-name">Nombre completo</label><input id="bk-name" name="name" required autoComplete="name" minLength={2} /></div>
              <div className="field"><label htmlFor="bk-phone">WhatsApp</label><input id="bk-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="55 1234 5678" /></div>
            </div>
            <div className="field"><label htmlFor="bk-email">Correo (opcional)</label><input id="bk-email" name="email" type="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="bk-notes">Algo que debamos saber (opcional)</label><textarea id="bk-notes" name="notes" rows={3} placeholder="Alergias, embarazo, primera visita…" /></div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
            {error && <p className="bk-error" role="alert">{error}</p>}
            <button className="btn btn-primary" disabled={sending}>{sending ? "Reservando…" : "Solicitar cita"}</button>
            <small>Sin pago anticipado. Te confirmamos por WhatsApp.</small>
          </div>
        </form>
      )}
    </div>
  );
}
