type Arm = {
  src: string;
  from: number;
  sway: "tentacle-sway" | "tentacle-sway-slow";
  left: string;
  width: string;
  height: string;
  lean: number;
  flip?: boolean;
  tone: "bronze" | "teal";
};

const ARMS: Arm[] = [
  {
    src: "/assets/tentacles/Tentacles1.svg",
    from: 0,
    sway: "tentacle-sway",
    left: "-18%",
    width: "62%",
    height: "78%",
    lean: -10,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles3.svg",
    from: 0.1,
    sway: "tentacle-sway-slow",
    left: "54%",
    width: "66%",
    height: "80%",
    lean: 10,
    flip: true,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles4.svg",
    from: 0.24,
    sway: "tentacle-sway",
    left: "-8%",
    width: "52%",
    height: "70%",
    lean: -4,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles5.svg",
    from: 0.38,
    sway: "tentacle-sway-slow",
    left: "50%",
    width: "54%",
    height: "72%",
    lean: 5,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles6.svg",
    from: 0.52,
    sway: "tentacle-sway",
    left: "-30%",
    width: "74%",
    height: "88%",
    lean: -16,
    flip: true,
    tone: "bronze",
  },
  {
    src: "/assets/tentacles/Tentacles7.svg",
    from: 0.68,
    sway: "tentacle-sway-slow",
    left: "52%",
    width: "78%",
    height: "90%",
    lean: 16,
    tone: "teal",
  },
  {
    src: "/assets/tentacles/Tentacles9.svg",
    from: 0.84,
    sway: "tentacle-sway",
    left: "16%",
    width: "70%",
    height: "46%",
    lean: 0,
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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-full w-full max-w-md overflow-hidden"
      aria-hidden="true"
    >
      {ARMS.map((arm, index) => {
        if (t < arm.from) {
          return null;
        }
        const grown = (t - arm.from) / (1 - arm.from);
        const reach = 0.58 + grown * 0.42;
        return (
          <div
            key={arm.src}
            className="absolute bottom-0"
            style={{
              left: arm.left,
              width: arm.width,
              height: arm.height,
              opacity: 0.38 + grown * 0.4,
              transform: `scaleX(${arm.flip ? -1 : 1}) scaleY(${reach}) rotate(${arm.lean}deg)`,
              transformOrigin: "50% 100%",
            }}
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
