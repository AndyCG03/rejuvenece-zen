"use client";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 2200;
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div ref={ref} className="stat-num">{prefix}{n.toLocaleString("es-MX")}{suffix}</div>;
}

export default function Stats() {
  return (
    <section className="stats" id="stats">
      <div className="container stats-grid">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <Counter {...s} />
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
