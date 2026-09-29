import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { EditionResponse } from "../../shared/types";
import { CountdownScreen } from "../components/CountdownScreen";
import { PasswordScreen } from "../components/PasswordScreen";
import { SurpriseScreen } from "../components/SurpriseScreen";
import {
  fetchEdition,
  fetchSession,
  logVisit,
  unlock,
} from "../lib/api";

export function YearPage() {
  const { year: yearParam } = useParams();
  const [params] = useSearchParams();
  const year = Number(yearParam);
  const debug = params.get("debug");
  const key = params.get("key");

  const [gate, setGate] = useState<"load" | "password" | "ok" | "missing">(
    "load",
  );
  const [edition, setEdition] = useState<EditionResponse | null>(null);
  const [error, setError] = useState("");

  const loadEdition = useCallback(
    async (debugOverride?: string) => {
      const data = await fetchEdition(year, debugOverride ?? debug, key);
      setEdition(data);
    },
    [year, debug, key],
  );

  useEffect(() => {
    if (!Number.isInteger(year)) {
      setGate("missing");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const session = await fetchSession(year);
        if (cancelled) {
          return;
        }
        if (!session.authenticated) {
          setGate("password");
          return;
        }
        if (!session.visitLogged) {
          await logVisit(year).catch(() => undefined);
        }
        await loadEdition();
        if (!cancelled) {
          setGate("ok");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message === "unknown_year") {
          setGate("missing");
          return;
        }
        setError("No se pudo cargar.");
        setGate("password");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year, loadEdition]);

  async function onUnlock(password: string) {
    await unlock(year, password);
    await loadEdition();
    setGate("ok");
  }

  if (gate === "load") {
    return <div className="screen" />;
  }

  if (gate === "missing") {
    return (
      <div className="screen flex flex-col items-center justify-center text-center">
        <p className="text-cream-2 text-sm">Esta edición no existe.</p>
      </div>
    );
  }

  if (gate === "password") {
    return (
      <div>
        {error ? (
          <p className="text-ember pt-[var(--safe-t)] text-center text-xs">
            {error}
          </p>
        ) : null}
        <PasswordScreen year={year} onUnlock={onUnlock} />
      </div>
    );
  }

  if (!edition || !edition.ok) {
    return (
      <div className="screen flex items-center justify-center">
        <p className="text-cream-2 text-sm">No se pudo abrir esta edición.</p>
      </div>
    );
  }

  if (edition.phase === "countdown") {
    return (
      <CountdownScreen
        edition={edition.edition}
        simulated={edition.simulated}
        nowUtc={edition.nowUtc}
        onReached={() => {
          // In debug mode the server clock is frozen at ?debug=..., so
          // re-fetching with the same value would return countdown forever.
          // Jump the simulated clock to the target instead.
          void loadEdition(
            edition.simulated ? edition.edition.targetUtc : undefined,
          );
        }}
      />
    );
  }

  return (
    <SurpriseScreen year={year} surprise={edition.surprise} />
  );
}
