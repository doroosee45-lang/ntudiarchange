import React, { useEffect, useState } from "react";
import { fetchGuestbook, postGuestbookEntry } from "../lib/api.js";
import { CARD_CENTER, SECTION_HEADING, MUTED, BTN_GOLD, BTN_OUTLINE, MODAL_OVERLAY, MODAL_SHEET, TEXT_INPUT } from "../lib/ui.js";

export default function GuestBook({ slug, coupleLabel, fallbackEntries = [] }) {
  const [entries, setEntries] = useState(fallbackEntries);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchGuestbook(slug)
      .then((res) => {
        if (!cancelled && res?.data?.length) {
          setEntries(res.data.map((e) => ({ name: e.guestName, message: e.message })));
        }
      })
      .catch(() => {
        // Silencieux : on garde les messages de secours si l'API est indisponible.
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError("");
    try {
      await postGuestbookEntry({ slug, guestName: name.trim() || "Invité", message: message.trim() });
      setEntries((prev) => [{ name: name.trim() || "Invité", message: message.trim() }, ...prev]);
      setMessage("");
      setName("");
      setOpen(false);
    } catch (err) {
      setError(err.message || "Impossible d'envoyer le message pour le moment.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={CARD_CENTER}>
      <p className={SECTION_HEADING}>📖 Livre d'or</p>
      <p className={MUTED}>Laissez un mot ou un message vocal aux mariés</p>
      <button className={BTN_GOLD + " mt-4"} onClick={() => setOpen(true)}>
        📩 Envoyer un message ({entries.length})
      </button>

      {open && (
        <div className={MODAL_OVERLAY} onClick={() => setOpen(false)}>
          <div className={MODAL_SHEET} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 font-script text-[22px]">
              <span>📖 Livre d'or</span>
              <button className="bg-transparent border-none text-cream text-[22px]" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="max-h-[40vh] overflow-y-auto mb-4 space-y-3.5">
              {entries.map((e, i) => (
                <div key={i} className="border border-gold/25 rounded-2xl py-4 px-4.5 bg-black/30">
                  <p className="m-0 mb-2.5 leading-relaxed text-left">{e.message}</p>
                  <div className="text-gold-strong text-sm text-left">— {e.name}</div>
                </div>
              ))}
            </div>

            <input className={TEXT_INPUT} value={coupleLabel} readOnly />
            <input
              className={TEXT_INPUT}
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className={TEXT_INPUT + " resize-y"}
              rows={3}
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <div className="flex gap-2.5 mb-3.5">
              <button className={BTN_OUTLINE}>🎙 Audio</button>
              <button className={BTN_OUTLINE}>📎 Importer</button>
            </div>

            <button className={BTN_GOLD} onClick={handleSend} disabled={sending}>
              {sending ? "Envoi..." : "📩 Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
