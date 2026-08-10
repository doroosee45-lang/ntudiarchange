import React, { useState } from "react";
import { postRsvp } from "../lib/api.js";
import { CARD, SECTION_HEADING, HR_GOLD, SUBHEADING, MUTED, TEXT_INPUT, PILL_IDLE, PILL_SELECTED, BTN_GREEN } from "../lib/ui.js";

export default function Preferences({ slug, drinks }) {
  const [guestName, setGuestName] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [attendance, setAttendance] = useState("confirmed"); // "confirmed" | "declined"
  const [selected, setSelected] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const maxTotal = drinks.maxTotal || 2;

  const toggle = (name) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((d) => d !== name);
      if (prev.length >= maxTotal) return prev;
      return [...prev, name];
    });
  };

  const handleConfirm = async () => {
    if (!guestName.trim()) {
      setError("Merci d'indiquer votre nom avant de confirmer.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const alcoholicDrinkPreferences = selected.filter((d) => drinks.alcoholic.includes(d));
      const nonAlcoholicDrinkPreferences = selected.filter((d) => drinks.nonAlcoholic.includes(d));
      await postRsvp({
        slug,
        guestName: guestName.trim(),
        attendance,
        numberOfGuests: attendance === "declined" ? 0 : Number(numberOfGuests),
        alcoholicDrink: alcoholicDrinkPreferences.length > 0,
        alcoholicDrinkPreferences,
        nonAlcoholicDrinkPreferences,
      });
      setConfirmed(true);
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer votre réponse pour le moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={CARD}>
      <p className={SECTION_HEADING}>Vos préférences</p>
      <div className={HR_GOLD} />

      <input
        className={TEXT_INPUT}
        placeholder="Votre nom complet"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        disabled={confirmed}
      />

      <div className="flex gap-2.5 mb-4">
        <button
          type="button"
          className={"flex-1 py-3 rounded-full text-sm font-display transition " + (attendance === "confirmed" ? "bg-green text-[#08260f] font-semibold" : "bg-black/25 border border-gold/35 text-cream")}
          onClick={() => setAttendance("confirmed")}
          disabled={confirmed}
        >
          ✓ Je serai présent(e)
        </button>
        <button
          type="button"
          className={"flex-1 py-3 rounded-full text-sm font-display transition " + (attendance === "declined" ? "bg-[#c0392b] text-white font-semibold" : "bg-black/25 border border-gold/35 text-cream")}
          onClick={() => setAttendance("declined")}
          disabled={confirmed}
        >
          ✕ Je ne pourrai pas venir
        </button>
      </div>

      {attendance === "confirmed" && (
        <>
          <div className="flex items-center justify-center gap-3 mb-4">
            <label className="text-cream-dim text-sm">Nombre de personnes</label>
            <input
              type="number"
              min={1}
              max={20}
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              disabled={confirmed}
              className="w-16 bg-white/[0.04] border border-gold/30 rounded-lg p-2 text-cream text-center"
            />
          </div>

          <p className={SUBHEADING}>Boissons alcoolisées</p>
          <div className="flex flex-wrap gap-2.5 justify-center mb-4.5">
            {drinks.alcoholic.map((d) => (
              <button
                key={d}
                type="button"
                className={selected.includes(d) ? PILL_SELECTED : PILL_IDLE}
                disabled={confirmed || (!selected.includes(d) && selected.length >= maxTotal)}
                onClick={() => toggle(d)}
              >
                {d}
              </button>
            ))}
          </div>

          <p className={SUBHEADING}>Boissons non alcoolisées</p>
          <div className="flex flex-wrap gap-2.5 justify-center mb-4.5">
            {drinks.nonAlcoholic.map((d) => (
              <button
                key={d}
                type="button"
                className={selected.includes(d) ? PILL_SELECTED : PILL_IDLE}
                disabled={confirmed || (!selected.includes(d) && selected.length >= maxTotal)}
                onClick={() => toggle(d)}
              >
                {d}
              </button>
            ))}
          </div>

          <p className={MUTED + " text-center mb-4.5"}>
            Vous pouvez choisir jusqu'à {maxTotal} boissons au total.
          </p>
        </>
      )}

      {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

      <button className={BTN_GREEN} onClick={handleConfirm} disabled={confirmed || sending}>
        {confirmed ? "✓  Présence confirmée" : sending ? "Envoi..." : "✓  Confirmer ma présence"}
      </button>
    </div>
  );
}
