# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: Kary.** A very important person to the author (not a partner, not a friend; the relationship is personal and should not be labeled in UI copy). She receives a private link, most likely on her phone, and returns to it during the days before her birthday and again when it arrives. Device and browser are unknown: design for iOS Safari and Android Chrome equally.
- **Secondary: Christian (author/admin).** Configures each yearly edition, writes the texts, and checks the visit log in `/admin`.

## Product Purpose

A private, yearly birthday gift delivered as a web page. Before the date it builds anticipation with a countdown; at the date it reveals a sequenced surprise. Success: Kary feels the gift was made specifically for her, comes back during the countdown, and experiences the reveal as a moment, not a web page.

## Positioning

Not a greeting card template. It is a hand-built, password-gated ritual that repeats every year (`/2026`, `/2027`, …), where the surprise genuinely does not exist on her device until the official instant.

## Operating Context

- Link shared privately; access requires an edition password, then a persisted session (httpOnly cookie, 90 days).
- Countdown phase: days/hours/min/sec with background that changes by stage; occasional meme-cat peeks.
- Reveal phase (at or after target): photo, 5 text slides (each with a subtle cat), gift 1 (ticket: "Un vale sin caducidad, el cual podrá ser canjeado en cualquier momento"), gift 2 ("Próximamente"), YouTube video (pauses music), finale "Feliz cumpleaños 🎂!!!!" with confetti.
- Background music starts only after a user tap.
- First visit per edition shows an instructions modal (buttons, swipe, keyboard arrows).
- Admin: `/admin`, separate password, year selector, visit table, `noindex`.

## Capabilities and Constraints

- Stack: React + Vite SPA, Vercel Functions in `/api` (Node ESM), Turso (libSQL) for visits.
- Official instant for 2026: 2026-10-05 00:00 `America/Los_Angeles`. Server decides unlock; client timezone (`Intl`) is display only, with a brief notice. No geolocation permission.
- Surprise content must not ship in the client bundle before the instant; it comes from `/api/edition`.
- Debug mode: `?debug=<ISO>&key=<DEBUG_SECRET>` (or admin cookie) simulates the server clock.
- New edition = copy `config/<year>.ts`, register it, set `ACCESS_PASSWORD_<year>`. No shared logic changes.
- Visit log stores year, UTC time, visitor timezone, approximate country/region/city, user agent. Never IP.
- All assets local (photos, cats, song); only YouTube is external.
- iOS: `100dvh`, `safe-area-inset`, `playsinline`, audio after tap; verify on a real iPhone.
- UI copy is Spanish.

## Brand Commitments

- Voice: tender and playful. Meme cats and light jokes are part of the identity; cats accompany, they never dominate.
- Fixed copy above (ticket caption, "Próximamente" caption, finale) is authored and must be preserved.

## Evidence on Hand

- Current photo, ticket, "soon" image, and cat images are SVG placeholders (`public/assets/editions/2026/`, `public/assets/cats/`); final photos, 5–6 cat memes, and song are pending from the author.
- The 5 slide paragraphs in `config/2026.ts` are placeholders; `youtubeId` is empty. Do not invent replacement text or media.

## Product Principles

1. It is for one person: every detail should feel personal, never generic or template-like.
2. The reveal is sacred: nothing leaks early, and the moment it opens must feel earned.
3. Anticipation is part of the gift: the countdown should be worth returning to.
4. Playful, not noisy: cats and jokes add warmth without stealing the moment.
5. Works on whatever phone she has, first try, with no permissions asked.
