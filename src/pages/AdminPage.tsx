import { useEffect, useState, type FormEvent } from "react";
import {
  adminLogin,
  fetchAdminSession,
  fetchAdminVisits,
} from "../lib/api";

function deviceHint(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return "iOS";
  }
  if (/Android/i.test(ua)) {
    return "Android";
  }
  if (/Windows/i.test(ua)) {
    return "Windows";
  }
  if (/Mac/i.test(ua)) {
    return "Mac";
  }
  return ua.slice(0, 48) || "—";
}

function place(row: { city: string; region: string; country: string }) {
  return [row.city, row.region, row.country].filter(Boolean).join(", ") || "—";
}

export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [year, setYear] = useState(2026);
  const [years, setYears] = useState<number[]>([2026]);
  const [total, setTotal] = useState(0);
  const [visits, setVisits] = useState<
    Awaited<ReturnType<typeof fetchAdminVisits>>["visits"]
  >([]);

  useEffect(() => {
    fetchAdminSession()
      .then((s) => setAuthed(Boolean(s.authenticated && s.admin)))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) {
      return;
    }
    fetchAdminVisits(year)
      .then((data) => {
        setVisits(data.visits);
        setTotal(data.total);
        setYears(data.years);
        setYear(data.year);
      })
      .catch(() => setError("No se pudieron cargar las visitas."));
  }, [authed, year]);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await adminLogin(password);
      setAuthed(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message === "too_many_attempts"
          ? "Demasiados intentos."
          : "Contraseña incorrecta.",
      );
    }
  }

  return (
    <div className="screen mx-auto w-full max-w-3xl">
      <h1 className="text-xl">Admin</h1>
      <p className="mt-1 text-xs text-cream-2">noindex</p>

      {!authed ? (
        <form onSubmit={onLogin} className="mt-10 max-w-sm space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border-rose/25 bg-night-2 text-cream focus:border-gold border px-4 py-3 outline-none focus-visible:outline-0"
            placeholder="ADMIN_PASSWORD"
          />
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-2xl bg-gold text-ink hover:bg-gold-deep py-3 font-medium transition-colors"
          >
            Entrar
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-6">
          <label className="block text-sm text-cream">
            Edición
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="mt-2 block w-full rounded-2xl border-rose/25 bg-night-2 text-cream border px-3 py-2"
            >
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-cream">Total {year}: {total}</p>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <div className="overflow-x-auto rounded-2xl border-rose/20 border">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-night-2 text-cream-2">
                <tr>
                  <th className="px-3 py-2">Fecha UTC</th>
                  <th className="px-3 py-2">Zona</th>
                  <th className="px-3 py-2">Lugar</th>
                  <th className="px-3 py-2">Dispositivo</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((row) => (
                  <tr key={row.id} className="border-t border-rose/10">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {row.visitedAt.replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="px-3 py-2">{row.timeZone}</td>
                    <td className="px-3 py-2">{place(row)}</td>
                    <td className="px-3 py-2">{deviceHint(row.userAgent)}</td>
                  </tr>
                ))}
                {visits.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-cream-2" colSpan={4}>
                      Sin visitas aún.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
