/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // Sitio 100 % estático: `npm run build` genera la carpeta `out/` lista para subir a Neubox (public_html).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
