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
        colors: ["#f6d6c8", "#f4b8c5", "#fff3d6", "#e8c39e"],
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
    <div className="screen relative flex flex-col bg-[linear-gradient(180deg,#1c1216_0%,#2a1820_50%,#1a1216_100%)]">
      <audio ref={audioRef} src={surprise.songSrc} playsInline preload="none" />

      {!started ? (
        <div className="anim-fade flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-xs tracking-[0.35em] text-rose-200/60 uppercase">
            {year}
          </p>
          <h1 className="mt-3 text-3xl">Ya es el día</h1>
          <button
            type="button"
            onClick={openSurprise}
            className="mt-10 rounded-full bg-rose-200/90 px-8 py-4 text-[#2a1218]"
          >
            Abrir sorpresa
          </button>
        </div>
      ) : (
        <div
          className="flex flex-1 flex-col"
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
                className="anim-fade max-h-[70dvh] w-full rounded-3xl object-cover"
              />
            ) : null}

            {slide.kind === "text" ? (
              <div className="anim-fade relative w-full max-w-lg px-2">
                <p className="text-center text-lg leading-relaxed text-rose-50/90 sm:text-xl">
                  {slide.text}
                </p>
                <img
                  src={slide.cat}
                  alt=""
                  className={`absolute w-14 opacity-80 sm:w-16 ${
                    index % 2 === 0
                      ? "-bottom-10 left-0"
                      : "-top-8 right-0"
                  }`}
                />
              </div>
            ) : null}

            {slide.kind === "gift" ? (
              <figure className="anim-fade w-full max-w-md text-center">
                <img
                  src={slide.imageSrc}
                  alt=""
                  className="mx-auto max-h-[50dvh] w-full rounded-3xl object-contain"
                />
                <figcaption className="mt-5 text-sm leading-relaxed text-white/75">
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
                  <div className="relative aspect-video overflow-hidden rounded-3xl bg-black">
                    <iframe
                      title="Video"
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${surprise.youtubeId}?playsinline=1&rel=0&enablejsapi=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="rounded-3xl bg-white/5 px-4 py-16 text-center text-sm text-white/55">
                    Video de YouTube (pon el id en config/{year}.ts)
                  </p>
                )}
              </div>
            ) : null}

            {slide.kind === "finale" ? (
              <div className="anim-fade text-center">
                <p className="text-3xl leading-snug sm:text-4xl">
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
              className="rounded-2xl bg-white/8 px-4 py-3 text-sm disabled:opacity-30"
            >
              Atrás
            </button>
            <p className="text-xs text-white/40">
              {index + 1} / {slides.length}
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={last}
              className="rounded-2xl bg-rose-200/90 px-4 py-3 text-sm text-[#2a1218] disabled:opacity-30"
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
