import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { SurprisePayload } from "../../shared/types";
import { AudioBar } from "./AudioBar";
import { InstructionsModal } from "./InstructionsModal";

type Props = {
  year: number;
  surprise: SurprisePayload;
};

type Slide =
  | { kind: "photo" }
  | { kind: "text"; text: string; cat: string }
  | { kind: "gift"; imageSrc: string; caption: string }
  | { kind: "video" }
  | { kind: "finale" };

function instructionsKey(year: number) {
  return `instructions_seen_${year}`;
}

export function SurpriseScreen({ year, surprise }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [index, setIndex] = useState(0);
  const [help, setHelp] = useState(false);

  const slides = useMemo<Slide[]>(() => {
    const texts: Slide[] = surprise.paragraphs.map((text, i) => ({
      kind: "text",
      text,
      cat: surprise.cats[i % surprise.cats.length] ?? surprise.cats[0],
    }));
    return [
      { kind: "photo" },
      ...texts,
      { kind: "gift", imageSrc: surprise.gift1.imageSrc, caption: surprise.gift1.caption },
      { kind: "gift", imageSrc: surprise.gift2.imageSrc, caption: surprise.gift2.caption },
      { kind: "video" },
      { kind: "finale" },
    ];
  }, [surprise]);

  const slide = slides[index] ?? slides[0];
  const last = index === slides.length - 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((current) => {
        const next = current + dir;
        if (next < 0 || next >= slides.length) {
          return current;
        }
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!started) {
        return;
      }
      if (event.key === "ArrowRight") {
        go(1);
      }
      if (event.key === "ArrowLeft") {
        go(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, started]);

  useEffect(() => {
    if (slide?.kind !== "finale") {
      return;
    }
    const burst = () =>
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#2ec4b6", "#b87333", "#e6f0ea", "#c4894a", "#0f241c"],
      });
    burst();
    const id = window.setInterval(burst, 2200);
    return () => window.clearInterval(id);
  }, [slide?.kind]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      let data: { event?: string; info?: number } | null = null;
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data) as { event?: string; info?: number };
        } catch {
          data = null;
        }
      } else if (typeof event.data === "object" && event.data) {
        data = event.data as { event?: string; info?: number };
      }
      if (data?.event === "onStateChange" && data.info === 1) {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          audio.pause();
          setPaused(true);
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  async function openSurprise() {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.volume = volume;
      try {
        await audio.play();
        setPaused(false);
      } catch {
        setPaused(true);
      }
    }
    setStarted(true);
    const key = instructionsKey(year);
    if (!window.localStorage.getItem(key)) {
      setHelp(true);
    }
  }

  function closeHelp() {
    window.localStorage.setItem(instructionsKey(year), "1");
    setHelp(false);
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        setPaused(false);
      } catch {
        setPaused(true);
      }
    } else {
      audio.pause();
      setPaused(true);
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    touchX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchX.current;
    const end = event.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start == null || end == null) {
      return;
    }
    const delta = end - start;
    if (Math.abs(delta) < 48) {
      return;
    }
    go(delta < 0 ? 1 : -1);
  }

  return (
    <div className="screen night-sky relative flex flex-col overflow-hidden">
      <audio ref={audioRef} src={surprise.songSrc} playsInline preload="none" />

      {!started ? (
        <div className="anim-fade relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <img src="/assets/illaoi/tide.svg" alt="" className="illaoi-wash" />
          <h1 className="font-display text-foam relative text-4xl text-balance">
            Ya es el día
          </h1>
          <p className="text-mist relative mt-3 text-sm">
            Sube el volumen. Empieza con música.
          </p>
          <button
            type="button"
            onClick={openSurprise}
            className="bg-teal text-ink hover:bg-teal-deep relative mt-10 cursor-pointer rounded-full px-9 py-4 font-medium shadow-[0_14px_36px_-12px_rgb(46_196_182/0.5)] transition-colors"
          >
            Abrir sorpresa
          </button>
          <p className="text-mist/70 relative mt-12 text-xs tracking-[0.3em]">
            {year}
          </p>
        </div>
      ) : (
        <div
          className="relative z-10 flex flex-1 flex-col"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="mb-4">
            <AudioBar
              paused={paused}
              volume={volume}
              onToggle={() => void toggleAudio()}
              onVolume={setVolume}
            />
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
            {slide.kind === "photo" ? (
              <img
                src={surprise.photoSrc}
                alt={surprise.photoAlt}
                className="anim-photo kintsugi mx-auto block h-auto max-h-[70dvh] w-auto max-w-full rounded-3xl object-contain"
              />
            ) : null}

            {slide.kind === "text" ? (
              <div className="anim-fade relative w-full max-w-lg px-2">
                <p className="text-foam text-center text-lg leading-relaxed text-pretty sm:text-xl">
                  {slide.text}
                </p>
                <img
                  src={slide.cat}
                  alt=""
                  className={`kintsugi absolute w-14 rounded-xl opacity-80 sm:w-16 ${
                    index % 2 === 0
                      ? "-bottom-20 left-0"
                      : "-top-20 right-0"
                  }`}
                />
              </div>
            ) : null}

            {slide.kind === "gift" ? (
              <figure className="anim-fade w-full max-w-5xl text-center">
                <img
                  src={slide.imageSrc}
                  alt=""
                  className="mx-auto block h-auto max-h-[62dvh] w-auto max-w-full object-contain shadow-[0_18px_50px_-18px_rgb(0_0_0/0.7)]"
                />
                <figcaption className="text-mist mt-5 text-sm leading-relaxed text-pretty">
                  {slide.caption}
                </figcaption>
              </figure>
            ) : null}

            {slide.kind === "video" ? (
              <div
                ref={videoWrapRef}
                className="anim-fade w-full max-w-lg"
                onPointerDown={() => {
                  const audio = audioRef.current;
                  if (audio && !audio.paused) {
                    audio.pause();
                    setPaused(true);
                  }
                }}
              >
                {surprise.youtubeId ? (
                  <div className="kintsugi relative aspect-video overflow-hidden rounded-3xl bg-black">
                    <iframe
                      title="Video"
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${surprise.youtubeId}?playsinline=1&rel=0&enablejsapi=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="kintsugi text-mist rounded-3xl px-4 py-16 text-center text-sm">
                    Video de YouTube (pon el id en config/{year}.ts)
                  </p>
                )}
              </div>
            ) : null}

            {slide.kind === "finale" ? (
              <div className="anim-fade text-center">
                <p className="font-display text-foam text-4xl leading-snug text-balance sm:text-5xl">
                  {surprise.finale}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 pb-[max(0.25rem,var(--safe-b))]">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="border-bronze/40 text-foam hover:bg-kelp disabled:border-moss/40 disabled:text-mist/40 cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-colors disabled:cursor-not-allowed"
            >
              Atrás
            </button>
            <p className="text-mist text-xs tabular-nums">
              {index + 1} / {slides.length}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={last}
              className="bg-teal text-ink hover:bg-teal-deep disabled:bg-kelp disabled:text-mist/40 cursor-pointer rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_8px_22px_-10px_rgb(46_196_182/0.45)] transition-colors disabled:cursor-not-allowed disabled:shadow-none"
            >
              {last ? "Fin" : "Siguiente"}
            </button>
          </div>
        </div>
      )}

      <InstructionsModal open={help} onClose={closeHelp} />
    </div>
  );
}
