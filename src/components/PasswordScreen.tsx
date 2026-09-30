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
    <div className="screen night-sky flex flex-col items-center justify-center overflow-hidden">
      <img src="/assets/illaoi/tide.svg" alt="" className="illaoi-wash" />
      <form
        onSubmit={onSubmit}
        className="anim-fade relative z-10 w-full max-w-sm text-center lg:max-w-md"
      >
        <h1 className="font-display text-foam text-3xl tracking-wide text-balance lg:text-5xl">
          Algo te espera
        </h1>
        <p className="text-mist mt-3 text-sm">
          Escribe la palabra que ya conoces.
        </p>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-bronze/40 bg-kelp text-foam focus:border-teal mt-8 w-full rounded-2xl border px-4 py-3 text-center outline-none transition-colors focus-visible:outline-0"
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
          className="bg-teal text-ink hover:bg-teal-deep disabled:bg-kelp disabled:text-mist/60 mt-3 w-full cursor-pointer rounded-2xl py-3 font-medium shadow-[0_10px_28px_-10px_rgb(46_196_182/0.45)] transition-colors disabled:shadow-none"
        >
          {busy ? "Abriendo…" : "Entrar"}
        </button>
        <div className="mt-10">
          <TimezoneNotice timeZone={viewerTimeZone()} />
        </div>
        <p className="text-mist/70 mt-6 text-xs tracking-[0.3em]">{year}</p>
      </form>
    </div>
  );
}
