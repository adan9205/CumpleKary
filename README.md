# CumpleKary

App de cumpleaños por ediciones (`/2026`, `/2027`, …). React + Vite, APIs en `/api` para Vercel, visitas en Turso.

La sorpresa no viaja en el bundle. Sale de `/api/edition` solo si ya llegó el instante oficial o si usas debug autorizado.

## Instante oficial (2026)

- Fecha: 5 de octubre de 2026, 00:00
- Zona: `America/Los_Angeles` (California)
- El teléfono de ella solo pinta el contador con `Intl`. El servidor no usa su TZ para abrir la sorpresa.

## Scripts

```bash
npm install
npm run dev          # solo frontend (las /api fallan sin Vercel)
npx vercel dev       # frontend + /api (recomendado en local)
npm run build
```

Copia `.env.example` a `.env` y rellena secretos. `vercel dev` los carga.

## Turso

1. Crea una base en [Turso](https://turso.tech) (`turso db create cumple-kary`).
2. `turso db show cumple-kary --url` → `TURSO_DATABASE_URL`
3. `turso db tokens create cumple-kary` → `TURSO_AUTH_TOKEN`
4. No hace falta SQL a mano. Las tablas `visits` y `unlock_attempts` se crean solas al primer request.

La bitácora guarda año, UTC, zona horaria del visitante, país/región/ciudad de `x-vercel-ip-*` y user agent. No guarda IP.

## Vercel

1. Sube el repo y importa el proyecto (preset Vite).
2. Environment Variables: todas las de `.env.example`.
3. Deploy. `vercel.json` reescribe la SPA y marca `/admin` como `noindex`.

Local con APIs: `npx vercel dev` (pide login la primera vez).

## Contraseñas y sesión

| Variable | Uso |
|---|---|
| `ACCESS_PASSWORD_2026` | Gate de `/2026` |
| `ACCESS_PASSWORD_2027` | Gate de `/2027` cuando exista |
| `ADMIN_PASSWORD` | Solo `/admin` |
| `SESSION_SECRET` | Firma cookies httpOnly |
| `DEBUG_SECRET` | Query `key` para simular fecha |

Cookie de edición: 90 días, una por año (`pk_ed_2026` no abre `/2027`). Cookie admin: 1 día. 5 fallos / 15 min por edición (y admin aparte).

Tras la clave correcta se registra una visita por sesión.

## Modo prueba

Con cookie admin o `DEBUG_SECRET`:

`/2026?debug=2026-10-05T00:00:00-07:00&key=TU_DEBUG_SECRET`

`debug` es ISO. Para ver la sorpresa usa una fecha ≥ el 5 oct 2026 00:00 en California. Para ver el contador, una fecha anterior.

La password de la edición **no** basta para debug.

## Nueva edición (ejemplo 2027)

1. Copia `config/2026.ts` → `config/2027.ts`. Cambia `year`, `targetDate`, `timeZone` si aplica, textos, `youtubeId`, rutas de assets.
2. En `config/index.ts` importa y registra el año en el mapa `editions`.
3. Crea `public/assets/editions/2027/` con `photo.webp`, `ticket.webp`, `soon.webp`, `song.mp3` (o `.m4a`). Actualiza las rutas en el config.
4. En Vercel (y `.env`): `ACCESS_PASSWORD_2027=...`
5. Si 2027 es la vigente: `CURRENT_YEAR=2027`
6. Redeploy. `/2026` sigue aislado (clave, cookie, bitácora).

Gatitos meme: deja 5–6 archivos en `public/assets/cats/` (mejor WebP). Los SVG actuales son placeholders.

## Qué sustituir en 2026

- `config/2026.ts`: 5 párrafos, `youtubeId`, `photoAlt`, rutas si pasas a WebP
- `public/assets/editions/2026/photo.webp` (o el svg)
- `ticket.webp`, `soon.webp`
- `song.mp3` o `song.m4a` (iOS: estos formatos; no autoplay sin toque)
- Gatitos en `/assets/cats/`

## iOS

Audio solo después de **Abrir sorpresa**. Video con `playsinline`. Layout con `100dvh` y `safe-area-inset`. El modo responsive de Chrome no replica Safari. Prueba en iPhone o BrowserStack antes de mandar el link.

## Rutas

- `/` → año vigente
- `/:year` → gate + contador o sorpresa
- `/admin` → visitas por edición
