"use client";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <a href="#inicio" className="logo-chip" aria-label={site.name}>
            <img src="/assets/imagenes/logo.webp" alt={site.name} />
          </a>
          <nav className="nav">
            {nav.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary header-cta">Agenda tu cita</a>
          <button className="burger" aria-label="Abrir menú" onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8h16M4 16h16" /></svg>
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button className="mobile-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {nav.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: "inherit", fontSize: ".9rem", color: "#fff" }}>Agenda tu cita</a>
      </div>
    </>
  );
}
