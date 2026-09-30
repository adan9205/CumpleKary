import type { CSSProperties } from "react";

type Arm = {
  src: string;
  from: number;
  sway: "tentacle-sway" | "tentacle-sway-slow";
  /** Horizontal slot across the full width, not a side pile. */
  left: string;
  /** Size = min(vw, dvh): width limits phones, height limits desktops. */
  vw: number;
  dvh: number;
  lean: number;
  flip?: boolean;
  tone: "bronze" | "teal";
};

const ARMS: Arm[] = [
  {
    src: "/assets/tentacles/Tentacles1.svg",
    from: 0,
    sway: "tentacle-sway",
    left: "-4%",
    vw: 32,
    dvh: 40,
    lean: -12,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles3.svg",
    from: 0.14,
    sway: "tentacle-sway-slow",
    left: "16%",
    vw: 28,
    dvh: 34,
    lean: 8,
    flip: true,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles4.svg",
    from: 0.3,
    sway: "tentacle-sway",
    left: "34%",
    vw: 26,
    dvh: 32,
    lean: -6,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles5.svg",
    from: 0.44,
    sway: "tentacle-sway-slow",
    left: "50%",
    vw: 30,
    dvh: 36,
    lean: 10,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles6.svg",
    from: 0.58,
    sway: "tentacle-sway",
    left: "64%",
    vw: 28,
    dvh: 38,
    lean: -14,
    flip: true,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles7.svg",
    from: 0.72,
    sway: "tentacle-sway-slow",
    left: "80%",
    vw: 34,
    dvh: 42,
    lean: 14,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles9.svg",
    from: 0.88,
    sway: "tentacle-sway",
    left: "42%",
    vw: 36,
    dvh: 30,
    lean: 2,
    tone: "bronze",
  },
];

type Props = {
  intensity: number;
};

export function Tentacles({ intensity }: Props) {
  const t = Math.min(1, Math.max(0, intensity));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {ARMS.map((arm, index) => {
        if (t < arm.from) {
          return null;
        }
        const grown = (t - arm.from) / (1 - arm.from);
        // Most of the climb happens late, so one day reads against the last.
        const rise = grown ** 4.4;
        // >100 keeps the arm fully under the edge until it is close.
        const sunk = (1 - rise) * 135;
        return (
          <div
            key={arm.src}
            className="absolute bottom-0"
            style={
              {
                "--s": `min(${arm.vw}vw, ${arm.dvh}dvh)`,
                width: "var(--s)",
                height: "var(--s)",
                left: arm.left,
                opacity: 0.3 + rise * 0.55,
                transform: `translateY(${sunk}%) rotate(${arm.lean}deg) scaleX(${arm.flip ? -1 : 1})`,
                transformOrigin: "50% 100%",
              } as CSSProperties
            }
          >
            <div
              className={`${arm.sway} h-full w-full`}
              style={{
                backgroundColor:
                  arm.tone === "bronze"
                    ? "var(--color-bronze)"
                    : "var(--color-teal-deep)",
                animationDelay: `${index * 0.4}s`,
                WebkitMaskImage: `url(${arm.src})`,
                maskImage: `url(${arm.src})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center bottom",
                maskPosition: "center bottom",
                maskMode: "luminance",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
