type Props = {
  paused: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (value: number) => void;
};

export function AudioBar({ paused, volume, onToggle, onVolume }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/25 px-3 py-2 backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggle}
        className="min-w-16 text-sm text-rose-100"
      >
        {paused ? "Play" : "Pausa"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        className="w-full accent-rose-200"
        aria-label="Volumen"
      />
    </div>
  );
}
