import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, SUBTITLE, CARD, ALERT_ERROR, LOADING } from "../../lib/adminUi.js";

// Dashboard : statistiques essentielles depuis GET /api/admin/dashboard.
function StatCard({ label, value, hint }) {
  return (
    <div className={CARD}>
      <div className="font-display text-3xl text-gold-strong mb-1">{value}</div>
      <div className="text-cream text-sm">{label}</div>
      {hint && <div className="text-cream-dim text-xs mt-1">{hint}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch({ url: "/admin/dashboard" })
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err?.response?.data?.message || "Impossible de charger le dashboard."))
      .finally(() => setLoading(false));
  }, [authFetch]);

  if (loading) return <div className={LOADING}>Chargement du dashboard…</div>;
  if (error) return <div className={ALERT_ERROR}>{error}</div>;

  const g = data.guests;

  return (
    <div className={PAGE}>
      <h1 className={H1}>Dashboard</h1>
      <p className={SUBTITLE}>Vue d'ensemble de votre événement.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Invitations" value={data.invitations} />
        <StatCard label="Invités (total)" value={g.total} />
        <StatCard label="Confirmés" value={g.confirmed} />
        <StatCard label="Déclinés" value={g.declined} />
        <StatCard label="En attente" value={g.pending} />
        <StatCard label="Présents" value={g.present} />
        <StatCard label="Personnes attendues" value={data.peopleExpected} hint="Effectif total confirmé" />
        <StatCard label="Personnes présentes" value={data.peoplePresent} hint="Check-in effectué" />
        <StatCard label="Taux de confirmation" value={`${data.confirmationRate}%`} />
        <StatCard label="Messages livre d'or" value={data.guestbookMessages} />
      </div>
    </div>
  );
}
