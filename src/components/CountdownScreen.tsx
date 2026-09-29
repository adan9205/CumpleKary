import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicEdition } from "../../shared/types";
import { pad, remaining, stageNow } from "../lib/time";
import { CatPeek } from "./CatPeek";
import { TimezoneNotice } from "./TimezoneNotice";

type Props = {
  edition: PublicEdition;
  simulated: boolean;
  /** Server "now" (UTC ISO) at fetch time. Countdown ticks from here. */
  nowUtc: string;
  onReached: () => void;
};

function caption(days: number): string {
  if (days <= 1) {
    return "ya casi";
  }
  return `faltan ${days} días`;
}

export function CountdownScreen({
  edition,
  simulated,
  nowUtc,
  onReached,
}: Props) {
  // Offset between server "now" and local clock. Non-zero when simulated
  // (or when the device clock drifts). Countdown always follows the server.
  const offset = useMemo(() => {
    const server = Date.parse(nowUtc);
    return Number.isFinite(server) ? server - Date.now() : 0;
  }, [nowUtc]);
  const [now, setNow] = useState(() => Date.now() + offset);
  const [peek, setPeek] = useState(false);

  const remain = useMemo(() => remaining(edition.targetUtc, now), [edition.targetUtc, now]);
  const stage = useMemo(() => stageNow(edition, remain), [edition, remain]);

  useEffect(() => {
    setNow(Date.now() + offset);
    const id = window.setInterval(() => setNow(Date.now() + offset), 250);
    return () => window.clearInterval(id);
  }, [offset]);

  const reachedRef = useRef(false);
  useEffect(() => {
    if (remain.totalMs <= 0 && !reachedRef.current) {
      reachedRef.current = true;
      onReached();
    }
  }, [remain.totalMs, onReached]);

  useEffect(() => {
    let hideTimer = 0;
    function show() {
      setPeek(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setPeek(false), 4000);
    }
    const first = window.setTimeout(show, 8000);
    let next = 0;
    function loop() {
      next = window.setTimeout(
        () => {
          show();
          loop();
        },
        25000 + Math.floor(Math.random() * 15000),
      );
    }
    loop();
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(next);
      window.clearTimeout(hideTimer);
    };
  }, [stage.id]);

  function onClock() {
    setPeek(true);
    window.setTimeout(() => setPeek(false), 4000);
  }

  return (
    <div
      className="screen relative flex flex-col items-center justify-center overflow-hidden transition-[background] duration-1000"
      style={{ background: stage.gradient }}
    >
      <div className="anim-fade w-full max-w-md text-center">
        <h1 className="text-cream text-3xl font-medium">Falta poco</h1>
        <button
          type="button"
          onClick={onClock}
          className="mt-10 grid w-full grid-cols-4 gap-2"
          aria-label="Contador"
        >
          {[
            [remain.days, "días"],
            [remain.hours, "hrs"],
            [remain.minutes, "min"],
            [remain.seconds, "seg"],
          ].map(([value, label]) => (
            <div
              key={String(label)}
              className="bg-night/45 ring-rose/15 rounded-2xl px-1 py-4 ring-1"
            >
              <div className="tick text-cream text-3xl tabular-nums sm:text-4xl">
                {typeof value === "number" ? pad(value) : value}
              </div>
              <div className="text-cream-2 mt-1 text-[10px] tracking-widest uppercase">
                {label}
              </div>
            </div>
          ))}
        </button>
        <div className="mt-12">
          <TimezoneNotice timeZone={edition.timeZone} />
        </div>
        <p className="text-rose/70 mt-6 text-xs tracking-[0.3em]">
          {edition.year}
        </p>
        {simulated ? (
          <p className="text-gold mt-4 text-[10px] tracking-widest uppercase">
            modo prueba
          </p>
        ) : null}
      </div>
      <CatPeek
        src={stage.catSrc}
        visible={peek}
        caption={caption(remain.days)}
      />
    </div>
  );
}
