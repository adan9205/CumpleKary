import { useLayoutEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;
  cat: string;
  /** Desktop column for the cat; phones always stack it above. */
  side: "left" | "right";
  revealed: boolean;
  onRevealed: () => void;
};

const LINE_MS = 300;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LetterSlide({ text, cat, side, revealed, onRevealed }: Props) {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const onRevealedRef = useRef(onRevealed);
  onRevealedRef.current = onRevealed;
  const [revealing, setRevealing] = useState(false);

  const { cap, tokens } = useMemo(() => {
    const trimmed = text.trim();
    const [first = "", ...rest] = Array.from(trimmed);
    return { cap: first, tokens: rest.join("").split(/(\s+)/) };
  }, [text]);

  useLayoutEffect(() => {
    if (revealed) {
      return;
    }
    if (prefersReducedMotion()) {
      onRevealedRef.current();
      return;
    }
    let cancelled = false;
    let timer = 0;
    // Line breaks depend on the final font, so measure after it loads.
    void document.fonts.ready.then(() => {
      const el = textRef.current;
      if (cancelled || !el) {
        return;
      }
      let line = -1;
      let top = Number.NEGATIVE_INFINITY;
      el.querySelectorAll<HTMLElement>(".letter-word:not(.drop-cap)").forEach(
        (word) => {
          if (word.offsetTop > top + 2) {
            line += 1;
            top = word.offsetTop;
          }
          word.style.setProperty("--line", String(line));
        },
      );
      setRevealing(true);
      timer = window.setTimeout(
        () => onRevealedRef.current(),
        (line + 1) * LINE_MS + 700,
      );
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [revealed, text]);

  const state = revealed ? "is-done" : revealing ? "is-revealing" : "";

  return (
    <div
      className={`anim-fade grid w-full max-w-4xl items-center xl:max-w-5xl gap-5 lg:gap-10 ${
        side === "left"
          ? "lg:grid-cols-[14rem_minmax(0,1fr)]"
          : "lg:grid-cols-[minmax(0,1fr)_14rem]"
      }`}
    >
      <img
        src={cat}
        alt=""
        className={`kintsugi mx-auto aspect-square w-32 rounded-3xl object-cover sm:w-40 lg:w-56 [@media(max-height:700px)]:w-20 ${
          side === "right" ? "lg:order-2" : ""
        }`}
      />
      <div className="kintsugi max-h-[58dvh] overflow-y-auto rounded-3xl px-6 py-6 sm:px-8 lg:max-h-[66dvh] lg:px-10 lg:py-9">
        <p
          ref={textRef}
          className={`font-letter text-foam text-[1.125rem] leading-[1.7] text-pretty sm:text-xl lg:text-[1.375rem] xl:text-2xl ${state}`}
        >
          <span className="letter-word drop-cap" style={{ ["--line" as string]: 0 }}>
            {cap}
          </span>
          {tokens.map((token, i) =>
            /^\s+$/.test(token) || token === "" ? (
              token
            ) : (
              <span key={i} className="letter-word">
                {token}
              </span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}
