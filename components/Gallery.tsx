"use client";
import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/lib/content";
import { ChevronL, ChevronR, Close } from "./icons";

export default function Gallery() {
  const [i, setI] = useState<number | null>(null);
  const go = useCallback((d: number) => setI((v) => (v === null ? v : (v + d + gallery.length) % gallery.length)), []);

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [i, go]);

  return (
    <>
      <div className="gallery">
        {gallery.map((g, n) => (
          <button key={g.src} className={g.span ?? ""} onClick={() => setI(n)} aria-label={`Ver foto: ${g.alt}`}>
            <img src={g.src} alt={g.alt} loading="lazy" />
          </button>
        ))}
      </div>
      {i !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[i].alt} onClick={() => setI(null)}>
          <img src={gallery[i].src} alt={gallery[i].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn lb-close" aria-label="Cerrar" onClick={() => setI(null)}><Close /></button>
          <button className="lb-btn lb-prev" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronL /></button>
          <button className="lb-btn lb-next" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronR /></button>
          <span className="lb-count">{i + 1} / {gallery.length}</span>
        </div>
      )}
    </>
  );
}
