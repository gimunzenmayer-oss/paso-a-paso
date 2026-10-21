import type { NextConfig } from "next";

// El navegador solo carga código, estilos, imágenes y fuentes de esta misma web.
// 'unsafe-inline' hace falta por los estilos en línea del kit y el arranque de la app;
// 'unsafe-eval' solo en desarrollo (lo usa Next para recargar en caliente).
const desarrollo = process.env.NODE_ENV !== "production";
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' data: blob:",
  `connect-src 'self'${supabase ? ` ${supabase}` : ""}`,
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(desarrollo ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const encabezadosSeguridad = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El micrófono lo usa la app para grabar la voz de los botones; nada más.
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // /app y /app/ llevan a la app (antes daban 404: solo existía /app/index.html).
  // /onboarding ya es una página propia (app/onboarding).
  async redirects() {
    return [
      { source: "/app", destination: "/app/index.html", permanent: false },
      { source: "/app/", destination: "/app/index.html", permanent: false },
    ];
  },
  // Encabezados de seguridad para todo el sitio (09/27).
  async headers() {
    return [{ source: "/:path*", headers: encabezadosSeguridad }];
  },
};

export default nextConfig;
