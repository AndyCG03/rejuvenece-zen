"use client";
import { useEffect, useState } from "react";
import { testimonials } from "@/lib/content";
import { ChevronL, ChevronR } from "./icons";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure className="quote-card" style={{ margin: 0 }} aria-live="polite">
        <span className="quote-mark" aria-hidden>“</span>
        <blockquote key={i} className="fade-in">{t.quote}</blockquote>
        <figcaption className="quote-foot">
          <div className="person fade-in" key={`p${i}`}>
            <span className="avatar" aria-hidden>{t.name.split(" ").map((w) => w[0]).join("")}</span>
            <div><b>{t.name}</b><span>{t.role} · <span className="stars">★★★★★</span></span></div>
          </div>
          <div className="controls">
            <button className="ctrl" aria-label="Testimonio anterior" onClick={() => go(-1)}><ChevronL /></button>
            <button className="ctrl" aria-label="Siguiente testimonio" onClick={() => go(1)}><ChevronR /></button>
          </div>
        </figcaption>
      </figure>
      <div className="dots">
        {testimonials.map((x, n) => (
          <button key={x.name} className="dot" aria-label={`Testimonio de ${x.name}`} aria-current={n === i} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
}
