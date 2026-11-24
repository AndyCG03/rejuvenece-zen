# Rejuvenece Zen Spa · sitio estático

Sitio de **Rejuvenece Zen Spa** (Luis Moya 51, Col. Centro, CDMX). Es **100 % estático**: no tiene backoffice, base de datos ni API. Todo el contacto va a **WhatsApp 56 2004 9792**.

## Qué incluye
- **Pantalla de carga** de marca: el ensō (el círculo del logo) se dibuja en verde y dorado alrededor del logo, con la frase «Respira. Llegaste a tu refugio.». Va en el HTML, así que aparece al instante, y se retira cuando carga la página (mínimo 1.6 s y máximo 4 s). Respeta «reducir movimiento». Archivo: `components/Loader.tsx`. Estilos: final de `app/globals.css`.
- **Reserva en 3 pasos** (`components/Booking.tsx`): servicio → día y hora → datos. No guarda nada: abre WhatsApp con la solicitud escrita (servicio, día, hora, teléfono y notas). El spa confirma por ahí.
- **Formulario de contacto** (`components/ContactForm.tsx`): también abre WhatsApp con el mensaje.
- Botones de WhatsApp, promociones y FAQ: todos llevan a WhatsApp.

## Dónde cambiar cosas
Todo está en **`lib/content.ts`**:
- `WHATSAPP_NUMBER`: el número de todo el sitio (con 52 de México).
- `site`: teléfono, correo, dirección, horario y Facebook.
- `booking`: días y horario de atención, anticipación mínima y duración aproximada de cada servicio.
- Servicios, galería, promociones, testimonios y FAQ.

## Generar el build
Requiere Node.js 20 o superior.

```bash
npm install
npm run build      # genera la carpeta out/
```

`out/` es el sitio completo, incluido el `.htaccess` para Apache (HTTPS, compresión y caché).

## Subir a Neubox (cPanel)
1. cPanel → **Administrador de archivos** → `public_html` (o la carpeta del dominio).
2. Sube `rejuvenecezen-neubox.zip` y usa **Extraer** ahí mismo. El contenido de `out/` debe quedar directamente en `public_html` (`index.html`, `_next/`, `assets/`, `.htaccess`…), no dentro de una subcarpeta.
3. Activa «Mostrar archivos ocultos» para comprobar que esté el `.htaccess`.
4. Activa el SSL del dominio (AutoSSL / Let's Encrypt). El `.htaccess` redirige a HTTPS.
5. Borra el zip de `public_html`.

Para ver el build en local: `npx serve out`.
