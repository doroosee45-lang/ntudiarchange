// Petit utilitaire centralisé de formatage de date, en français, pour que
// toutes les sections de l'invitation (héros, compte à rebours, assistant
// vocal...) restent automatiquement synchronisées avec `invite.weddingDate`.

// Fuseau horaire du lieu du mariage (Kinshasa, UTC+1, pas d'heure d'été).
// On formate TOUJOURS dans ce fuseau, jamais celui de l'appareil de
// l'invité : sans ça, la même invitation afficherait "18h30", "19h30" ou
// "20h30" selon le fuseau horaire du téléphone de la personne qui la
// consulte, alors que l'heure du mariage ne bouge pas.
const VENUE_TIME_ZONE = "Africa/Kinshasa";

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function formatParts(iso, options) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone: VENUE_TIME_ZONE, ...options }).formatToParts(d);
  const map = {};
  for (const p of parts) map[p.type] = p.value;
  return map;
}

export function getDateParts(iso) {
  const parts = formatParts(iso, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return {
    dayName: parts.weekday,
    dayNum: parts.day,
    month: parts.month,
    year: parts.year,
    time: `${parts.hour === "24" ? "00" : parts.hour}h${parts.minute}`,
  };
}

// ex. "Mercredi 09 Septembre 2026 • 19h30"
export function dateLabel(iso) {
  const { dayName, dayNum, month, year, time } = getDateParts(iso);
  return `${capitalize(dayName)} ${dayNum} ${capitalize(month)} ${year} • ${time}`;
}
