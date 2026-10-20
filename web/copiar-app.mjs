// Copia la app (carpeta ../app, sin build) a public/app para servirla en /app.
import { cpSync, rmSync } from 'node:fs';
rmSync('public/app', { recursive: true, force: true });
cpSync('../app', 'public/app', { recursive: true });
