"use client";
import { site } from "@/lib/content";

// Arma el mensaje y lo abre en WhatsApp (no requiere backend).
export default function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const msg = `Hola, soy ${d.get("nombre")}. Me interesa: ${d.get("servicio")}.\nTel: ${d.get("telefono")} · Correo: ${d.get("correo")}\n${d.get("mensaje") || ""}`;
    window.open(`https://wa.me/525620049792?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }
  return (
    <form className="form" onSubmit={onSubmit}>
      <h3>Reserva una consulta</h3>
      <p>Te contactamos en menos de 24 hrs.</p>
      <div className="form-row">
        <label className="field"><input name="nombre" required placeholder=" " /><span>Nombre</span></label>
        <label className="field"><input name="telefono" type="tel" required placeholder=" " /><span>Teléfono</span></label>
      </div>
      <label className="field"><input name="correo" type="email" required placeholder=" " /><span>Correo</span></label>
      <label className="field">
        <select name="servicio" defaultValue="Hydrafacial">
          {["Hydrafacial", "EMSZERO", "Masaje terapéutico", "Aparatología corporal", "Otro"].map((o) => <option key={o}>{o}</option>)}
        </select>
        <span>Servicio de interés</span>
      </label>
      <label className="field"><textarea name="mensaje" rows={3} placeholder=" " /><span>Mensaje</span></label>
      <button type="submit" className="btn btn-primary">Enviar por WhatsApp</button>
      <noscript>Escríbenos a {site.email}</noscript>
    </form>
  );
}
