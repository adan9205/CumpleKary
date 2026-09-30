type Arm = {
  d: string;
  from: number;
  sway: "tentacle-sway" | "tentacle-sway-slow";
};

const ARMS: Arm[] = [
  {
    from: 0,
    sway: "tentacle-sway",
    d: "M18 298 C40 250 28 210 52 176 C70 148 48 128 62 98",
  },
  {
    from: 0.08,
    sway: "tentacle-sway-slow",
    d: "M382 298 C360 248 374 206 348 174 C328 148 350 126 338 96",
  },
  {
    from: 0.18,
    sway: "tentacle-sway",
    d: "M48 300 C70 262 86 228 78 190 C70 154 96 140 90 108",
  },
  {
    from: 0.32,
    sway: "tentacle-sway-slow",
    d: "M352 300 C330 260 316 224 324 186 C332 150 306 138 312 104",
  },
  {
    from: 0.46,
    sway: "tentacle-sway",
    d: "M8 292 C36 268 22 232 44 204 C62 180 36 164 50 132 C58 112 44 98 56 80",
  },
  {
    from: 0.6,
    sway: "tentacle-sway-slow",
    d: "M392 292 C364 266 378 230 356 202 C338 178 364 160 350 128 C342 108 356 94 344 76",
  },
  {
    from: 0.74,
    sway: "tentacle-sway",
    d: "M72 302 C92 270 118 248 108 210 C100 178 128 168 122 136",
  },
  {
    from: 0.88,
    sway: "tentacle-sway-slow",
    d: "M328 302 C308 270 282 248 292 210 C300 178 272 168 278 136",
  },
];

type Props = {
  intensity: number;
};

export function Tentacles({ intensity }: Props) {
  const t = Math.min(1, Math.max(0, intensity));
  const reach = 0.42 + t * 0.58;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <g transform={`translate(200 300) scale(1 ${reach}) translate(-200 -300)`}>
        {ARMS.map((arm, i) => {
          if (t < arm.from) {
            return null;
          }
          const grown = (t - arm.from) / (1 - arm.from);
          const width = 3.2 + grown * 5.5;
          return (
            <path
              key={arm.d}
              className={arm.sway}
              d={arm.d}
              fill="none"
              stroke={i % 2 === 0 ? "#b87333" : "#1a8f86"}
              strokeWidth={width}
              strokeLinecap="round"
              opacity={0.28 + grown * 0.42}
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          );
        })}
      </g>
    </svg>
  );
}
