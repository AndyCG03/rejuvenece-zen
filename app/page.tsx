import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";
import { Arrow, Check, Clock, Facebook, Mail, Phone, Pin, WhatsApp } from "@/components/icons";
import { nav, promos, site, stats, testimonials, trust } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <Header />

      {/* Inicio */}
      <section id="inicio" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal>
              <h1 className="h1">Donde la <em>tecnología</em> encuentra tu esencia.</h1>
              <p className="lead">
                Un refugio de bienestar en el corazón del Centro Histórico. Rituales que fusionan innovación y terapia manual, personalizados tras un diagnóstico gratuito.
              </p>
              <div className="hero-cta">
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><WhatsApp size={18} />Agenda tu cita</a>
                <a href="#servicios" className="btn btn-outline">Ver servicios</a>
              </div>
              <ul className="trust">
                {trust.map((t) => <li key={t}><Check />{t}</li>)}
              </ul>
            </Reveal>
          </div>
          <Reveal className="hero-media" delay={120}>
            <div className="hero-frame">
              <video autoPlay muted loop playsInline poster="/assets/imagenes/banner-faciales.jpg" aria-hidden>
                <source src="/assets/video/hero.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-thumb">
              <img src="/assets/imagenes/detalle-piedras.jpg" alt="Masaje con piedras calientes" />
            </div>
            <div className="hero-badge float">
              <div>
                <strong>+500</strong>
                <span>clientas felices</span>
              </div>
              <span className="stars" aria-label="5 de 5 estrellas">★★★★★</span>
            </div>
          </Reveal>
        </div>

        <div className="container" style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="section tint">
        <div className="container about">
          <Reveal className="about-media">
            <img src="/assets/imagenes/detalle-hydrafacial.jpg" alt="Tratamiento Hydrafacial" loading="lazy" />
            <img src="/assets/imagenes/gallery-2.jpg" alt="Detalle de cabina con toallas y tulipanes" loading="lazy" />
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow">Sobre nosotros</span>
            <h2 className="h2">Un ritual donde la ciencia y la <em>calma</em> se abrazan.</h2>
            <p className="lead">
              En <strong>Rejuvenece Zen Spa</strong> entendemos que el cuidado personal es un ritual. Fusionamos la innovación tecnológica con la terapia manual para crear un refugio de paz en el Centro Histórico.
            </p>
            <p className="lead">Nuestro equipo está comprometido con resultados visibles y un trato humano excepcional.</p>
            <div className="values">
              <div className="value"><h3>Innovación</h3><p>Aparatología de última generación.</p></div>
              <div className="value"><h3>Confianza</h3><p>Protocolos seguros y certificados.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="section">
        <div className="container">
          <Reveal className="head center">
            <span className="eyebrow">Nuestros servicios</span>
            <h2 className="h2">Un catálogo pensado para tu <em>bienestar</em> integral</h2>
            <p className="lead">Elige una categoría. Cada tratamiento se personaliza tras un diagnóstico gratuito.</p>
          </Reveal>
          <Reveal delay={100}>
            <Services />
          </Reveal>
        </div>
      </section>

      {/* Galería */}
      <section className="section tint">
        <div className="container">
          <Reveal className="head split">
            <div>
              <span className="eyebrow">Galería</span>
              <h2 className="h2">Momentos que definen nuestro <em>spa</em></h2>
            </div>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="link">Más en Facebook <Arrow /></a>
          </Reveal>
          <Reveal delay={100}>
            <Gallery />
          </Reveal>
        </div>
      </section>

      {/* Promociones */}
      <section className="section">
        <div className="container">
          <Reveal className="head">
            <span className="eyebrow">Promociones</span>
            <h2 className="h2">Beneficios <em>de temporada</em></h2>
          </Reveal>
          <div className="promos">
            {promos.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="promo">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <div className="promo-body">
                    <span className="eyebrow">Promoción</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <span className="link">Pedir información <Arrow /></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="section tint">
        <div className="container testi">
          <Reveal>
            <span className="eyebrow">Testimonios</span>
            <h2 className="h2">Lo que dicen nuestras <em>clientas</em></h2>
            <div className="rating">
              <strong>5.0</strong>
              <div>
                <span className="stars">★★★★★</span>
                <span style={{ display: "block" }}>{testimonials.length} reseñas destacadas</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="container faq">
          <Reveal>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="h2">Todo lo que necesitas saber antes de tu <em>sesión</em></h2>
            <p className="lead">Nuestros protocolos siguen los más altos estándares de seguridad. ¿Otra duda? Escríbenos.</p>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: "1.75rem" }}>
              <WhatsApp size={18} />Preguntar por WhatsApp
            </a>
          </Reveal>
          <Reveal delay={120}>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* Ubicación */}
      <section id="ubicacion" className="section tint">
        <div className="container">
          <Reveal className="head center">
            <span className="eyebrow">Visítanos</span>
            <h2 className="h2">Encuéntranos en el <em>Centro Histórico</em></h2>
          </Reveal>
          <div className="contact">
            <Reveal>
              <div className="map">
                <iframe title="Ubicación de Rejuvenece Zen Spa" src={site.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
              <div className="info">
                <div className="info-item"><Pin /><div><b>Dirección</b><span>{site.address}</span></div></div>
                <div className="info-item"><Clock /><div><b>Horario</b><span>{site.hours}</span></div></div>
                <div className="info-item"><Phone /><div><b>Teléfono</b><a href={site.phoneHref}>{site.phone}</a><a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsapp}</a></div></div>
                <div className="info-item"><Mail /><div><b>Correo</b><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img className="footer-logo" src="/assets/imagenes/logo-horizontal.png" alt={site.name} />
            <p>Un ritual donde la tecnología y la calma se abrazan.</p>
          </div>
          <div>
            <h4>Explora</h4>
            <ul>{nav.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>{site.address}</li>
              <li><a href={site.phoneHref}>Tel. {site.phone}</a></li>
              <li><a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsapp}</a></li>
            </ul>
          </div>
          <div>
            <h4>Síguenos</h4>
            <a className="social" href={site.facebook} target="_blank" rel="noopener noreferrer"><span><Facebook /></span>Facebook</a>
            <p style={{ fontSize: ".875rem" }}>Lun–Sáb 10:00–20:00<br />Domingo con cita</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</div>
        </div>
      </footer>

      <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="wa" aria-label="Reserva tu cita por WhatsApp">
        <i><WhatsApp /></i>
        <em style={{ fontStyle: "normal" }}>Reserva tu cita</em>
      </a>
    </main>
  );
}
