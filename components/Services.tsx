"use client";
import { useState } from "react";
import { services } from "@/lib/content";
import { Arrow } from "./icons";

// Escritorio: las tres categorías en columnas. Móvil: pestañas con una tarjeta a la vez.
export default function Services() {
  const [id, setId] = useState(services[0].id);
  return (
    <>
      <div className="svc-tabs">
        <div className="tabs" role="tablist" aria-label="Categorías de servicios">
          {services.map((x) => (
            <button key={x.id} role="tab" aria-selected={x.id === id} className="tab" onClick={() => setId(x.id)}>
              {x.short}
            </button>
          ))}
        </div>
      </div>
      <div className="svc-grid">
        {services.map((s) => (
          <article key={s.id} className={`svc-card ${s.id === id ? "active" : ""}`}>
            <div className="svc-media">
              <img src={s.image} alt={s.title} loading="lazy" />
              <span className="chip">{s.tag}</span>
            </div>
            <div className="svc-body">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <ul>
                {s.items.map(([name, desc]) => (
                  <li key={name}><b>{name}</b><span>{desc}</span></li>
                ))}
              </ul>
              <a href="#reservar" className="link">Ver horarios disponibles <Arrow /></a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
