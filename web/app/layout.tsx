import type { Metadata, Viewport } from "next";
import { Nunito, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin", "latin-ext"], weight: ["700", "800", "900"] });
const atkinson = Atkinson_Hyperlegible({ variable: "--font-atkinson", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Paso a Paso · Días predecibles para tu peque autista",
  description:
    "Rutinas con fotos, calma en las crisis y un informe para la terapeuta. Para mamás de niños autistas de 2 a 12 años. Tus datos no salen del teléfono.",
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${nunito.variable} ${atkinson.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
