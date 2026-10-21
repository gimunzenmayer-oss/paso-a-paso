// Las pruebas importan los .ts tal cual (Node quita los tipos). Este gancho
// resuelve el alias "@/…" del tsconfig igual que Next, así un módulo que usa
// "@/components/…" se prueba sin cambiar sus imports.
// Se carga con: node --import ./pruebas/alias.mjs --test …
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

const RAIZ = new URL('../', import.meta.url);

registerHooks({
  resolve(especificador, contexto, siguiente) {
    if (especificador.startsWith('@/')) {
      const base = new URL(especificador.slice(2), RAIZ).href;
      const url = ['.ts', '.tsx'].map((ext) => base + ext).find((u) => existsSync(new URL(u)));
      if (url) return siguiente(url, contexto);
    }
    return siguiente(especificador, contexto);
  },
});
