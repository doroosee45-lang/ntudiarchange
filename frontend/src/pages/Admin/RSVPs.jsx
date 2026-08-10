import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, SUBTITLE, ALERT_ERROR, LOADING, TABLE_WRAP, TABLE, TH, TD, EMPTY_ROW, TAB_ACTIVE, TAB_IDLE, badgeClass } from "../../lib/adminUi.js";

const FILTERS = [
  { value: "all", label: "Tous" },
  { value: "confirmed", label: "Confirmés" },
  { value: "declined", label: "Déclinés" },
  { value: "pending", label: "En attente" },
];

const STATUS_LABELS = {
  confirmed: "Confirmé",
  declined: "Décliné",
  pending: "En attente",
};

// Consultation des RSVP avec filtres — vue détaillée incluant les boissons
// choisies par chaque invité.
export default function RSVPs() {
  const { authFetch } = useAuth();
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = filter !== "all" ? { filter } : {};
      const res = await authFetch({ url: "/admin/rsvp", params });
      setList(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les RSVP.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const totalPeople = list
    .filter((g) => g.attendance === "confirmed")
    .reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);

  return (
    <div className={PAGE}>
      <h1 className={H1}>RSVP</h1>
      <p className={SUBTITLE}>Réponses des invités, avec leurs préférences de boissons.</p>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.value} className={filter === f.value ? TAB_ACTIVE : TAB_IDLE} onClick={() => setFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
        {filter !== "declined" && (
          <div className="text-cream-dim text-sm">
            Effectif confirmé (vue actuelle) : <strong className="text-gold-strong">{totalPeople}</strong>
          </div>
        )}
      </div>

      {error && <div className={ALERT_ERROR}>{error}</div>}
      {loading && <div className={LOADING}>Chargement…</div>}

      {!loading && (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>Nom</th>
                <th className={TH}>Invitation</th>
                <th className={TH}>Statut</th>
                <th className={TH}>Personnes</th>
                <th className={TH}>Boissons alcoolisées</th>
                <th className={TH}>Boissons non alcoolisées</th>
              </tr>
            </thead>
            <tbody>
              {list.map((g) => (
                <tr key={g._id}>
                  <td className={TD}>
                    <strong>{g.guestName}</strong>
                  </td>
                  <td className={TD}>
                    {g.invitationId ? `${g.invitationId.groomName} & ${g.invitationId.brideName}` : "—"}
                  </td>
                  <td className={TD}>
                    <span className={badgeClass(g.attendance)}>{STATUS_LABELS[g.attendance] || g.attendance}</span>
                  </td>
                  <td className={TD}>{g.numberOfGuests}</td>
                  <td className={TD + " text-cream-dim text-xs"}>
                    {g.alcoholicDrinkPreferences?.length ? g.alcoholicDrinkPreferences.join(", ") : "—"}
                  </td>
                  <td className={TD + " text-cream-dim text-xs"}>
                    {g.nonAlcoholicDrinkPreferences?.length ? g.nonAlcoholicDrinkPreferences.join(", ") : "—"}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="6" className={EMPTY_ROW}>
                    Aucune réponse pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
