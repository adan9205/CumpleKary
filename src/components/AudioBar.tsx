type Props = {
  paused: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (value: number) => void;
};

export function AudioBar({ paused, volume, onToggle, onVolume }: Props) {
  return (
    <div className="kintsugi flex items-center gap-3 rounded-2xl px-3 py-2">
      <button
        type="button"
        onClick={onToggle}
        className="text-teal min-w-20 cursor-pointer text-left text-sm font-medium"
        aria-pressed={!paused}
      >
        {paused ? "Reanudar" : "Pausar"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        className="accent-teal w-full"
        aria-label="Volumen"
      />
    </div>
  );
}
