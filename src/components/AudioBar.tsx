type Props = {
  paused: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (value: number) => void;
};

export function AudioBar({ paused, volume, onToggle, onVolume }: Props) {
  return (
    <div className="bg-night-2/80 border-rose/15 flex items-center gap-3 rounded-2xl border px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className="text-gold min-w-16 text-left text-sm font-medium"
        aria-pressed={!paused}
      >
        {paused ? "Música" : "Pausa"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        className="accent-gold w-full"
        aria-label="Volumen"
      />
    </div>
  );
}
