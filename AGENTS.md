# AGENTS.md

## Contexto de arquitectura (Depwire)

@.depwire/AGENTS.md


Este archivo da contexto a agentes de codificación (Cursor, Claude Code, etc.) que trabajen en este repositorio.

## 1. Resumen del proyecto

Aplicación web de "regalo de cumpleaños sorpresa": contador regresivo que cambia de fondo conforme se acerca la fecha, y al llegar a 0 (o después) muestra una secuencia de sorpresas (slides, un vale, una sorpresa "próximamente" y un video de YouTube), con música de fondo. Soporta múltiples ediciones versionadas por año (`/2026`, `/2027`, ...) reutilizando el mismo código.

## 2. Stack técnico

- **Frontend:** React + Vite, mobile first.
- **Hosting:** Vercel (frontend + funciones serverless en `/api`).
- **Base de datos:** Turso (libSQL, compatible con SQLite) para la bitácora de visitas. No usar SQLite en disco: el filesystem de Vercel es efímero.
- **Estilos/animaciones:** a criterio del agente, priorizando algo ligero y responsive.

## 3. Estructura esperada

- `config/<año>.ts` (o `.json`): configuración por edición — fecha objetivo, foto, canción, imágenes (ticket, "próximamente"), URL de YouTube, textos de los 5 slides y contraseña de acceso.
- `/api/visit`: registra visitas en Turso.
- `/api/auth`: valida contraseña de cada edición (y la de `/admin`) en el servidor; nunca exponer contraseñas en el cliente.
- `/admin`: página protegida con contraseña propia, con selector de año y tabla de visitas por edición. Marcada `noindex`.
- `/assets/cats/`: 4-6 imágenes locales de gatitos estilo meme (gatito enojado, gatito feliz, etc.), usadas como acompañamiento ocasional.

## 4. Reglas de negocio clave

- **Ruteo por año:** cada año (`/2026`, `/2027`...) tiene su propia config, contraseña, sesión y bitácora independientes. `/` redirige al año vigente o muestra un mensaje simple.
- **Acceso:** toda edición requiere contraseña antes de mostrar cualquier contenido (contador o sorpresa). Sesión persistida (cookie httpOnly o token con expiración) para no pedirla en cada visita. Limitar intentos fallidos.
- **Zona horaria:** se detecta en el cliente con `Intl.DateTimeFormat().resolvedOptions().timeZone`. No se usa geolocalización del navegador ni se piden permisos; solo un aviso breve indicando que se usa la ubicación aproximada para ajustar la zona horaria.
- **Antes de la fecha objetivo:** solo se muestra el contador (días/horas/min/seg) con fondo que cambia por etapas. El contenido de la sorpresa no debe exponerse en el bundle/cliente antes de tiempo. Ocasionalmente (no siempre) se muestra una imagen de gatito-meme acorde a la etapa.
- **Al llegar a 0 o después:** se muestra la sorpresa completa directamente, sin pasar por el contador.
- **Modo de prueba:** parámetro `?debug=fecha` para simular fechas durante desarrollo.
- **Bitácora de visitas:** guarda año, fecha/hora UTC, zona horaria, país/ciudad aproximados (headers `x-vercel-ip-*`) y user agent. Nunca guardar la IP. Se registra solo tras contraseña correcta.
- **Secuencia de sorpresa:** foto → 5 slides de texto (con gatito-meme sutil junto a cada uno) → regalo 1 (ticket, "Un vale sin caducidad, el cual podrá ser canjeado en cualquier momento") → regalo 2 ("Próximamente", "Esta sorpresa aún se encuentra en proceso y en cuanto esté se actualizará") → video de YouTube (pausa la música) → mensaje final "Feliz cumpleaños 🎂!!!!" con confeti.
- **Modal de instrucciones:** se muestra solo la primera vez por edición (localStorage con clave por año), explica navegación entre slides (botones, swipe, flechas de teclado).
- **iOS Safari:** el audio solo puede iniciar tras un toque del usuario; usar `playsinline` en video, `100dvh` en vez de `100vh`, y respetar `safe-area-inset`.

## 5. Convenciones para el agente

- No usar imágenes ni recursos de internet en tiempo real para el frontend (gatitos, fotos, etc.) — todo como asset local, salvo el video embebido de YouTube.
- No exponer contraseñas ni secretos en código cliente; todo detrás de `/api` con variables de entorno (`.env`, documentado en `.env.example`).
- Al agregar una nueva edición/año, solo debe requerirse duplicar el archivo de configuración y definir su contraseña — no tocar lógica compartida.
- Probar cualquier cambio que afecte audio/video en un dispositivo iOS real antes de darlo por terminado.

## 6. MCPs configurados

Este proyecto usa dos servidores MCP como apoyo para el agente:

### context7
Da acceso a documentación actualizada de librerías y frameworks (evita alucinar APIs o usar versiones desactualizadas de React, Vite, Turso/libSQL, etc.).

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Uso recomendado: antes de escribir código contra una librería (por ejemplo, el cliente de `@libsql/client` o la config de Vercel Functions), consultar context7 para confirmar la API vigente en vez de asumir por memoria.

### depwire
Analiza el grafo de dependencias del repo: impacto de cambios, código muerto, salud de arquitectura y "what if" antes de refactors.

```json
{
  "mcpServers": {
    "depwire": {
      "url": "https://api.depwire.dev/mcp"
    }
  }
}
```

Uso recomendado: antes de modificar algo compartido entre ediciones (por ejemplo, la lógica de `/api/auth` o el esquema de la tabla de visitas en Turso), correr el análisis de impacto de depwire para ver qué archivos se ven afectados, en vez de adivinar.

> Nota: ambos requieren agregarse a la configuración de MCP del cliente que uses (Cursor, Claude Code, etc.) — este bloque es la referencia, no se ejecuta solo por estar en este archivo.
