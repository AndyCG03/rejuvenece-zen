import Header from "@/components/Header";
import Stats from "@/components/Stats";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ContactForm from "@/components/ContactForm";
import { Arrow, Clock, Facebook, Mail, Phone, Pin, WhatsApp } from "@/components/icons";
import { faqs, gallery, nav, promos, services, site, testimonials } from "@/lib/content";

const heroWords = ["Donde", "la", "*Tecnología*", "encuentra", "tu", "Esencia."];

export default function Home() {
  return (
    <main>
      <Header />

      {/* Hero */}
      <section id="inicio" className="hero">
        <img className="hero-bg" src="/assets/imagenes/banner-faciales.jpg" alt="" aria-hidden />
        <video autoPlay muted loop playsInline preload="auto" aria-hidden poster="/assets/imagenes/banner-faciales.jpg">
          <source src="/assets/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="container hero-content">
          <p className="eyebrow fade-up" style={{ ["--d" as string]: "200ms" }}>Rejuvenece · Zen · Spa</p>
          <h1>
            {heroWords.map((w, i) => {
              const accent = w.startsWith("*");
              const text = w.replaceAll("*", "");
              return (
                <span className="word" key={i}>
                  <span style={{ ["--d" as string]: `${400 + i * 110}ms` }}>{accent ? <em>{text}</em> : text}</span>
                  {" "}
                </span>
              );
            })}
          </h1>
          <p className="lead fade-up" style={{ ["--d" as string]: "1200ms" }}>
            Un refugio de bienestar en el corazón del Centro Histórico de la CDMX. Rituales que fusionan innovación y terapia manual.
          </p>
          <div className="hero-actions fade-up" style={{ ["--d" as string]: "1450ms" }}>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Agenda tu cita por WhatsApp</a>
            <a href="#servicios" className="btn btn-ghost">Explorar servicios</a>
          </div>
        </div>
        <a href="#stats" className="scroll-cue" aria-label="Descubre más" />
      </section>

      <Stats />

      {/* Nosotros */}
      <section id="nosotros" className="section">
        <div className="container about">
          <Reveal className="about-media">
            <Photo src="/assets/imagenes/detalle-hydrafacial.jpg" alt="Tratamiento Hydrafacial" />
            <Photo src="/assets/imagenes/detalle-piedras.jpg" alt="Masaje con piedras calientes" />
            <div className="about-ring" aria-hidden />
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow">Sobre nosotros</span>
            <h2 className="title">Un ritual donde la ciencia y la <em>calma</em> se abrazan.</h2>
            <p className="lead">
              En <strong>Rejuvenece Zen Spa</strong> entendemos que el cuidado personal es un ritual. Fusionamos la innovación tecnológica con la terapia manual, creando un refugio de paz en el corazón del Centro Histórico.
            </p>
            <p className="lead" style={{ marginTop: "1rem" }}>Nuestro equipo está comprometido con resultados visibles y un trato humano excepcional.</p>
            <div className="pillars">
              <div className="pillar"><h4>Innovación</h4><p>Aparatología de última generación</p></div>
              <div className="pillar"><h4>Confianza</h4><p>Protocolos seguros y certificados</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="section bg-sand">
        <div className="container">
          <Reveal className="center">
            <span className="eyebrow">Nuestros servicios</span>
            <h2 className="title">Un catálogo diseñado para tu <em>bienestar</em> integral</h2>
            <p className="lead">Cada tratamiento se personaliza tras un diagnóstico gratuito con nuestros especialistas.</p>
          </Reveal>
          <div className="services">
            {services.map((s, i) => (
              <Reveal as="article" className="card" key={s.title} delay={i * 120}>
                <Photo src={s.image} alt={s.title}><span className="tag">{s.tag}</span></Photo>
                <div className="card-body">
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <ul>
                    {s.items.map(([name, desc]) => (
                      <li key={name}><b>{name}</b><span>{desc}</span></li>
                    ))}
                  </ul>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-arrow"><span>Consultar disponibilidad</span><Arrow /></a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="section">
        <div className="container">
          <Reveal className="center">
            <span className="eyebrow">Galería</span>
            <h2 className="title">Momentos que definen nuestro <em>Spa</em></h2>
          </Reveal>
          <div className="gallery">
            {gallery.map((g, i) => (
              <Reveal key={g.src} delay={i * 80} className={g.span ?? ""}>
                <Photo src={g.src} alt={g.alt} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
      <section className="section bg-sand" style={{ paddingBlock: "clamp(4rem, 8vw, 6rem)" }}>
        <div className="container promos">
          {promos.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="promo">
                <Photo src={p.image} alt={p.title} />
                <div className="promo-body">
                  <span className="eyebrow">Promoción</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <span className="pill">Ver más</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="section">
        <Reveal className="container center">
          <span className="eyebrow">Testimonios</span>
          <h2 className="title">Lo que nuestras clientas <em>dicen</em></h2>
        </Reveal>
        <div className="marquee">
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <figure className="quote" key={i} aria-hidden={i >= testimonials.length} style={{ margin: 0 }}>
                <div className="stars">★★★★★</div>
                <blockquote>“{t.quote}”</blockquote>
                <footer><b>{t.name}</b><span>{t.role}</span></footer>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-sand">
        <div className="container faq-grid">
          <Reveal>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="title">Todo lo que necesitas saber antes de tu <em>sesión</em>.</h2>
            <p className="lead">Nuestros protocolos siguen los más altos estándares de seguridad. Si tienes otra duda, escríbenos por WhatsApp.</p>
          </Reveal>
          <Reveal className="faq" delay={150}>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}<span className="plus" /></summary>
                <div className="faq-answer"><div><p>{f.a}</p></div></div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="section">
        <div className="container">
          <Reveal className="center">
            <span className="eyebrow">Visítanos</span>
            <h2 className="title">Encuéntranos en el <em>Centro Histórico</em></h2>
          </Reveal>
          <div className="location">
            <Reveal>
              <div className="map">
                <iframe title="Ubicación Rejuvenece Zen Spa" src={site.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <ul className="info">
                <li><Pin /><div><b>Dirección</b><span>{site.address}</span></div></li>
                <li><Phone /><div><b>Teléfono / WhatsApp</b><a href={site.phoneHref}>{site.phone}</a> · <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">{site.whatsapp}</a></div></li>
                <li><Mail /><div><b>Correo</b><a href={`mailto:${site.email}`}>{site.email}</a></div></li>
                <li><Clock /><div><b>Horario</b><span>{site.hours}</span></div></li>
              </ul>
            </Reveal>
            <Reveal delay={150}><ContactForm /></Reveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <span className="footer-logo"><img src="/assets/imagenes/logo-horizontal.png" alt={site.name} /></span>
            <p className="footer-tagline">Un ritual donde la tecnología y la calma se abrazan.</p>
          </div>
          <div>
            <h4>Explora</h4>
            <ul>{nav.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>{site.address}</li>
              <li><a href={site.phoneHref}>Tel: {site.phone}</a></li>
              <li><a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp: {site.whatsapp}</a></li>
            </ul>
          </div>
          <div>
            <h4>Síguenos</h4>
            <a className="social" href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
            <p style={{ marginTop: "1.4rem", fontSize: ".8rem" }}>Lun–Sáb 10:00–20:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">© {new Date().getFullYear()} Rejuvenece Zen Spa. Todos los derechos reservados.</div>
        </div>
      </footer>

      <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="wa" aria-label="Reserva tu cita por WhatsApp">
        <span className="wa-icon"><WhatsApp /></span>
        <span className="wa-label">Reserva tu cita</span>
      </a>
    </main>
  );
}
