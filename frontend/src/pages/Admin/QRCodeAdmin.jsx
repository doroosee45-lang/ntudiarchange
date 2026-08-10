import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, SUBTITLE, INPUT, ALERT_ERROR, LOADING } from "../../lib/adminUi.js";
import { buildGuestLink } from "../../lib/guestLink.js";

// Génération / affichage des QR codes des invités.
// Chaque QR code encode le lien personnalisé unique de l'invité
// (/#/invitation/:guestToken — voir App.jsx et lib/guestLink.js), exactement
// le même lien que celui utilisé pour Copier / WhatsApp / E-mail dans la
// page "Invités". Un même QR code ne peut donc jamais ouvrir l'invitation
// d'un autre invité.
export default function QRCodeAdmin() {
  const { authFetch } = useAuth();
  const [guests, setGuests] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch({ url: "/admin/invitations" })
      .then((res) => setInvites(res.data.data))
      .catch(() => {});

    authFetch({ url: "/admin/guests" })
      .then((res) => {
        setGuests(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Impossible de charger les invités.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = selectedInvite
    ? guests.filter((g) => (g.invitationId?._id || g.invitationId) === selectedInvite)
    : guests;

  return (
    <div className={PAGE}>
      <h1 className={H1}>QR Codes</h1>
      <p className={SUBTITLE}>Générez et affichez les QR codes individuels des invités.</p>

      <div className="mb-6">
        <select className={INPUT + " max-w-xs"} value={selectedInvite} onChange={(e) => setSelectedInvite(e.target.value)}>
          <option value="">Toutes les invitations</option>
          {invites.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.groomName} &amp; {inv.brideName}
            </option>
          ))}
        </select>
      </div>

      {error && <div className={ALERT_ERROR}>{error}</div>}
      {loading && <div className={LOADING}>Chargement…</div>}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((g) => {
            const value = buildGuestLink(g.guestToken);
            return (
              <div key={g._id} className="bg-[#151310] border border-white/10 rounded-xl p-4 flex flex-col items-center text-center gap-2">
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG value={value} size={120} bgColor="#ffffff" fgColor="#111111" level="M" />
                </div>
                <strong className="text-sm text-cream">{g.guestName}</strong>
                <span className="text-xs text-cream-dim">
                  {g.invitationId ? `${g.invitationId.groomName} & ${g.invitationId.brideName}` : "—"}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-cream-dim text-sm col-span-full text-center py-8">Aucun invité pour cette sélection.</p>}
        </div>
      )}
    </div>
  );
}
