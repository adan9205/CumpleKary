import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InstructionsModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-[rgb(7_20_16/0.72)] p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="anim-fade kintsugi w-full max-w-sm rounded-3xl px-5 py-6 pb-[max(1.5rem,var(--safe-b))]">
        <div className="flex items-start gap-3">
          <img
            src="/assets/illaoi/idol.svg"
            alt=""
            className="mt-0.5 h-14 w-10 shrink-0 object-cover object-top"
          />
          <div>
            <h2
              id="instructions-title"
              className="font-display text-foam text-lg"
            >
              Cómo navegar
            </h2>
            <p className="text-mist mt-2 text-sm leading-relaxed">
              Avanza y retrocede las diapositivas con los botones, deslizando o
              con las flechas del teclado.
            </p>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="bg-teal text-ink hover:bg-teal-deep mt-6 w-full cursor-pointer rounded-2xl py-3 font-medium transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
