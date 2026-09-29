import { useState, type FormEvent } from "react";
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
    <div className="screen flex flex-col items-center justify-center bg-[#1a1216]">
      <form
        onSubmit={onSubmit}
        className="anim-fade w-full max-w-sm space-y-6 text-center"
      >
        <p className="text-xs tracking-[0.35em] text-rose-200/60 uppercase">
          {year}
        </p>
        <h1 className="text-3xl font-medium tracking-wide">Algo te espera</h1>
        <p className="text-sm text-white/55">
          Escribe la palabra que ya conoces.
        </p>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center outline-none focus:border-rose-200/40"
          placeholder="Contraseña"
        />
        {error ? <p className="text-sm text-rose-200/80">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full rounded-2xl bg-rose-200/90 py-3 text-[#2a1218] disabled:opacity-40"
        >
          {busy ? "…" : "Entrar"}
        </button>
        <TimezoneNotice />
      </form>
    </div>
  );
}
