import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Tentacles } from "./Tentacles";

type Props = {
  finale: string;
  photoSrc: string;
  photoAlt: string;
  /** Candles are lit: the song stays quiet. */
  onSilence: () => void;
  /** Last candle went out: the song comes in. */
  onCelebrate: () => void;
};

type Phase = "rise" | "cake" | "boom";

const CANDLES = [76, 98, 120, 142, 164];
const COLORS = ["#2ec4b6", "#b87333", "#e6f0ea", "#c4894a", "#ffb4a8"];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useTween(target: number, ms: number) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  useEffect(() => {
    const from = valueRef.current;
    if (prefersReducedMotion() || ms <= 0) {
      valueRef.current = target;
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - (1 - p) ** 3;
      valueRef.current = from + (target - from) * eased;
      setValue(valueRef.current);
      if (p < 1) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);
  return value;
}

function fireworks(): () => void {
  const opts = { colors: COLORS, disableForReducedMotion: true, zIndex: 30 };
  confetti({ ...opts, particleCount: 140, angle: 60, spread: 70, startVelocity: 62, origin: { x: 0, y: 0.85 } });
  confetti({ ...opts, particleCount: 140, angle: 120, spread: 70, startVelocity: 62, origin: { x: 1, y: 0.85 } });
  const end = Date.now() + 3600;
  const burst = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(burst);
      return;
    }
    confetti({
      ...opts,
      particleCount: 70,
      spread: 360,
      startVelocity: 30,
      ticks: 80,
      gravity: 0.9,
      origin: { x: 0.1 + Math.random() * 0.8, y: 0.12 + Math.random() * 0.35 },
    });
  }, 260);
  const gentle = window.setInterval(() => {
    confetti({ ...opts, particleCount: 24, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
    confetti({ ...opts, particleCount: 24, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
  }, 2600);
  return () => {
    window.clearInterval(burst);
    window.clearInterval(gentle);
    confetti.reset();
  };
}

export function FinaleScene({ finale, photoSrc, photoAlt, onSilence, onCelebrate }: Props) {
  const [phase, setPhase] = useState<Phase>(() =>
    prefersReducedMotion() ? "cake" : "rise",
  );
  const [out, setOut] = useState<boolean[]>(() => CANDLES.map(() => false));
  const [round, setRound] = useState(0);
  const callbacks = useRef({ onSilence, onCelebrate });
  callbacks.current = { onSilence, onCelebrate };

  const intensity = useTween(phase === "rise" ? 1 : phase === "cake" ? 0.9 : 1, phase === "rise" ? 2600 : 1200);

  useEffect(() => {
    callbacks.current.onSilence();
  }, [round]);

  useEffect(() => {
    if (phase !== "rise") {
      return;
    }
    const id = window.setTimeout(() => setPhase("cake"), 2400);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "boom") {
      return;
    }
    return fireworks();
  }, [phase, round]);

  function blow(i: number) {
    if (phase !== "cake" || out[i]) {
      return;
    }
    const next = out.map((v, j) => v || j === i);
    setOut(next);
    if (next.every(Boolean)) {
      window.setTimeout(() => {
        setPhase("boom");
        callbacks.current.onCelebrate();
      }, 650);
    }
  }

  function again() {
    setOut(CANDLES.map(() => false));
    setPhase("cake");
    setRound((r) => r + 1);
  }

  const left = out.filter((v) => !v).length;
  const words = finale.split(" ");
  let letterIndex = 0;

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Tentacles intensity={intensity} />
      </div>

      {phase === "cake" ? (
        <div key={round} className="anim-cake flex flex-col items-center text-center">
          <h2 className="font-display text-foam text-3xl text-balance sm:text-4xl">
            Apaga las velas
          </h2>
          <p className="text-mist mt-2 text-sm" aria-live="polite">
            {left === CANDLES.length
              ? "Toca cada una"
              : left > 0
                ? `Quedan ${left}`
                : "Pide un deseo"}
          </p>
          <svg
            viewBox="0 0 240 220"
            className="mt-6 w-[min(78vw,22rem)] drop-shadow-[0_24px_40px_rgb(0_0_0/0.55)]"
            role="group"
            aria-label="Pastel con velas"
          >
            <ellipse cx="120" cy="204" rx="112" ry="12" fill="#1a3d32" />
            <rect x="28" y="134" width="184" height="68" rx="14" fill="#8a5428" />
            <path
              d="M28 150 q0-16 14-16 h156 q14 0 14 16 v4 q-8 10-16 0 q-8 12-18 0 q-9 14-20 0 q-8 10-18 0 q-9 13-20 0 q-8 10-18 0 q-9 14-20 0 q-8 10-18 0 q-8 12-16 0 z"
              fill="#e6f0ea"
            />
            <rect x="58" y="86" width="124" height="54" rx="12" fill="#b87333" />
            <path
              d="M58 100 q0-14 12-14 h100 q12 0 12 14 v3 q-7 9-14 0 q-8 12-17 0 q-8 10-16 0 q-8 13-17 0 q-8 10-16 0 q-8 12-16 0 q-7 9-14 0 z"
              fill="#e6f0ea"
            />
            {[44, 74, 104, 136, 166, 196].map((x, i) => (
              <circle key={x} cx={x} cy={i % 2 ? 182 : 174} r="3.2" fill={i % 2 ? "#2ec4b6" : "#c4894a"} />
            ))}
            {CANDLES.map((x, i) => (
              <g
                key={x}
                role="button"
                tabIndex={out[i] ? -1 : 0}
                aria-label={`Apagar vela ${i + 1}`}
                aria-pressed={out[i]}
                className={out[i] ? "" : "cursor-pointer"}
                onClick={() => blow(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    blow(i);
                  }
                }}
              >
                <rect x={x - 11} y="18" width="22" height="70" fill="transparent" />
                <rect x={x - 4} y="56" width="8" height="32" rx="2" fill="#e6f0ea" />
                <path d={`M${x - 4} 64 l8 -5 M${x - 4} 74 l8 -5 M${x - 4} 84 l8 -5`} stroke="#2ec4b6" strokeWidth="2" />
                <line x1={x} y1="56" x2={x} y2="51" stroke="#04211c" strokeWidth="1.5" />
                {out[i] ? (
                  <path
                    className="smoke"
                    d={`M${x} 50 q-6 -8 0 -16 q6 -8 0 -16`}
                    fill="none"
                    stroke="#a8c4b8"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                ) : (
                  <g className="flame" style={{ animationDelay: `${i * 0.13}s` }}>
                    <ellipse cx={x} cy="42" rx="6" ry="10" fill="#c4894a" opacity="0.45" />
                    <path d={`M${x} 30 q7 9 5 15 q-2 6 -5 6 q-3 0 -5 -6 q-2 -6 5 -15 z`} fill="#ffb4a8" />
                    <path d={`M${x} 38 q3 5 2 8 q-1 3 -2 3 q-1 0 -2 -3 q-1 -3 2 -8 z`} fill="#e6f0ea" />
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      ) : null}

      {phase === "boom" ? (
        <div key={round} className="flex flex-col items-center text-center">
          <img
            src={photoSrc}
            alt={photoAlt}
            className="anim-medallion kintsugi aspect-square w-36 rounded-full object-cover sm:w-44 lg:w-56 [@media(max-height:700px)]:w-24"
            style={{ animationDelay: "0.4s" }}
          />
          <h2
            className="font-display text-foam mt-6 text-[clamp(2.75rem,13vw,6rem)] leading-[1.05] [text-shadow:0_8px_32px_rgb(0_0_0/0.6)]"
            aria-label={finale}
          >
            {words.map((word, w) => (
              <span key={w}>
                <span className="inline-block whitespace-nowrap" aria-hidden="true">
                  {Array.from(word).map((char) => {
                    const delay = 0.9 + letterIndex++ * 0.06;
                    return (
                      <span
                        key={`${w}-${letterIndex}`}
                        className="finale-letter"
                        style={{ animationDelay: `${delay}s` }}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
                {w < words.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <button
            type="button"
            onClick={again}
            className="anim-fade border-bronze/50 text-foam hover:bg-kelp mt-8 cursor-pointer rounded-full border px-6 py-3 text-sm font-medium transition-colors"
            style={{ animationDelay: "2.6s" }}
          >
            Volver a celebrar
          </button>
        </div>
      ) : null}
    </div>
  );
}
