import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, SUBTITLE, INPUT_SEARCH, ALERT_ERROR, LOADING, TABLE_WRAP, TABLE, TH, TD, EMPTY_ROW, BTN_DANGER, BTN_SMALL } from "../../lib/adminUi.js";

// Administration du livre d'or : lister, rechercher, supprimer un message.
export default function GuestBookAdmin() {
  const { authFetch } = useAuth();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = search ? { search } : {};
      const res = await authFetch({ url: "/admin/guestbook", params });
      setEntries(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger le livre d'or.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce message ?")) return;
    setError("");
    try {
      await authFetch({ method: "delete", url: `/admin/guestbook/${id}` });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
    }
  }

  return (
    <div className={PAGE}>
      <h1 className={H1}>Livre d'or</h1>
      <p className={SUBTITLE}>Messages laissés par les invités.</p>

      <div className="mb-5">
        <input className={INPUT_SEARCH} placeholder="Rechercher un message…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <div className={ALERT_ERROR}>{error}</div>}
      {loading && <div className={LOADING}>Chargement…</div>}

      {!loading && (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>Auteur</th>
                <th className={TH}>Invitation</th>
                <th className={TH}>Message</th>
                <th className={TH}>Date</th>
                <th className={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td className={TD}>
                    <strong>{entry.guestName}</strong>
                  </td>
                  <td className={TD}>
                    {entry.invitationId ? `${entry.invitationId.groomName} & ${entry.invitationId.brideName}` : "—"}
                  </td>
                  <td className={TD + " max-w-md"}>{entry.message}</td>
                  <td className={TD}>{new Date(entry.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className={TD}>
                    <button className={BTN_DANGER + " " + BTN_SMALL} onClick={() => handleDelete(entry._id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="5" className={EMPTY_ROW}>
                    Aucun message.
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
