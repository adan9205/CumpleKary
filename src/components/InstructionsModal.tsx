type Props = {
  open: boolean;
  onClose: () => void;
};

export function InstructionsModal({ open, onClose }: Props) {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/55 p-4 sm:items-center">
      <div className="anim-fade w-full max-w-sm rounded-3xl bg-[#24181c] px-5 py-6 pb-[max(1.5rem,var(--safe-b))] shadow-2xl">
        <p className="text-xs tracking-[0.3em] text-rose-200/70 uppercase">
          Cómo navegar
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Avanza y retrocede las diapositivas con los botones, deslizando o con
          las flechas del teclado.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-rose-200/90 py-3 text-[#2a1218]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
