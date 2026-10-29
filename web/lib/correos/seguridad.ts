import { createCipheriv, createDecipheriv, createHash, createHmac, timingSafeEqual } from 'node:crypto';

export function coincide(a: string | null, b: string | undefined): boolean {
  return Boolean(a && b && b.length >= 32 && timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest()));
}
export function tokenBaja(id: string, secreto: string): string {
  if (secreto.length < 32) throw new Error('falta_secreto_baja');
  return `${id}.${createHmac('sha256', secreto).update(`baja-v1:${id}`).digest('base64url')}`;
}
export function leerBaja(token: string, secreto: string): string | null {
  const [id, firma, sobra] = token.split('.');
  if (sobra || !id || !/^[0-9a-f-]{36}$/i.test(id) || !firma || secreto.length < 32) return null;
  return coincide(token, tokenBaja(id, secreto)) ? id : null;
}
// El cuerpo de un acceso contiene un token de inicio de sesión. Se guarda cifrado
// únicamente para reintentar EXACTAMENTE el mismo correo con la misma clave Resend.
export function cifrar(valor: unknown, llave: string, iv: Uint8Array): string {
  if (!/^[a-f0-9]{64}$/i.test(llave) || iv.length !== 12) throw new Error('llave_cifrado_invalida');
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(llave, 'hex'), iv);
  const cuerpo = Buffer.concat([cipher.update(JSON.stringify(valor), 'utf8'), cipher.final()]);
  return [Buffer.from(iv).toString('base64url'), cipher.getAuthTag().toString('base64url'), cuerpo.toString('base64url')].join('.');
}
export function descifrar(valor: string, llave: string): unknown {
  if (!/^[a-f0-9]{64}$/i.test(llave)) throw new Error('llave_cifrado_invalida');
  const [iv, tag, cuerpo] = valor.split('.');
  if (!iv || !tag || !cuerpo) throw new Error('cuerpo_invalido');
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(llave, 'hex'), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(cuerpo, 'base64url')), decipher.final()]).toString('utf8'));
}

// Svix firma ID.timestamp.cuerpo crudo. Rotación: acepta cualquiera de las firmas v1.
export function verificarResend(raw: string, headers: Headers, secreto: string, ahora = Date.now()): boolean {
  const id = headers.get('svix-id');
  const ts = headers.get('svix-timestamp');
  const firmas = headers.get('svix-signature');
  if (!id || !ts || !/^\d+$/.test(ts) || !firmas || !secreto.startsWith('whsec_')) return false;
  if (Math.abs(ahora / 1000 - Number(ts)) > 300) return false;
  const llave = Buffer.from(secreto.slice(6), 'base64');
  if (llave.length < 16) return false;
  const firma = createHmac('sha256', llave).update(`${id}.${ts}.${raw}`).digest('base64');
  return firmas.split(' ').some(s => s.startsWith('v1,') && coincide(s.slice(3), firma));
}
