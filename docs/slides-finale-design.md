# Slides de texto y final de cumpleaños

The 7 text slides become letter-like pages: Fraunces serif inside a kintsugi panel, with a bronze drop cap, lines revealed one by one, and a large meme cat that never overlaps the text (stacked above on phones, in its own alternating column on desktop). The finale becomes a three-act scene: tentacles from the countdown rise, Kary taps out 5 candles on a cake in silence, and the last candle triggers fireworks, the song, the "Feliz cumpleaños 🎂!!!!" title, and her photo in a medallion with a "Volver a celebrar" button.

## Terms

- **slide de texto**: each of the 7 slides showing one paragraph from `config/2026.ts` with a cat. Avoid: tarjeta, diapositiva de mensaje.
- **final**: the last slide with "Feliz cumpleaños 🎂!!!!". Avoid: finale, cierre.
- **pastel**: SVG cake with candles inside the final; Kary blows it out to trigger the explosion. Avoid: torta, cake.

## Why

Christian's request: the slide texts need a better font and stronger emphasis; the cat images on text slides must be larger and must not interrupt the text; the "Feliz cumpleaños" part must be much more spectacular.

## Locked decisions

- **Final = tentacles rise + cake + explosion (Q3, option D).** The tentacles close the story the countdown told ("something is coming" finally arrives), and blowing out the candles makes the moment hers. Rejected: A (automatic show: letter-by-letter title, fireworks, photo) as safest but passive; B (cake only) loses the callback to the countdown; C (tentacles only) is spectacle without her participation.
- **Candles go out by tapping (Q7, option A).** No permissions, identical on iPhone and Android, matching PRODUCT.md principle 5. Rejected: B (blow into microphone) asks for a permission at the climax and breaks if denied; C (swipe up) conflicts with the slide-swipe gesture.

## Routine choices

- Q1: text font is **Fraunces** (warm editorial serif), larger, left-aligned, reads like a letter.
- Q4: **letter panel** (kintsugi surface with bronze vein), **bronze drop cap**, and the text **appears line by line** on entering the slide; respects `prefers-reduced-motion`.
- Q5: tapping Siguiente (or swipe / arrow right) while lines are still appearing **completes the paragraph instantly**; the next tap advances. Going back is never blocked.
- Q2: cat is **above the panel on phones**, and **in its own column beside the panel on desktop** (~220px).
- Q6: on desktop the cat **alternates sides** slide to slide.
- Q10: **5 candles**; each tap puts one out with a smoke puff; the last one triggers the explosion.
- Q8: after the explosion: **large title + her photo in a medallion + gentle continuous confetti + "Volver a celebrar"** button (relights the candles).
- Q9: **silence** while she blows out the candles; the song comes in with the explosion.

## Verified facts

- Paragraphs are ~60 words each (7 of them), so a display face like Metamorphous is unreadable at that length.
- Fonts currently load from Google Fonts in `index.html` (Metamorphous, Source Sans 3).
- `Tentacles` takes an `intensity` 0..1 and already renders the 7 masked SVG arms.
- `canvas-confetti` is already a dependency and supports `disableForReducedMotion`.
- Music pauses on the video slide and resumes on leaving it; the final follows the video.

## Risks

- Long paragraphs on short phones (iPhone SE height): panel must scroll internally rather than push navigation off-screen.
- Line measurement depends on layout; a font swap after measurement could misalign line delays (mitigated by measuring after `document.fonts.ready`).
- Audio after the explosion relies on the candle tap being a user gesture (it is), so iOS allows `play()`.
- Animation load on low-end phones: confetti bursts are bounded in time.

## Deferred

None.

## Open threads

None.
