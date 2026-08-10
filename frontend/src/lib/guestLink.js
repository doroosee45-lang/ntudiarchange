// Construit l'URL publique et personnalisée d'un invité à partir de son
// identifiant unique (guestToken), ex: "abc123" -> ".../#/invitation/abc123".
//
// Base URL : on utilise window.location.origin + window.location.pathname,
// résolus au moment de l'exécution dans le navigateur. C'est la même logique
// que celle déjà utilisée ailleurs dans l'app (Home.jsx, Invite.jsx pour le
// QR code de la page publique) : elle s'adapte automatiquement à
// l'environnement (http://localhost:5173 en dev, le vrai domaine en
// production) sans configuration supplémentaire, aucune variable
// VITE_APP_URL n'existant dans le projet (seules VITE_API_URL et
// VITE_INVITE_SLUG sont définies, voir frontend/.env).
//
// L'app utilise HashRouter (cf. App.jsx) : le lien contient donc un "#/"
// avant le chemin, nécessaire pour un déploiement en fichiers statiques
// (XAMPP/Apache) sans configuration de réécriture d'URL côté serveur.
export function buildGuestLink(guestToken) {
  if (typeof window === "undefined" || !guestToken) return "";
  return `${window.location.origin}${window.location.pathname}#/invitation/${guestToken}`;
}
