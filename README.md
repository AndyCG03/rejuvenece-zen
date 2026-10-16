# Rejuvenece Zen Spa

Sitio web y sistema de reservas de **Rejuvenece Zen Spa**, en el Centro Histórico de la CDMX (Luis Moya 51, Col. Centro).

Incluye la página pública del spa, un flujo de **reserva de citas en línea** y un **backoffice** para gestionar la agenda.

---

## Qué incluye

### Sitio público
- **Inicio** con video a pantalla completa, botones de reserva y WhatsApp, y cifras del negocio.
- **Nosotros**, **Servicios** (3 columnas en escritorio, pestañas en móvil), **Galería** con visor de fotos, **Promociones**, **Testimonios** (carrusel), **Preguntas frecuentes** y **Ubicación** con mapa y formulario de contacto.
- Navbar blanca fija, botón flotante de WhatsApp e imagen de vista previa (`public/og.png`) para cuando se comparte el enlace.
- Diseño responsive, con animaciones discretas que se desactivan si el dispositivo pide reducir movimiento.

### Reserva en línea (`#reservar`)
1. La clienta elige el **servicio**.
2. Elige **día y hora** en un calendario que solo muestra horarios libres. Se calculan con el horario de atención, la duración del servicio, las citas existentes y los bloqueos.
3. Deja sus **datos** (nombre, WhatsApp, correo y notas opcionales).
4. **Paso obligatorio:** envía el aviso por WhatsApp. El mensaje ya va escrito, con el folio de la cita.

Reglas:
- Las citas quedan **pendientes** hasta que se confirman en el backoffice.
- Se reserva con hasta 60 días de anticipación, en intervalos de 30 minutos.
- El mismo día se exige un mínimo de 2 horas de anticipación.
- El servidor impide citas encimadas, tanto entre citas como con bloqueos.

### Backoffice (`/admin`)
Protegido con la contraseña `ADMIN_PASSWORD`.
- **Agenda:**
  - Vista semanal con filtros y contador de pendientes.
  - Confirmar, o "Confirmar y avisar" (abre WhatsApp con el mensaje para la clienta).
  - Marcar como completada o "no asistió", reagendar y cancelar.
- **Bloqueos:** cerrar horarios o días completos (comida, vacaciones, festivos).
- **Horario:** días y horas de atención. Por defecto lunes a sábado de 10:00 a 20:00 y el domingo cerrado.
- **Servicios:** duración, precio y visibilidad de cada tratamiento.

---

## Tecnología

| Parte | Herramienta |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | CSS propio (`app/globals.css`), sin librerías de UI |
| Tipografías | Fraunces (títulos) y Manrope (texto), vía `next/font` |
| Base de datos | **Neon** (PostgreSQL serverless) en producción; **PGlite** (Postgres embebido) en desarrollo local |
| Hosting actual | Vercel |

Las tablas (`services`, `hours`, `blocks`, `appointments`) **se crean solas** la primera vez que alguien entra a la agenda. Ahí también se cargan los 12 servicios y el horario inicial. No hay que correr migraciones.

---

## Estructura

```
app/
  page.tsx              Página principal
  layout.tsx            Fuentes, metadatos y vista previa al compartir
  globals.css           Todos los estilos
  admin/page.tsx        Backoffice
  api/booking/...       API pública: configuración, disponibilidad, crear reserva
  api/admin/...         API del backoffice (requiere sesión)
components/             Componentes del sitio (Header, Booking, Gallery, etc.)
components/admin/       Pantallas del backoffice
lib/content.ts          Textos, servicios, testimonios, FAQ, datos de contacto
lib/server/             Base de datos, disponibilidad, autenticación
public/assets/          Imágenes, logos y video del inicio
```

Para cambiar textos, teléfonos, redes o preguntas frecuentes, edita **`lib/content.ts`**. Duraciones, precios y horarios se cambian desde el backoffice.

---

## Variables de entorno

Copia `.env.example` como `.env`, o configúralas en el panel del hosting:

```env
# Cadena de conexión "pooled" de Neon (termina en ?sslmode=require)
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@ep-xxxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Contraseña del backoffice /admin
ADMIN_PASSWORD=una-contraseña-segura

# Dominio público (para las vistas previas al compartir el enlace)
SITE_URL=https://rejuvenecezen.com
```

- **`DATABASE_URL`:** en la consola de Neon, **Dashboard → Connect**, con *Connection pooling* activado → *Show password* → copiar. En Vercel está marcada como *Sensitive* y no se puede copiar desde ahí.
- **En producción:** si falta `DATABASE_URL`, la sección de reserva muestra el botón "Agenda por WhatsApp" en lugar del calendario.
- **En local** (`npm run dev`) no hace falta ninguna variable: se usa una base embebida en `.pglite/` y la contraseña del backoffice es `admin`.

---

## Desarrollo local

Requisitos: **Node.js 20 o superior**.

```bash
npm install
npm run dev        # http://localhost:3000  ·  backoffice: /admin (contraseña: admin)
```

Para probar contra la base real, crea `.env.local` con `DATABASE_URL`.

---

## Despliegue

### Opción A: Vercel (configuración actual)
1. Importa el repositorio en Vercel. Detecta Next.js automáticamente.
2. Ve a **Storage → Create Database → Neon** (región Washington, D.C. / `iad1`, plan Free) y conéctala al proyecto. Esto crea `DATABASE_URL`.
3. Ve a **Settings → Environment Variables** y agrega `ADMIN_PASSWORD`, marcada como *Sensitive*.
4. Haz **Deploy**. Cada push a la rama de producción vuelve a desplegar.

La integración de Neon agrega más variables (`POSTGRES_*`, `PG*`, `STACK_*`, etc.). El sitio solo usa `DATABASE_URL` y `ADMIN_PASSWORD`; las demás se pueden ignorar.

### Opción B: otro hosting con Node.js
Sirve cualquier hosting que ejecute **Node.js 20+**: Render, Railway, Netlify, un VPS, cPanel con Node, etc. Un hosting solo para HTML o PHP no sirve, porque la reserva usa funciones de servidor.

1. Sube el código.
2. Configura `DATABASE_URL`, `ADMIN_PASSWORD` y `SITE_URL`.
3. Comandos:
   ```bash
   npm install
   npm run build
   npm start          # usa el puerto de la variable PORT (por defecto 3000)
   ```
4. Apunta el dominio al hosting y activa HTTPS.

En un VPS, mantén el proceso activo con **pm2** (`pm2 start npm --name rejuvenece -- start`) detrás de Nginx como proxy inverso.

Si dejas de usar Vercel, quita ahí la integración de Neon o borra el proyecto. Así Vercel no podrá rotar la contraseña de la base sin que te enteres.

---

## Comprobación después de desplegar

1. Abre el sitio: el video del inicio debe reproducirse.
2. Ve a **Reserva tu cita**: debe aparecer el calendario, no el botón de WhatsApp de respaldo.
3. Haz una reserva de prueba y envía el aviso por WhatsApp.
4. Entra a **`/admin`**, busca la cita por su folio y confírmala o cancélala.
5. En **Servicios**, ajusta duraciones y precios reales.

---

## Plan gratuito de Neon

- 1 GB de almacenamiento y 100 horas de cómputo (CU-horas) por proyecto. Sobra para el volumen de un spa.
- La base se "duerme" tras unos minutos sin uso. La primera consulta después tarda un poco más (normalmente menos de un segundo).
- Revisa el consumo de vez en cuando en la consola de Neon, en *Billing*.
