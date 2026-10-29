# Retención: correos, recordatorios y canales

> Actualización 25-10: estos tres textos iniciales son antecedentes, NO plantillas activas. Los reemplaza `web/lib/correos/plantillas.ts` (28 variantes de servicio/marketing) y `docs/correos/OPERACION.md`. No usar el nombre del niño, detalles sensibles ni supuesta actividad local en emails. Todo el envío sigue desactivado, sin proveedor verificado ni pruebas reales de bandeja.

Plan escrito del punto 13 de la auditoría (2026-10-21). Todavía no hay nada conectado: los correos necesitan Resend (o el correo propio que conectes a Supabase) y la entrada de pago (cuenta de clienta) para saber a quién escribir.

## 3 correos básicos

**1. Bienvenida, en cuanto se crea la cuenta**
- Asunto: Tu primer día con Paso a Paso
- Texto: Hola, {nombre}. Ya tienes Paso a Paso en tu celular. Te propongo una sola cosa para hoy: abre "Preparar", elige la rutina de la mañana y cámbiale las fotos por las de tu casa. Son 5 minutos y mañana {niño} ya la puede usar. Si llega un momento difícil, la guía «Ahora mismo» está en la primera pantalla.
- Botón: Abrir mi rutina

**2. Activación, al tercer día si no ha completado ninguna rutina**
- Asunto: ¿Te ayudo a armar la primera rutina?
- Texto: Muchas familias empiezan con la rutina que más cuesta, como salir de casa o irse a dormir. Elige solo esa. Pon 4 o 5 pasos con fotos y deja que {niño} toque «Hecho» en cada uno. No hace falta tenerlo todo listo.
- Botón: Elegir mi primera rutina

**3. Pago fallido, cuando Hotmart avisa que el cobro no pasó**
- Asunto: Tu pago no se pudo completar
- Texto: Hola, {nombre}. Hotmart no pudo cobrar tu suscripción. Tus rutinas y tu diario siguen guardados en tu celular y no se pierde nada. Actualiza tu tarjeta en Hotmart para seguir usando Paso a Paso sin cortes.
- Botón: Actualizar mi pago

Regla: nunca mencionar crisis, el diario ni datos del niño en un correo, porque se puede leer en una pantalla compartida.

## Recordatorios dentro de la app

- La app sin servidor no puede mandar avisos con el teléfono bloqueado. Para eso hacen falta notificaciones push (servidor + permiso de la madre). Eso es una función nueva, para decidir después.
- Lo que sí se puede hacer sin servidor: al abrir la app, si no se anotó nada en el diario en 7 días, mostrar una tarjeta suave: «¿Cómo fue esta semana? Anotar te ayuda a ver patrones».

## Canales para conseguir familias (hoja inicial)

| Canal | Qué hacer | Costo | Medir |
|---|---|---|---|
| Grupos de Facebook de mamás de niños autistas (MX, CO, AR) | Compartir la guía «Ahora mismo» como ayuda, sin vender, con el enlace en el perfil | Gratis | Visitas desde Facebook |
| TikTok / Instagram Reels | Videos de 15 s: «Así preparo la salida de casa con mi hijo» | Gratis | Visitas y pruebas iniciadas |
| Terapeutas y escuelas | Ofrecer el informe para profesionales como motivo para recomendar la app | Gratis | Código o enlace por terapeuta |
| Afiliados de Hotmart | Abrir la afiliación con comisión del 30 al 40 % | Solo si vende | Ventas por afiliada |
| Anuncios pagados | Solo después de tener 20 a 30 clientas y saber cuántas se quedan | Variable | Costo por clienta (panel → Costos) |
