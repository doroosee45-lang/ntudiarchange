// Petit utilitaire centralisé de formatage de date, en français, pour que
// toutes les sections de l'invitation (héros, compte à rebours, assistant
// vocal...) restent automatiquement synchronisées avec `invite.weddingDate`.

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function getDateParts(iso) {
  const d = new Date(iso);
  return {
    dayName: d.toLocaleDateString("fr-FR", { weekday: "long" }),
    dayNum: d.toLocaleDateString("fr-FR", { day: "2-digit" }),
    month: d.toLocaleDateString("fr-FR", { month: "long" }),
    year: d.getFullYear(),
    time: `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

// ex. "Mercredi 09 Septembre 2026 • 19h30"
export function dateLabel(iso) {
  const { dayName, dayNum, month, year, time } = getDateParts(iso);
  return `${capitalize(dayName)} ${dayNum} ${capitalize(month)} ${year} • ${time}`;
}
