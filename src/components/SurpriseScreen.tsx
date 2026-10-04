import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { SurprisePayload } from "../../shared/types";
import { AudioBar } from "./AudioBar";
import { FinaleScene } from "./FinaleScene";
import { InstructionsModal } from "./InstructionsModal";
import { LetterSlide } from "./LetterSlide";

type Props = {
  year: number;
  surprise: SurprisePayload;
};

type Slide =
  | { kind: "photo" }
  | { kind: "text"; text: string; cat: string }
  | { kind: "gift"; imageSrc: string; caption: string; downloadName?: string }
  | { kind: "video" }
  | { kind: "finale" };

type YouTubeMessage = {
  event?: string;
  info?: number | { playerState?: number } | null;
};

type FullscreenTarget = HTMLIFrameElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function instructionsKey(year: number) {
  return `instructions_seen_${year}`;
}

function extensionOf(src: string) {
  return src.match(/\.[a-z0-9]+$/i)?.[0] ?? ".png";
}

export function SurpriseScreen({ year, surprise }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const maximizedRef = useRef(false);
  const touchX = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [index, setIndex] = useState(0);
  const [help, setHelp] = useState(false);
  const [revealed, setRevealed] = useState<ReadonlySet<number>>(() => new Set());

  const slides = useMemo<Slide[]>(() => {
    const texts: Slide[] = surprise.paragraphs.map((text, i) => ({
      kind: "text",
      text,
      cat: surprise.cats[i % surprise.cats.length] ?? surprise.cats[0],
    }));
    return [
      { kind: "photo" },
      ...texts,
      {
        kind: "gift",
        imageSrc: surprise.gift1.imageSrc,
        caption: surprise.gift1.caption,
        downloadName: `vale-${year}${extensionOf(surprise.gift1.imageSrc)}`,
      },
      { kind: "gift", imageSrc: surprise.gift2.imageSrc, caption: surprise.gift2.caption },
      { kind: "video" },
      { kind: "finale" },
    ];
  }, [surprise, year]);

  const slide = slides[index] ?? slides[0];
  const last = index === slides.length - 1;

  const markRevealed = useCallback((i: number) => {
    setRevealed((current) => (current.has(i) ? current : new Set(current).add(i)));
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (dir === 1 && slides[index]?.kind === "text" && !revealed.has(index)) {
        markRevealed(index);
        return;
      }
      const next = index + dir;
      if (next < 0 || next >= slides.length) {
        return;
      }
      maximizedRef.current = false;
      if (slides[next]?.kind !== "video") {
        setIndex(next);
        return;
      }
      // Fullscreen needs the user gesture that is still active right here.
      flushSync(() => setIndex(next));
      maximizeVideo();
    },
    [index, slides, revealed, markRevealed],
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
      if (!started || help) {
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
  }, [go, help, started]);

  useEffect(() => {
    if (slide?.kind !== "video" && slide?.kind !== "finale") {
      return;
    }
    const audio = audioRef.current;
    if (!audio || audio.paused) {
      return;
    }
    audio.pause();
    setPaused(true);
    return () => {
      void audio
        .play()
        .then(() => setPaused(false))
        .catch(() => setPaused(true));
    };
  }, [slide?.kind]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!/^https:\/\/(www\.)?youtube(-nocookie)?\.com$/.test(event.origin)) {
        return;
      }
      let data: YouTubeMessage | null = null;
      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data) as YouTubeMessage;
        } catch {
          data = null;
        }
      } else if (typeof event.data === "object" && event.data) {
        data = event.data as YouTubeMessage;
      }
      const playing =
        (data?.event === "onStateChange" && data.info === 1) ||
        (data?.event === "infoDelivery" &&
          typeof data.info === "object" &&
          data.info?.playerState === 1);
      if (!playing) {
        return;
      }
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setPaused(true);
      }
      maximizeVideo();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function maximizeVideo() {
    const frame = iframeRef.current as FullscreenTarget | null;
    if (!frame || maximizedRef.current || document.fullscreenElement) {
      return;
    }
    maximizedRef.current = true;
    const request = frame.requestFullscreen ?? frame.webkitRequestFullscreen;
    void Promise.resolve(request?.call(frame)).catch(() => {
      maximizedRef.current = false;
    });
  }

  function listenToPlayer() {
    const target = iframeRef.current?.contentWindow;
    if (!target) {
      return;
    }
    const send = (message: object) =>
      target.postMessage(JSON.stringify({ id: 1, channel: "widget", ...message }), "*");
    send({ event: "listening" });
    send({ event: "command", func: "addEventListener", args: ["onStateChange"] });
  }

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

  function silence() {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setPaused(true);
    }
  }

  async function celebrate() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.loop = true;
    audio.volume = 0;
    try {
      await audio.play();
      setPaused(false);
    } catch {
      setPaused(true);
      return;
    }
    const start = performance.now();
    const ramp = (now: number) => {
      const p = Math.min(1, (now - start) / 1600);
      audio.volume = volume * p;
      if (p < 1) {
        requestAnimationFrame(ramp);
      }
    };
    requestAnimationFrame(ramp);
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
      <audio
        ref={audioRef}
        src={surprise.songSrc}
        playsInline
        preload="none"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />

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
              <LetterSlide
                key={index}
                text={slide.text}
                cat={slide.cat}
                side={index % 2 === 1 ? "left" : "right"}
                revealed={revealed.has(index)}
                onRevealed={() => markRevealed(index)}
              />
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
                {slide.downloadName ? (
                  <a
                    href={slide.imageSrc}
                    download={slide.downloadName}
                    className="border-bronze/50 text-foam hover:bg-kelp mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
                    </svg>
                    Descargar vale
                  </a>
                ) : null}
              </figure>
            ) : null}

            {slide.kind === "video" ? (
              <div
                ref={videoWrapRef}
                className="anim-fade w-full max-w-lg lg:max-w-3xl"
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
                      ref={iframeRef}
                      title="Video de cumpleaños"
                      className="absolute inset-0 h-full w-full"
                      onLoad={listenToPlayer}
                      src={`https://www.youtube-nocookie.com/embed/${surprise.youtubeId}?autoplay=1&playsinline=0&fs=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
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
              <FinaleScene
                finale={surprise.finale}
                photoSrc={surprise.photoSrc}
                photoAlt={surprise.photoAlt}
                onSilence={silence}
                onCelebrate={() => void celebrate()}
              />
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 pb-[max(0.25rem,var(--safe-b))]">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="border-bronze/40 text-foam hover:bg-kelp disabled:border-moss/40 disabled:text-mist cursor-pointer rounded-2xl border px-4 py-3 text-sm transition-colors disabled:cursor-not-allowed"
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
              className="bg-teal text-ink hover:bg-teal-deep disabled:bg-kelp disabled:text-mist cursor-pointer rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_8px_22px_-10px_rgb(46_196_182/0.45)] transition-colors disabled:cursor-not-allowed disabled:shadow-none"
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
