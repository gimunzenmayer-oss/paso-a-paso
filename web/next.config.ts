import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Mientras se construye la bienvenida, "Probar gratis" abre la app de ejemplo.
  async redirects() {
    return [{ source: "/onboarding", destination: "/app/index.html", permanent: false }];
  },
};

export default nextConfig;
