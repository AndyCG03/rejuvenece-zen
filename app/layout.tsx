import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Rejuvenece Zen Spa · Bienestar y tecnología en el Centro Histórico CDMX",
  description:
    "Spa en el Centro Histórico de la CDMX. Aparatología, tratamientos faciales y masajes que fusionan innovación y terapia manual. Diagnóstico gratuito.",
  icons: { icon: "/assets/imagenes/logo-cuadrado.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
