import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchMeta } from "../lib/api";

export function HomePage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    fetchMeta()
      .then((data) => setYear(data.currentYear))
      .catch(() => setYear(2026));
  }, []);

  if (year == null) {
    return <div className="screen" />;
  }

  return <Navigate to={`/${year}`} replace />;
}
