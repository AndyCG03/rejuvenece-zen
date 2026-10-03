"use client";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";
import { Close, Menu, Phone } from "./icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="container nav-inner">
          <a href="#inicio" className="brand" aria-label={site.name}>
            <img src="/assets/imagenes/logo.webp" alt={site.name} width={140} height={46} />
          </a>
          <nav className="menu" aria-label="Principal">
            {nav.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href ? "active" : ""}>{l.label}</a>
            ))}
          </nav>
          <div className="nav-actions">
            <a href={site.phoneHref} className="nav-phone"><Phone />{site.phone}</a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Agenda tu cita</a>
            <button className="burger" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div className={`drawer ${open ? "open" : ""}`}>
        {nav.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Agenda tu cita por WhatsApp</a>
        <a href={site.phoneHref} className="btn btn-outline">Llamar al {site.phone}</a>
      </div>
    </>
  );
}
