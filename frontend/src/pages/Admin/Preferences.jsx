import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, H2, SUBTITLE, CARD, ALERT_ERROR, LOADING } from "../../lib/adminUi.js";

// Vue des préférences boissons agrégées (GET /api/admin/preferences),
// pour préparer les commandes de boissons de l'événement en un coup d'œil.
function Bar({ label, count, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-40 shrink-0 text-sm text-cream truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold-strong to-gold-deep rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-sm text-gold-strong font-semibold">{count}</span>
    </div>
  );
}

export default function Preferences() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch({ url: "/admin/preferences" })
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err?.response?.data?.message || "Impossible de charger les préférences."))
      .finally(() => setLoading(false));
  }, [authFetch]);

  if (loading) return <div className={LOADING}>Chargement…</div>;
  if (error) return <div className={ALERT_ERROR}>{error}</div>;

  const alcoolEntries = Object.entries(data.alcool || {}).sort((a, b) => b[1] - a[1]);
  const sansAlcoolEntries = Object.entries(data.sansAlcool || {}).sort((a, b) => b[1] - a[1]);
  const maxAlcool = Math.max(1, ...alcoolEntries.map(([, c]) => c));
  const maxSansAlcool = Math.max(1, ...sansAlcoolEntries.map(([, c]) => c));

  return (
    <div className={PAGE}>
      <h1 className={H1}>Préférences</h1>
      <p className={SUBTITLE}>
        Répartition des boissons pour les invités confirmés ({data.total} réponses) — utile pour préparer les commandes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={CARD}>
          <h2 className={H2}>Boissons alcoolisées</h2>
          <p className="text-cream-dim text-sm mb-3">
            {data.alcoolCount} / {data.total} invités en ont choisi au moins une
          </p>
          {alcoolEntries.length === 0 ? (
            <p className="text-cream-dim text-sm">Aucune préférence enregistrée.</p>
          ) : (
            alcoolEntries.map(([name, count]) => <Bar key={name} label={name} count={count} max={maxAlcool} />)
          )}
        </div>

        <div className={CARD}>
          <h2 className={H2}>Boissons non alcoolisées</h2>
          <p className="text-cream-dim text-sm mb-3">Toutes réponses confondues</p>
          {sansAlcoolEntries.length === 0 ? (
            <p className="text-cream-dim text-sm">Aucune préférence enregistrée.</p>
          ) : (
            sansAlcoolEntries.map(([name, count]) => <Bar key={name} label={name} count={count} max={maxSansAlcool} />)
          )}
        </div>
      </div>
    </div>
  );
}
