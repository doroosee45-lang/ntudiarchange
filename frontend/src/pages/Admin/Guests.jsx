import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  PAGE, H1, H2, SUBTITLE, BTN_PRIMARY, BTN_GHOST, BTN_DANGER, BTN_SMALL,
  INPUT, INPUT_SEARCH, FIELD_LABEL, ALERT_ERROR, LOADING, TABLE_WRAP, TABLE, TH, TD, EMPTY_ROW,
  MODAL_OVERLAY, MODAL_CARD, GRID_2, badgeClass,
} from "../../lib/adminUi.js";
import { buildGuestLink } from "../../lib/guestLink.js";

// Le formulaire d'invité ne comporte volontairement que le nom : aucune
// autre information (téléphone, e-mail, statut...) n'est demandée à la
// création. L'invitation, le statut RSVP, etc. sont gérés automatiquement
// ou via le flux public de confirmation (page d'invitation).
const EMPTY = {
  guestName: "",
};

const STATUS_LABELS = {
  confirmed: "Confirmé",
  declined: "Décliné",
  pending: "En attente",
};

function shareMessage(link) {
  return `Bonjour,\n\nVous êtes cordialement invité(e) à notre mariage.\n\nVeuillez ouvrir votre invitation personnalisée en cliquant sur le lien ci-dessous :\n\n${link}\n\nAu plaisir de vous compter parmi nous.`;
}

function emailMessage(link) {
  return `Bonjour,\n\nVous êtes cordialement invité(e) à notre mariage.\n\nVotre invitation personnalisée est disponible via le lien suivant :\n\n${link}\n\nAu plaisir de vous compter parmi nous.`;
}

// Gestion des invités : lister, rechercher, créer, modifier, supprimer.
// L'effectif total (somme de numberOfGuests) est affiché en tête de page.
export default function Guests() {
  const { authFetch } = useAuth();
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [qrGuest, setQrGuest] = useState(null);

  async function loadGuests() {
    setLoading(true);
    setError("");
    try {
      const params = search ? { search } : {};
      const res = await authFetch({ url: "/admin/guests", params });
      setGuests(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les invités.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(loadGuests, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(g) {
    setEditing(g._id);
    setForm({ guestName: g.guestName });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editing) {
        await authFetch({ method: "put", url: `/admin/guests/${editing}`, data: form });
      } else {
        await authFetch({ method: "post", url: "/admin/guests", data: form });
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      loadGuests();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet invité ?")) return;
    setError("");
    try {
      await authFetch({ method: "delete", url: `/admin/guests/${id}` });
      loadGuests();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCopyLink(g) {
    const link = buildGuestLink(g.guestToken);
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Repli si l'API clipboard est indisponible (ex: contexte non sécurisé).
      window.prompt("Copiez le lien :", link);
    }
    setCopiedId(g._id);
    setTimeout(() => setCopiedId((id) => (id === g._id ? null : id)), 1800);
  }

  function handleShareWhatsApp(g) {
    const link = buildGuestLink(g.guestToken);
    if (!link) return;
    const text = encodeURIComponent(shareMessage(link));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  function handleShareEmail(g) {
    const link = buildGuestLink(g.guestToken);
    if (!link) return;
    const subject = encodeURIComponent("Votre invitation personnalisée");
    const body = encodeURIComponent(emailMessage(link));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  // Effectif normal : total de personnes annoncées (tous statuts confondus)
  // vs effectif confirmé uniquement — utile pour l'organisation de la salle.
  const totalAnnounced = guests.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);
  const totalConfirmed = guests
    .filter((g) => g.attendance === "confirmed")
    .reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);

  return (
    <div className={PAGE}>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <div>
          <h1 className={H1}>Invités</h1>
          <p className={SUBTITLE}>Gérez les invités et leurs RSVP.</p>
        </div>
        <button className={BTN_PRIMARY} onClick={openCreate}>
          + Nouvel invité
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-[#151310] border border-white/10 rounded-xl px-5 py-3">
          <div className="font-display text-xl text-gold-strong">{guests.length}</div>
          <div className="text-cream-dim text-xs">Fiches invités</div>
        </div>
        <div className="bg-[#151310] border border-white/10 rounded-xl px-5 py-3">
          <div className="font-display text-xl text-gold-strong">{totalAnnounced}</div>
          <div className="text-cream-dim text-xs">Effectif annoncé (tous statuts)</div>
        </div>
        <div className="bg-[#151310] border border-white/10 rounded-xl px-5 py-3">
          <div className="font-display text-xl text-gold-strong">{totalConfirmed}</div>
          <div className="text-cream-dim text-xs">Effectif confirmé</div>
        </div>
      </div>

      <div className="mb-5">
        <input
          className={INPUT_SEARCH}
          placeholder="Rechercher un invité…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className={ALERT_ERROR}>{error}</div>}

      {showForm && (
        <div className={MODAL_OVERLAY}>
          <div className={MODAL_CARD}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={H2 + " mb-0"}>{editing ? "Modifier l'invité" : "Nouvel invité"}</h2>
              <button className="text-cream-dim hover:text-cream text-xl leading-none" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>

            <form className={GRID_2} onSubmit={handleSubmit}>
              <label className="block sm:col-span-2">
                <span className={FIELD_LABEL}>Nom de l'invité</span>
                <input
                  className={INPUT}
                  value={form.guestName}
                  onChange={(e) => set("guestName", e.target.value)}
                  placeholder="Ex : Jean Dupont"
                  autoFocus
                  required
                />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-white/10 mt-2">
                <button type="button" className={BTN_GHOST} onClick={() => setShowForm(false)}>
                  Annuler
                </button>
                <button type="submit" className={BTN_PRIMARY} disabled={saving}>
                  {saving ? "Enregistrement…" : editing ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className={LOADING}>Chargement…</div>}

      {!loading && (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>Nom</th>
                <th className={TH}>Lien personnalisé</th>
                <th className={TH}>Statut</th>
                <th className={TH}>Personnes</th>
                <th className={TH}>Présent</th>
                <th className={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g._id}>
                  <td className={TD}>
                    <strong>{g.guestName}</strong>
                  </td>
                  <td className={TD}>
                    <div className="flex flex-col gap-1.5 max-w-[280px]">
                      <span className="text-xs text-cream-dim/80 truncate" title={buildGuestLink(g.guestToken)}>
                        {buildGuestLink(g.guestToken) || "—"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className={BTN_GHOST + " " + BTN_SMALL}
                          onClick={() => handleCopyLink(g)}
                          disabled={!g.guestToken}
                        >
                          {copiedId === g._id ? "Copié ✓" : "Copier"}
                        </button>
                        <button
                          type="button"
                          className={BTN_GHOST + " " + BTN_SMALL}
                          onClick={() => handleShareWhatsApp(g)}
                          disabled={!g.guestToken}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          className={BTN_GHOST + " " + BTN_SMALL}
                          onClick={() => handleShareEmail(g)}
                          disabled={!g.guestToken}
                        >
                          E-mail
                        </button>
                        <button
                          type="button"
                          className={BTN_GHOST + " " + BTN_SMALL}
                          onClick={() => setQrGuest(g)}
                          disabled={!g.guestToken}
                        >
                          QR Code
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className={TD}>
                    <span className={badgeClass(g.attendance)}>{STATUS_LABELS[g.attendance] || g.attendance}</span>
                  </td>
                  <td className={TD}>{g.numberOfGuests}</td>
                  <td className={TD}>
                    <span className={badgeClass(g.checkInStatus === "checked-in" ? "checked-in" : "not-checked")}>
                      {g.checkInStatus === "checked-in" ? "Oui" : "Non"}
                    </span>
                  </td>
                  <td className={TD}>
                    <div className="flex gap-2">
                      <button className={BTN_GHOST + " " + BTN_SMALL} onClick={() => openEdit(g)}>
                        Modifier
                      </button>
                      <button className={BTN_DANGER + " " + BTN_SMALL} onClick={() => handleDelete(g._id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td colSpan="6" className={EMPTY_ROW}>
                    Aucun invité trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {qrGuest && (
        <div className={MODAL_OVERLAY} onClick={() => setQrGuest(null)}>
          <div className={MODAL_CARD + " max-w-sm text-center"} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={H2 + " mb-0"}>QR Code — {qrGuest.guestName}</h2>
              <button className="text-cream-dim hover:text-cream text-xl leading-none" onClick={() => setQrGuest(null)}>
                ×
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl w-fit mx-auto">
              <QRCodeSVG value={buildGuestLink(qrGuest.guestToken)} size={200} bgColor="#ffffff" fgColor="#111111" level="M" />
            </div>
            <p className="text-xs text-cream-dim/80 mt-4 break-all">{buildGuestLink(qrGuest.guestToken)}</p>
            <p className="text-cream-dim text-xs mt-1">
              Ce QR Code ouvre uniquement l'invitation personnalisée de <strong className="text-cream">{qrGuest.guestName}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
