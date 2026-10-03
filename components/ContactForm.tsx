"use client";
import { services } from "@/lib/content";

// Arma el mensaje y lo abre en WhatsApp (no requiere backend).
export default function ContactForm() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const msg = `Hola, soy ${d.get("nombre")}. Me interesa: ${d.get("servicio")}.\nTel: ${d.get("telefono")} · Correo: ${d.get("correo")}\n${d.get("mensaje") || ""}`;
    window.open(`https://wa.me/525620049792?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }
  const options = services.flatMap((s) => s.items.map(([name]) => name));
  return (
    <form className="form" onSubmit={onSubmit}>
      <h3>Reserva una consulta</h3>
      <p>Te respondemos en menos de 24 horas.</p>
      <div className="row">
        <div className="field"><label htmlFor="nombre">Nombre</label><input id="nombre" name="nombre" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="telefono">Teléfono</label><input id="telefono" name="telefono" type="tel" required autoComplete="tel" /></div>
      </div>
      <div className="field"><label htmlFor="correo">Correo</label><input id="correo" name="correo" type="email" required autoComplete="email" /></div>
      <div className="field">
        <label htmlFor="servicio">Servicio de interés</label>
        <select id="servicio" name="servicio" defaultValue={options[0]}>
          {options.map((o) => <option key={o}>{o}</option>)}
          <option>Otro</option>
        </select>
      </div>
      <div className="field"><label htmlFor="mensaje">Mensaje (opcional)</label><textarea id="mensaje" name="mensaje" rows={3} /></div>
      <button type="submit" className="btn btn-primary">Enviar por WhatsApp</button>
      <small>Se abrirá WhatsApp con tu mensaje listo para enviar.</small>
    </form>
  );
}
