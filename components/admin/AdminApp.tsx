"use client";
import { useCallback, useEffect, useState } from "react";
import Agenda from "./Agenda";
import Blocks from "./Blocks";
import HoursEditor from "./HoursEditor";
import ServicesEditor from "./ServicesEditor";
import { api, AuthError, send } from "./api";

const TABS = [
  { id: "agenda", label: "Agenda" },
  { id: "bloqueos", label: "Bloqueos" },
  { id: "horario", label: "Horario" },
  { id: "servicios", label: "Servicios" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("agenda");
  const [toast, setToast] = useState("");

  useEffect(() => {
    api("/api/admin/hours").then(() => setAuthed(true)).catch(() => setAuthed(false));
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }, []);
  const onError = useCallback((e: unknown) => {
    if (e instanceof AuthError) setAuthed(false);
    else notify(e instanceof Error ? e.message : "Algo salió mal.");
  }, [notify]);

  if (authed === null) return <div className="adm-center"><p className="muted">Cargando…</p></div>;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="container adm-top-inner">
          <a href="/" className="adm-brand"><img src="/assets/imagenes/logo.webp" alt="Rejuvenece Zen Spa" /><span>Backoffice</span></a>
          <nav className="tabs" role="tablist" aria-label="Secciones">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className="tab" onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </nav>
          <button className="btn btn-outline adm-logout" onClick={() => send("/api/admin/logout", "POST").finally(() => setAuthed(false))}>Salir</button>
        </div>
      </header>
      <main className="container adm-main">
        {tab === "agenda" && <Agenda onError={onError} notify={notify} />}
        {tab === "bloqueos" && <Blocks onError={onError} notify={notify} />}
        {tab === "horario" && <HoursEditor onError={onError} notify={notify} />}
        {tab === "servicios" && <ServicesEditor onError={onError} notify={notify} />}
      </main>
      {toast && <div className="adm-toast" role="status">{toast}</div>}
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await send("/api/admin/login", "POST", { password: new FormData(e.currentTarget).get("password") });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="adm-center">
      <form className="adm-login" onSubmit={submit}>
        <img src="/assets/imagenes/logo.webp" alt="Rejuvenece Zen Spa" />
        <h1>Backoffice</h1>
        <p className="muted">Gestiona citas, horarios y servicios.</p>
        <div className="field"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" required autoFocus autoComplete="current-password" /></div>
        {error && <p className="bk-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
      </form>
    </div>
  );
}

export type PanelProps = { onError: (e: unknown) => void; notify: (msg: string) => void };
