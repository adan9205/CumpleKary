type Props = {
  open: boolean;
  onClose: () => void;
};

export function InstructionsModal({ open, onClose }: Props) {
  if (!open) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[rgb(26_13_23/0.7)] p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
    >
      <div className="anim-fade bg-night-2 border-rose/20 w-full max-w-sm rounded-3xl border px-5 py-6 pb-[max(1.5rem,var(--safe-b))] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.7)]">
        <h2 id="instructions-title" className="text-cream text-lg font-medium">
          Cómo navegar
        </h2>
        <p className="text-cream-2 mt-2 text-sm leading-relaxed">
          Avanza y retrocede las diapositivas con los botones, deslizando o con
          las flechas del teclado.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="bg-gold text-ink hover:bg-gold-deep mt-6 w-full rounded-2xl py-3 font-medium transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
