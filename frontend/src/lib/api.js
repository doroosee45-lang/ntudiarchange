// Client API léger pour parler au backend Express (routes publiques uniquement :
// /api/invite, /api/rsvp, /api/guestbook). Pas de dépendance externe (fetch natif).

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // réponse vide ou non-JSON
  }

  if (!res.ok) {
    const message = body?.message || `Erreur ${res.status}`;
    throw new Error(message);
  }
  return body;
}

// GET /api/invite/:slug -> l'invitation (données du mariage)
export function fetchInvite(slug) {
  return request(`/invite/${encodeURIComponent(slug)}`);
}

// GET /api/invite/link/:token -> l'invitation + le nom de l'invité,
// à partir de son lien personnalisé unique (ex: /invitation/abc123)
export function fetchInviteByGuestToken(token) {
  return request(`/invite/link/${encodeURIComponent(token)}`);
}

// GET /api/guestbook/:slug -> liste des messages du livre d'or
export function fetchGuestbook(slug) {
  return request(`/guestbook/${encodeURIComponent(slug)}`);
}

// POST /api/guestbook -> ajouter un message
export function postGuestbookEntry({ slug, guestName, message }) {
  return request(`/guestbook`, {
    method: "POST",
    body: JSON.stringify({ slug, guestName, message }),
  });
}

// POST /api/rsvp -> confirmer / décliner sa présence + préférences boissons
export function postRsvp(payload) {
  return request(`/rsvp`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
