"use client";
import { useState } from "react";
import { faqs } from "@/lib/content";
import { Plus } from "./icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="acc">
      {faqs.map((f, n) => {
        const isOpen = open === n;
        return (
          <div key={f.q} className={`acc-item ${isOpen ? "open" : ""}`}>
            <button className="acc-btn" aria-expanded={isOpen} aria-controls={`faq-${n}`} id={`faq-btn-${n}`} onClick={() => setOpen(isOpen ? null : n)}>
              {f.q}
              <span className="acc-icon"><Plus /></span>
            </button>
            <div className="acc-panel" id={`faq-${n}`} role="region" aria-labelledby={`faq-btn-${n}`}>
              <div><p>{f.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
