import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * 🤍 Assistante de mariage
 * Accueille et guide les invités grâce à la synthèse vocale du navigateur
 * (Web Speech API / speechSynthesis). Aucun service payant requis.
 *
 * S'active automatiquement ~2 secondes après l'ouverture de l'invitation.
 * Si le navigateur bloque l'autoplay, un bouton discret « 🔊 Écouter l'assistante »
 * permet de lancer la narration manuellement.
 */
const DEFAULT_TEXT = `Bienvenue chers invités. Je suis l'assistante de mariage et je suis là pour vous guider à chaque étape de cette magnifique journée.

Il est obligatoire de confirmer votre présence avant de quitter cette page. Pour cela, descendez un peu plus bas, vous trouverez un bouton vert en train de clignoter. Choisissez d'abord la boisson de votre choix, puis cliquez-y.

Vous aurez également la possibilité de laisser un petit message d'encouragement aux mariés dans le livre d'or.

N'oubliez pas non plus de télécharger votre code QR en format PDF pour l'avoir sur votre téléphone, au cas où vous n'auriez peut-être pas la connexion le jour de l'événement.

Gardez à l'esprit que vous devrez présenter ce code QR à l'entrée pour accéder à la salle, et n'oubliez surtout pas de respecter le dress code.

Alors pour l'instant, je vous laisse profiter d'une petite musique. Merci, passez une bonne journée.`;

export default function WeddingAssistant({
  coupleLabel = "Archange NTUDI & Gladys BAMOPALABI",
}) {
  const [visible, setVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const [paused, setPaused] = useState(false);
  const [compact, setCompact] = useState(false);

  const mutedRef = useRef(false);

  const pickVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const fr = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
    const female = fr.find((v) => /female|femme|julie|amélie|amelie|thomas|virginie/i.test(v.name));
    return female || fr[0] || voices[0];
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setPaused(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setSupported(false);
        return;
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      utterance.lang = "fr-FR";
      utterance.rate = 0.92;
      utterance.pitch = 1.02;
      utterance.volume = 1;

      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [pickVoice]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const load = () => pickVoice();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [pickVoice]);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      speak(DEFAULT_TEXT);
    }, 2000);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [speak, stop]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) stop();
  };

  const replay = () => {
    if (mutedRef.current) {
      setMuted(false);
      mutedRef.current = false;
    }
    speak(DEFAULT_TEXT);
  };

  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const assistantBtn =
    "flex-1 min-w-0 bg-gradient-to-b from-gold-strong/90 to-gold-deep/95 text-[#241b06] border-none rounded-full py-2.5 px-3 font-display text-xs font-semibold whitespace-nowrap transition duration-150 hover:brightness-[1.08] active:scale-[0.97]";

  return (
    <div
      className={
        "fixed top-3 right-3 sm:top-4.5 sm:right-4.5 z-[60] max-w-[260px] sm:max-w-[320px] w-[calc(100%-48px)] sm:w-[calc(100%-36px)] transition-all duration-500 " +
        (visible ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-3.5 scale-[0.97] pointer-events-none")
      }
    >
      <div className="bg-gradient-to-br from-[#1c1913]/92 to-[#0f0d0a]/94 border border-gold/45 rounded-2xl py-2.5 px-3.5 sm:py-3.5 sm:px-4 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_22px_rgba(232,196,104,0.18)] backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 sm:w-[42px] sm:h-[42px] shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#e8c468,#b8873a)] flex items-center justify-center text-[17px] sm:text-xl shadow-[0_4px_14px_rgba(232,196,104,0.4)]">
            <span className="[filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.4))]">🤍</span>
            {speaking && !muted && (
              <span
                className="absolute -inset-1.5 rounded-full border-2 border-gold-strong/60 animate-assistantPing"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <span className="font-display text-xs sm:text-[13px] tracking-[0.02em] text-gold-strong font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              Assistante de mariage
            </span>
            {speaking && !muted ? (
              <span className="font-script italic text-xs sm:text-sm text-cream whitespace-nowrap overflow-hidden text-ellipsis">
                🔊 Je vous accompagne...
              </span>
            ) : (
              <span className="font-script italic text-xs sm:text-sm text-cream whitespace-nowrap overflow-hidden text-ellipsis">
                {coupleLabel}
              </span>
            )}
          </div>
          <button
            className="shrink-0 bg-gold/[0.18] border border-gold/40 text-gold-strong w-7 h-7 rounded-full flex items-center justify-center text-base leading-none transition duration-150 hover:bg-gold/[0.34] hover:scale-[1.06]"
            onClick={() => setCompact((c) => !c)}
            aria-label={compact ? "Agrandir" : "Réduire"}
            title={compact ? "Agrandir" : "Réduire"}
          >
            {compact ? "＋" : "—"}
          </button>
        </div>

        {!compact && (
          <>
            {(speaking || muted) && (
              <div className="flex gap-1.5 items-center justify-center my-3 mb-1" aria-hidden="true">
                <span className="w-[7px] h-[7px] rounded-full bg-gold-strong animate-dotPulse" />
                <span className="w-[7px] h-[7px] rounded-full bg-gold-strong animate-dotPulse [animation-delay:0.18s]" />
                <span className="w-[7px] h-[7px] rounded-full bg-gold-strong animate-dotPulse [animation-delay:0.36s]" />
              </div>
            )}

            {!supported ? (
              <p className="mt-2.5 mb-1 text-xs text-cream-dim text-center">
                La synthèse vocale n'est pas disponible sur ce navigateur.
              </p>
            ) : muted || !speaking ? (
              <div className="flex gap-2 mt-3 flex-wrap">
                <button className={assistantBtn} onClick={replay}>
                  🔊 Écouter l'assistante
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-3 flex-wrap">
                <button className={assistantBtn} onClick={togglePause}>
                  {paused ? "▶️ Reprendre" : "⏸️ Pause"}
                </button>
                <button className={assistantBtn} onClick={toggleMute}>
                  🔇 Couper le son
                </button>
              </div>
            )}
          </>
        )}

        {compact && (
          <button className={assistantBtn + " w-full mt-2.5"} onClick={() => setCompact(false)}>
            🔊 Ouvrir l'assistante
          </button>
        )}
      </div>
    </div>
  );
}
