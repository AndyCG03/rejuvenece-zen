"use client";
import { useState } from "react";

// Si la imagen aún no existe en /public, se muestra el fondo neutro del marco.
export default function Photo({ src, alt, className = "", children }: { src: string; alt: string; className?: string; children?: React.ReactNode }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`frame ${className}`}>
      {ok && <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />}
      {children}
    </div>
  );
}
