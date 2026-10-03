"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

export default function Reveal({ children, as: Tag = "div", delay = 0, className = "" }: { children: ReactNode; as?: ElementType; delay?: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
