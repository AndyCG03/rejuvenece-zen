"use client";
import { useState } from "react";
import { services, site } from "@/lib/content";
import { Arrow } from "./icons";

export default function Services() {
  const [id, setId] = useState(services[0].id);
  const s = services.find((x) => x.id === id)!;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="tabs" role="tablist" aria-label="Categorías de servicios">
        {services.map((x) => (
          <button key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={x.id === id} aria-controls="service-panel" className="tab" onClick={() => setId(x.id)}>
            {x.short}
          </button>
        ))}
      </div>
      </div>
      <div className="panel" role="tabpanel" id="service-panel" aria-labelledby={`tab-${s.id}`} style={{ marginTop: "1.5rem" }}>
        <div className="panel-media">
          <img key={s.image} className="fade-in" src={s.image} alt={s.title} />
          <span className="chip">{s.tag}</span>
        </div>
        <div className="panel-body fade-in" key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <ul className="treatments">
            {s.items.map(([name, desc]) => (
              <li key={name}><b>{name}</b><span>{desc}</span></li>
            ))}
          </ul>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="link">Consultar disponibilidad <Arrow /></a>
        </div>
      </div>
    </>
  );
}
