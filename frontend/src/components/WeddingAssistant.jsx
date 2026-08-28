import { useEffect, useRef } from "react";
import { getDateParts } from "../lib/date.js";
import weddingMusic from "../assets/musique/musique.mp4";

/**
 * 🤍 Assistante de mariage — 100% vocale, invisible à l'écran.
 *
 * ~2 secondes après l'ouverture de l'invitation, une voix chaleureuse
 * présente brièvement le mariage (date, heure, lieu, RSVP, boissons,
 * livre d'or, QR code, dress code), puis laisse place à la musique de
 * mariage dès la fin RÉELLE du discours (speechSynthesis "onend").
 *
 * Aucune carte, avatar ou bouton n'est affiché : ce composant ne rend rien
 * (return null) et pilote uniquement la synthèse vocale + l'audio en tâche
 * de fond.
 */
const START_DELAY_MS = 2000;
const MUSIC_VOLUME = 0.35;
// Contournement d'un bug connu de Chrome : une synthèse vocale de plus
// d'~15s peut se figer silencieusement sans jamais déclencher "onend".
// On "réveille" la synthèse à intervalles réguliers tant qu'elle parle.
const SPEECH_KEEPALIVE_MS = 10000;
// Filet de sécurité : si "onend"/"onerror" ne se déclenchent jamais (bug
// navigateur, voix indisponible...), on lance quand même la musique après
// un délai large, pour ne jamais laisser l'invité sans rien.
const SPEECH_FALLBACK_MS = 30000;

function buildScript({ groomName, brideName, weddingDate, venue, address }) {
  const groomFirst = (groomName || "").split(" ")[0];
  const brideFirst = (brideName || "").split(" ")[0];
  const { dayName, dayNum, month, year, time } = getDateParts(weddingDate);

  return `Bienvenue, chers invités. Je suis ravie de vous accompagner pour le mariage coutumier de ${groomFirst} et ${brideFirst}.

Cette belle union sera célébrée le ${dayName} ${dayNum} ${month} ${year}, à partir de ${time}, à ${venue}, ${address}.

Pensez à confirmer votre présence et à choisir votre boisson un peu plus bas sur cette page. Vous pourrez aussi laisser un mot tendre dans le livre d'or, et garder votre QR Code d'accès pour l'entrée.

N'oubliez pas non plus de respecter le dress code présenté juste après.

Pour l'instant, je vous laisse écouter la musique.`;
}

function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const fr = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
  const warmFemale = fr.find((v) =>
    /female|femme|julie|amélie|amelie|virginie|audrey|celine|marie/i.test(v.name)
  );
  return warmFemale || fr[0] || voices[0];
}

export default function WeddingAssistant({ groomName, brideName, weddingDate, venue, address }) {
  const timerRef = useRef(null);
  const keepAliveRef = useRef(null);
  const fallbackRef = useRef(null);
  const audioRef = useRef(null);
  const musicUnlockRef = useRef(null);
  const speechGestureRef = useRef(null);
  // Empêche tout double déclenchement (démarrage auto + geste qui se
  // chevauchent, filet de sécurité, double effet en dev/StrictMode...).
  const musicStartedRef = useRef(false);
  const speechStartedRef = useRef(false);

  // Toujours les dernières valeurs de props, sans jamais redémarrer le cycle
  // voix -> musique déjà en cours si l'invitation se met à jour entre-temps
  // (ex. réponse API arrivant après le montage) : on lit ces valeurs une
  // seule fois, au moment où la synthèse démarre réellement.
  const paramsRef = useRef({ groomName, brideName, weddingDate, venue, address });
  useEffect(() => {
    paramsRef.current = { groomName, brideName, weddingDate, venue, address };
  }, [groomName, brideName, weddingDate, venue, address]);

  const clearMusicUnlock = () => {
    if (!musicUnlockRef.current) return;
    const onGesture = musicUnlockRef.current;
    document.removeEventListener("click", onGesture);
    document.removeEventListener("touchstart", onGesture);
    musicUnlockRef.current = null;
  };

  const clearSpeechGesture = () => {
    if (!speechGestureRef.current) return;
    const onGesture = speechGestureRef.current;
    document.removeEventListener("click", onGesture);
    document.removeEventListener("touchstart", onGesture);
    speechGestureRef.current = null;
  };

  const playMusic = () => {
    clearInterval(keepAliveRef.current);
    clearTimeout(fallbackRef.current);
    if (typeof window === "undefined" || musicStartedRef.current) return;
    musicStartedRef.current = true;

    if (!audioRef.current) {
      audioRef.current = new Audio(weddingMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = MUSIC_VOLUME;
      audioRef.current.preload = "auto";
      // Si la lecture échoue pour une raison quelconque, on échoue
      // silencieusement : pas de gros lecteur, pas d'erreur JS non gérée.
      audioRef.current.addEventListener("error", () => {});
    }

    const playPromise = audioRef.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay bloqué par le navigateur : on relance discrètement la
        // musique dès le premier geste de l'utilisateur sur la page,
        // sans afficher de lecteur ni de bouton.
        clearMusicUnlock();
        const onGesture = () => {
          audioRef.current?.play().catch(() => {});
          clearMusicUnlock();
        };
        musicUnlockRef.current = onGesture;
        document.addEventListener("click", onGesture, { once: true, passive: true });
        document.addEventListener("touchstart", onGesture, { once: true, passive: true });
      });
    }
  };

  // Lance (ou relance) la synthèse vocale. Appelable aussi bien depuis le
  // minuteur automatique de 2s que depuis le premier geste de l'invité : de
  // nombreux navigateurs mobiles (Safari iOS, navigateurs in-app
  // WhatsApp/Instagram...) bloquent silencieusement `speechSynthesis.speak()`
  // tant qu'aucune interaction utilisateur n'a eu lieu sur la page. Dans ce
  // cas, "onstart" ne se déclenche jamais et ce filet de sécurité prend le
  // relais dès le premier tap, sans jamais afficher le moindre bouton.
  const speakNow = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || speechStartedRef.current) return;
    clearTimeout(timerRef.current);
    clearSpeechGesture();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(buildScript(paramsRef.current));
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = "fr-FR";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => {
      speechStartedRef.current = true;
      clearSpeechGesture();
    };
    // Fin réelle (ou échec) du discours -> musique. Jamais l'inverse.
    utterance.onend = playMusic;
    utterance.onerror = playMusic;

    window.speechSynthesis.speak(utterance);

    // Garde la synthèse "éveillée" tant qu'elle parle (bug Chrome ci-dessus).
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAliveRef.current);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, SPEECH_KEEPALIVE_MS);

    // Filet de sécurité si "onend"/"onerror" ne se déclenchent jamais.
    fallbackRef.current = setTimeout(playMusic, SPEECH_FALLBACK_MS);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => pickVoice();
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return undefined;

    timerRef.current = setTimeout(speakNow, START_DELAY_MS);

    // Filet de sécurité mobile : si l'autoplay de la voix est bloqué, le
    // premier geste de l'invité sur la page la déclenche immédiatement.
    const onGesture = () => {
      clearSpeechGesture();
      speakNow();
    };
    speechGestureRef.current = onGesture;
    document.addEventListener("click", onGesture, { once: true, passive: true });
    document.addEventListener("touchstart", onGesture, { once: true, passive: true });

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(keepAliveRef.current);
      clearTimeout(fallbackRef.current);
      clearSpeechGesture();
      window.speechSynthesis.cancel();
      audioRef.current?.pause();
      clearMusicUnlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
