import { useState, type FormEvent } from "react";
import { viewerTimeZone } from "../lib/api";
import { TimezoneNotice } from "./TimezoneNotice";

type Props = {
  year: number;
  onUnlock: (password: string) => Promise<void>;
};

export function PasswordScreen({ year, onUnlock }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onUnlock(password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "error";
      if (message === "too_many_attempts") {
        setError("Demasiados intentos. Espera unos minutos.");
      } else if (message === "invalid_password") {
        setError("Esa no es. Prueba otra vez.");
      } else {
        setError("No se pudo entrar. Intenta de nuevo.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen night-sky flex flex-col items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="anim-fade w-full max-w-sm text-center"
      >
        <h1 className="text-cream text-3xl font-medium tracking-wide text-balance">
          Algo te espera
        </h1>
        <p className="text-cream-2 mt-3 text-sm">
          Escribe la palabra que ya conoces.
        </p>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-rose/25 bg-night-2 text-cream focus:border-gold mt-8 w-full rounded-2xl border px-4 py-3 text-center outline-none transition-colors focus-visible:outline-0"
          placeholder="Contraseña"
        />
        <p
          className="text-ember mt-3 min-h-5 text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
        <button
          type="submit"
          disabled={busy || !password}
          className="bg-gold text-ink hover:bg-gold-deep disabled:bg-night-2 disabled:text-cream-2/60 mt-3 w-full rounded-2xl py-3 font-medium shadow-[0_10px_28px_-10px_rgb(242_193_78/0.55)] transition-colors disabled:shadow-none"
        >
          {busy ? "Abriendo…" : "Entrar"}
        </button>
        <div className="mt-10">
          <TimezoneNotice timeZone={viewerTimeZone()} />
        </div>
        <p className="text-rose/70 mt-6 text-xs tracking-[0.3em]">{year}</p>
      </form>
    </div>
  );
}
