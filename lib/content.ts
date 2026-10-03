const waText = encodeURIComponent("Hola, quiero más información de la página Rejuvenece Zen.");

export const site = {
  name: "Rejuvenece Zen Spa",
  phone: "55 5161 6896",
  phoneHref: "tel:5551616896",
  whatsapp: "56 2004 9792",
  whatsappHref: `https://wa.me/525620049792?text=${waText}`,
  email: "hola@rejuvenecezenspa.mx",
  address: "Luis Moya 51, Colonia Centro, Cuauhtémoc, 06000 Ciudad de México, CDMX",
  hours: "Lun a Sáb · 10:00 — 20:00 · Dom con cita",
  facebook: "https://www.facebook.com/profile.php?id=61591758245206",
  mapSrc:
    "https://www.google.com/maps?q=Luis%20Moya%2051%2C%20Colonia%20Centro%2C%20Cuauht%C3%A9moc%2C%2006000%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX&output=embed",
};

export const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#faq", label: "FAQ" },
  { href: "#ubicacion", label: "Ubicación" },
];

export const stats = [
  { value: 1200, prefix: "+", suffix: "", label: "Tratamientos exitosos" },
  { value: 500, prefix: "+", suffix: "", label: "Clientes satisfechas" },
  { value: 100, prefix: "", suffix: "%", label: "Calidad garantizada" },
  { value: 7, prefix: "", suffix: "", label: "Días de bienestar" },
];

export const services = [
  {
    id: "aparatologia",
    short: "Aparatología",
    title: "Aparatología Facial & Corporal",
    tag: "Alta tecnología",
    image: "/assets/imagenes/banner-aparatologia.jpg",
    description:
      "Resultados visibles con tecnología no invasiva de última generación para remodelar, tonificar y rejuvenecer.",
    items: [
      ["EMSZERO", "Estimulación electromagnética para tonificar y reducir."],
      ["Radiofrecuencia", "Firmeza y colágeno para rostro y cuerpo."],
      ["Cavitación Ultrasónica", "Reducción localizada de grasa."],
      ["Presoterapia", "Drenaje linfático avanzado."],
    ],
  },
  {
    id: "faciales",
    short: "Faciales",
    title: "Tratamientos Faciales",
    tag: "Luminosidad total",
    image: "/assets/imagenes/banner-faciales.jpg",
    description:
      "Protocolos personalizados que combinan activos de grado médico con técnicas suaves para una piel radiante.",
    items: [
      ["Hydrafacial", "Limpieza profunda, exfoliación e hidratación en una sesión."],
      ["Peeling Químico", "Renovación celular controlada."],
      ["Dermapen", "Microneedling con activos regenerativos."],
      ["Masaje Kobido", "Lifting facial japonés manual."],
    ],
  },
  {
    id: "masajes",
    short: "Masajes",
    title: "Masajes Corporales",
    tag: "Terapia & calma",
    image: "/assets/imagenes/banner-masajes.jpg",
    description:
      "Rituales que liberan tensión muscular, activan la circulación y reconectan cuerpo y mente.",
    items: [
      ["Masaje Terapéutico", "Descontracturante profundo."],
      ["Piedras Calientes", "Termoterapia relajante."],
      ["Aromaterapia", "Aceites esenciales personalizados."],
      ["Drenaje Linfático", "Manual, para desintoxicar el cuerpo."],
    ],
  },
];

// Orden pensado para la cuadrícula: la vertical ocupa dos filas, la panorámica dos columnas.
export const gallery: { src: string; alt: string; span?: "tall" | "wide" }[] = [
  { src: "/assets/imagenes/gallery-1.jpg", alt: "Masaje terapéutico de espalda", span: "tall" },
  { src: "/assets/imagenes/gallery-2.jpg", alt: "Toallas, aceites y tulipanes" },
  { src: "/assets/imagenes/gallery-3.jpg", alt: "Aplicación de aceite esencial" },
  { src: "/assets/imagenes/gallery-5.jpg", alt: "Alberca rodeada de palmeras", span: "wide" },
  { src: "/assets/imagenes/gallery-4.jpg", alt: "Masaje relajante" },
  { src: "/assets/imagenes/gallery-6.jpg", alt: "Masaje con piedras calientes" },
];

export const promos = [
  { title: "Promoción 1", text: "Aprovecha nuestra promoción del mes. Pregunta por disponibilidad.", image: "/assets/imagenes/promo-1.jpg" },
  { title: "Promoción 2", text: "Descuento especial en paquetes seleccionados.", image: "/assets/imagenes/promo-2.jpg" },
];

export const testimonials = [
  { quote: "El Hydrafacial cambió por completo la textura de mi piel. El ambiente es simplemente mágico, me siento como en casa.", name: "María González", role: "Cliente frecuente" },
  { quote: "El EMSZERO me dio resultados que no había logrado con ningún otro tratamiento. Personal profesional y muy atento.", name: "Ana Ruiz", role: "Ejecutiva" },
  { quote: "Cada visita es un ritual. La combinación de tecnología y masaje manual es única en la CDMX.", name: "Carla Méndez", role: "Emprendedora" },
  { quote: "Su masaje con piedras calientes me devolvió la calma después de semanas de estrés. 100% recomendado.", name: "Sofía Herrera", role: "Diseñadora" },
  { quote: "Como médico, valoro la higiene y protocolos. Rejuvenece Zen supera cualquier estándar. Impecable.", name: "Renata López", role: "Doctora" },
  { quote: "El Kobido facial es divino. Salí radiante para mi sesión de fotos. Ahora es parte de mi rutina mensual.", name: "Valeria Torres", role: "Actriz" },
];

// Las respuestas del sitio original no venían en el HTML (acordeón cerrado); revísalas.
export const faqs = [
  { q: "¿Cómo garantizan la higiene y esterilización del equipo?", a: "Todo el instrumental se esteriliza después de cada sesión, usamos insumos desechables de un solo uso y desinfectamos cabinas y equipos entre cada cliente." },
  { q: "¿Cuántas sesiones necesito de EMSZERO para ver resultados?", a: "Muchas clientas notan cambios desde las primeras sesiones; para resultados óptimos recomendamos un protocolo de 4 a 8 sesiones, definido en tu diagnóstico gratuito." },
  { q: "¿El Hydrafacial es apto para pieles sensibles o con rosácea?", a: "Sí. Es un tratamiento suave y ajustable; en la valoración adaptamos la intensidad y los activos a tu tipo de piel." },
  { q: "¿Qué contraindicaciones tienen los tratamientos con radiofrecuencia?", a: "No se recomienda durante el embarazo, con marcapasos o implantes metálicos en la zona, ni sobre piel lesionada. Lo revisamos contigo antes de empezar." },
  { q: "¿Se pueden combinar servicios faciales y corporales en una sola visita?", a: "Por supuesto. Diseñamos rituales combinados según tu tiempo y objetivos." },
  { q: "¿Qué política de cuidados post-tratamiento manejan?", a: "Al terminar te damos indicaciones personalizadas y damos seguimiento por WhatsApp para resolver cualquier duda." },
];

export const trust = [
  "Diagnóstico gratuito",
  "Protocolos certificados",
  "Abierto 7 días",
];
