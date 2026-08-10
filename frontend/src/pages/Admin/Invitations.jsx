import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  PAGE, H1, H2, SUBTITLE, BTN_PRIMARY, BTN_GHOST, BTN_DANGER, BTN_SMALL,
  INPUT, FIELD_LABEL, ALERT_ERROR, LOADING, TABLE_WRAP, TABLE, TH, TD, EMPTY_ROW,
  MODAL_OVERLAY, MODAL_CARD, GRID_2,
} from "../../lib/adminUi.js";

const EMPTY = {
  slug: "",
  groomName: "",
  brideName: "",
  groomFullName: "",
  brideFullName: "",
  coupleLabel: "",
  eventTitle: "Vous êtes invité",
  eventType: "Soirée dansante",
  weddingDate: "",

  ceremonyTitle: "Bénédiction Nuptiale",
  ceremonyTime: "",
  ceremonyLocation: "",
  ceremonyAddress: "",

  receptionTitle: "Soirée Dansante",
  receptionTime: "",
  receptionLocation: "",
  receptionAddress: "",
  receptionMapUrl: "",

  welcomeMessage: "",
  noteMessage: "",
  welcomeClosing: "Soyez les bienvenus",

  tableNumber: "",
  tableLabel: "",

  dressCodeTitle: "Prière de respecter le dresscode SVP !",
  dressCodeSubtitle: "Palette à respecter",
  dressCodeColors: "#D62B23, #212B45, #0A0A0A",

  rsvpDeadline: "",
  contactPhone: "",
  contactEmail: "",
  whatsappNumber: "",
  guestOf: "",

  drinksMaxTotal: 2,
  drinksAlcoholic: "Castel, Beaufort, Tembo, Nkoy, Likofi, Primus, Turbo, Heineken",
  drinksNonAlcoholic: "Coca, Fanta, Maltina, Vitalo, Energy Malt, Sprite, Eau",
};

// Transforme le formulaire (champs "plats") en payload conforme au schéma
// Mongoose (dressCode et drinks sont des sous-objets imbriqués).
function formToPayload(form) {
  return {
    slug: form.slug,
    groomName: form.groomName,
    brideName: form.brideName,
    groomFullName: form.groomFullName,
    brideFullName: form.brideFullName,
    coupleLabel: form.coupleLabel,
    eventTitle: form.eventTitle,
    eventType: form.eventType,
    weddingDate: form.weddingDate,

    ceremonyTitle: form.ceremonyTitle,
    ceremonyTime: form.ceremonyTime,
    ceremonyLocation: form.ceremonyLocation,
    ceremonyAddress: form.ceremonyAddress,

    receptionTitle: form.receptionTitle,
    receptionTime: form.receptionTime,
    receptionLocation: form.receptionLocation,
    receptionAddress: form.receptionAddress,
    receptionMapUrl: form.receptionMapUrl,

    welcomeMessage: form.welcomeMessage,
    noteMessage: form.noteMessage,
    welcomeClosing: form.welcomeClosing,

    tableNumber: form.tableNumber,
    tableLabel: form.tableLabel,

    dressCode: {
      title: form.dressCodeTitle,
      subtitle: form.dressCodeSubtitle,
      colors: String(form.dressCodeColors || "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    },

    rsvpDeadline: form.rsvpDeadline || undefined,
    contactPhone: form.contactPhone,
    contactEmail: form.contactEmail,
    whatsappNumber: form.whatsappNumber,
    guestOf: form.guestOf,

    drinks: {
      maxTotal: Number(form.drinksMaxTotal) || 2,
      alcoholic: String(form.drinksAlcoholic || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      nonAlcoholic: String(form.drinksNonAlcoholic || "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
    },
  };
}

// Inverse de formToPayload : reconstruit le formulaire "plat" à partir du
// document Mongoose renvoyé par l'API (pour le mode édition).
function inviteToForm(inv) {
  return {
    ...EMPTY,
    ...inv,
    weddingDate: inv.weddingDate ? inv.weddingDate.slice(0, 16) : "",
    rsvpDeadline: inv.rsvpDeadline ? inv.rsvpDeadline.slice(0, 16) : "",
    dressCodeTitle: inv.dressCode?.title || EMPTY.dressCodeTitle,
    dressCodeSubtitle: inv.dressCode?.subtitle || EMPTY.dressCodeSubtitle,
    dressCodeColors: (inv.dressCode?.colors || []).join(", "),
    drinksMaxTotal: inv.drinks?.maxTotal ?? 2,
    drinksAlcoholic: (inv.drinks?.alcoholic || []).join(", "),
    drinksNonAlcoholic: (inv.drinks?.nonAlcoholic || []).join(", "),
  };
}

// IMPORTANT : Field est défini EN DEHORS du composant Invitations, au niveau
// module, pour que sa référence de fonction soit stable entre les renders.
//
// Avant, Field était défini À L'INTÉRIEUR de Invitations(). Résultat : à
// chaque frappe dans un champ, onChange appelait set() -> setForm() ->
// Invitations se re-rendait -> une NOUVELLE fonction Field était créée à
// chaque render. React identifie les composants par référence de fonction,
// donc il voyait "un composant différent" à cet endroit de l'arbre et
// démontait l'ancien <label>/<input> pour en remonter un nouveau. Un input
// remonté perd le focus -> il fallait recliquer avec la souris avant de
// pouvoir taper le caractère suivant.
//
// En sortant Field du composant, sa référence ne change plus jamais : React
// réutilise le même DOM <input> entre les renders et le focus est conservé,
// donc on peut écrire directement au clavier sans recliquer.
function Field({ label, children }) {
  return (
    <label className="block">
      <span className={FIELD_LABEL}>{label}</span>
      {children}
    </label>
  );
}

// Gestion des invitations : lister, créer, modifier, supprimer.
export default function Invitations() {
  const { authFetch } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null = mode création
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch({ url: "/admin/invitations" });
      setInvites(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les invitations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(inv) {
    setEditing(inv._id);
    setForm(inviteToForm(inv));
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (editing) {
        await authFetch({ method: "put", url: `/admin/invitations/${editing}`, data: payload });
      } else {
        await authFetch({ method: "post", url: "/admin/invitations", data: payload });
      }
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cette invitation et tous ses invités ?")) return;
    setError("");
    try {
      await authFetch({ method: "delete", url: `/admin/invitations/${id}` });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de la suppression.");
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className={PAGE}>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <div>
          <h1 className={H1}>Invitations</h1>
          <p className={SUBTITLE}>Créez et gérez les invitations envoyées aux invités.</p>
        </div>
        <button type="button" className={BTN_PRIMARY} onClick={openCreate}>
          + Nouvelle invitation
        </button>
      </div>

      {error && <div className={ALERT_ERROR}>{error}</div>}

      {showForm && (
        <div className={MODAL_OVERLAY}>
          <div className={MODAL_CARD}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={H2 + " mb-0"}>{editing ? "Modifier l'invitation" : "Nouvelle invitation"}</h2>
              <button
                type="button"
                className="text-cream-dim hover:text-cream text-xl leading-none"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className={GRID_2}>
                <Field label="Slug (URL)">
                  <input className={INPUT} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="archange-gladys" />
                </Field>
                <Field label="Libellé du couple">
                  <input className={INPUT} value={form.coupleLabel} onChange={(e) => set("coupleLabel", e.target.value)} placeholder="COUPLE ARCHANGE" />
                </Field>
                <Field label="Nom du marié (affiché)">
                  <input className={INPUT} value={form.groomName} onChange={(e) => set("groomName", e.target.value)} required />
                </Field>
                <Field label="Nom de la mariée (affiché)">
                  <input className={INPUT} value={form.brideName} onChange={(e) => set("brideName", e.target.value)} required />
                </Field>
                <Field label="Nom complet du marié">
                  <input className={INPUT} value={form.groomFullName} onChange={(e) => set("groomFullName", e.target.value)} />
                </Field>
                <Field label="Nom complet de la mariée">
                  <input className={INPUT} value={form.brideFullName} onChange={(e) => set("brideFullName", e.target.value)} />
                </Field>
                <Field label="Type d'événement">
                  <input className={INPUT} value={form.eventType} onChange={(e) => set("eventType", e.target.value)} />
                </Field>
                <Field label="Date &amp; heure du mariage">
                  <input className={INPUT} type="datetime-local" value={form.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} required />
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Cérémonie</h3>
              <div className={GRID_2}>
                <Field label="Titre">
                  <input className={INPUT} value={form.ceremonyTitle} onChange={(e) => set("ceremonyTitle", e.target.value)} />
                </Field>
                <Field label="Heure">
                  <input className={INPUT} value={form.ceremonyTime} onChange={(e) => set("ceremonyTime", e.target.value)} placeholder="20h00" />
                </Field>
                <Field label="Lieu">
                  <input className={INPUT} value={form.ceremonyLocation} onChange={(e) => set("ceremonyLocation", e.target.value)} />
                </Field>
                <Field label="Adresse">
                  <input className={INPUT} value={form.ceremonyAddress} onChange={(e) => set("ceremonyAddress", e.target.value)} />
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Réception</h3>
              <div className={GRID_2}>
                <Field label="Titre">
                  <input className={INPUT} value={form.receptionTitle} onChange={(e) => set("receptionTitle", e.target.value)} />
                </Field>
                <Field label="Heure">
                  <input className={INPUT} value={form.receptionTime} onChange={(e) => set("receptionTime", e.target.value)} placeholder="20h00" />
                </Field>
                <Field label="Lieu">
                  <input className={INPUT} value={form.receptionLocation} onChange={(e) => set("receptionLocation", e.target.value)} />
                </Field>
                <Field label="Adresse">
                  <input className={INPUT} value={form.receptionAddress} onChange={(e) => set("receptionAddress", e.target.value)} />
                </Field>
                <Field label="Lien Google Maps">
                  <input className={INPUT} value={form.receptionMapUrl} onChange={(e) => set("receptionMapUrl", e.target.value)} placeholder="https://maps.google.com/?q=..." />
                </Field>
                <Field label="Table / N°">
                  <div className="flex gap-2">
                    <input className={INPUT} value={form.tableLabel} onChange={(e) => set("tableLabel", e.target.value)} placeholder="BUNDA" />
                    <input className={INPUT} value={form.tableNumber} onChange={(e) => set("tableNumber", e.target.value)} placeholder="45" />
                  </div>
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Messages</h3>
              <div className="space-y-4">
                <Field label="Message de bienvenue">
                  <textarea className={INPUT} rows="3" value={form.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} />
                </Field>
                <Field label="Note (ponctualité, etc.)">
                  <textarea className={INPUT} rows="2" value={form.noteMessage} onChange={(e) => set("noteMessage", e.target.value)} />
                </Field>
                <Field label="Formule de clôture">
                  <input className={INPUT} value={form.welcomeClosing} onChange={(e) => set("welcomeClosing", e.target.value)} />
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Dress code</h3>
              <div className={GRID_2}>
                <Field label="Titre">
                  <input className={INPUT} value={form.dressCodeTitle} onChange={(e) => set("dressCodeTitle", e.target.value)} />
                </Field>
                <Field label="Sous-titre">
                  <input className={INPUT} value={form.dressCodeSubtitle} onChange={(e) => set("dressCodeSubtitle", e.target.value)} />
                </Field>
                <Field label="Couleurs (hex, séparées par des virgules)">
                  <input className={INPUT} value={form.dressCodeColors} onChange={(e) => set("dressCodeColors", e.target.value)} placeholder="#D62B23, #212B45, #0A0A0A" />
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Boissons proposées au RSVP</h3>
              <div className="space-y-4">
                <Field label="Nombre maximum de boissons par invité">
                  <input className={INPUT + " max-w-[140px]"} type="number" min="1" value={form.drinksMaxTotal} onChange={(e) => set("drinksMaxTotal", e.target.value)} />
                </Field>
                <Field label="Boissons alcoolisées (séparées par des virgules)">
                  <input className={INPUT} value={form.drinksAlcoholic} onChange={(e) => set("drinksAlcoholic", e.target.value)} />
                </Field>
                <Field label="Boissons non alcoolisées (séparées par des virgules)">
                  <input className={INPUT} value={form.drinksNonAlcoholic} onChange={(e) => set("drinksNonAlcoholic", e.target.value)} />
                </Field>
              </div>

              <h3 className="font-display text-sm text-gold-strong uppercase tracking-wide pt-2">Contact</h3>
              <div className={GRID_2}>
                <Field label="Date limite RSVP">
                  <input className={INPUT} type="datetime-local" value={form.rsvpDeadline} onChange={(e) => set("rsvpDeadline", e.target.value)} />
                </Field>
                <Field label="Téléphone WhatsApp (sans +)">
                  <input className={INPUT} value={form.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="243827066141" />
                </Field>
                <Field label="Téléphone de contact">
                  <input className={INPUT} value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
                </Field>
                <Field label="Email de contact">
                  <input className={INPUT} value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
                </Field>
                <Field label="Invité(e) de">
                  <input className={INPUT} value={form.guestOf} onChange={(e) => set("guestOf", e.target.value)} placeholder="Monsieur & Madame" />
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/10 mt-2">
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
                <th className={TH}>Couple</th>
                <th className={TH}>Slug</th>
                <th className={TH}>Date</th>
                <th className={TH}>Lieu</th>
                <th className={TH}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv._id}>
                  <td className={TD}>
                    <strong>{inv.groomName}</strong> &amp; <strong>{inv.brideName}</strong>
                  </td>
                  <td className={TD}>
                    <code className="text-gold-strong text-xs">{inv.slug}</code>
                  </td>
                  <td className={TD}>{inv.weddingDate ? new Date(inv.weddingDate).toLocaleDateString("fr-FR") : "—"}</td>
                  <td className={TD}>{inv.receptionLocation || inv.ceremonyLocation || "—"}</td>
                  <td className={TD}>
                    <div className="flex gap-2">
                      <button type="button" className={BTN_GHOST + " " + BTN_SMALL} onClick={() => openEdit(inv)}>
                        Modifier
                      </button>
                      <button type="button" className={BTN_DANGER + " " + BTN_SMALL} onClick={() => handleDelete(inv._id)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invites.length === 0 && (
                <tr>
                  <td colSpan="5" className={EMPTY_ROW}>
                    Aucune invitation pour le moment.
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