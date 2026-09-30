import type { CSSProperties } from "react";

type Arm = {
  src: string;
  from: number;
  sway: "tentacle-sway" | "tentacle-sway-slow";
  /** Horizontal slot across the full width, not a side pile. */
  left: string;
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
    lean: -12,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles3.svg",
    from: 0.14,
    sway: "tentacle-sway-slow",
    left: "16%",
    lean: 8,
    flip: true,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles4.svg",
    from: 0.3,
    sway: "tentacle-sway",
    left: "34%",
    lean: -6,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles5.svg",
    from: 0.44,
    sway: "tentacle-sway-slow",
    left: "50%",
    lean: 10,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles6.svg",
    from: 0.58,
    sway: "tentacle-sway",
    left: "64%",
    lean: -14,
    flip: true,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles7.svg",
    from: 0.72,
    sway: "tentacle-sway-slow",
    left: "80%",
    lean: 14,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles9.svg",
    from: 0.88,
    sway: "tentacle-sway",
    left: "42%",
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
        // Slow at first, then they rear up in the last days.
        const rise = grown ** 3.2;
        const sunk = (1 - rise) * 108;
        // Square: the drawing only fills the shorter side.
        const size = 18 + rise * 50;
        return (
          <div
            key={arm.src}
            className="absolute bottom-0"
            style={
              {
                width: `${size}dvh`,
                height: `${size}dvh`,
                left: arm.left,
                opacity: 0.34 + rise * 0.5,
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
