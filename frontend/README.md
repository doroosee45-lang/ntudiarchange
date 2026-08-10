# Invitation de Mariage — Couple Archange

Application React (Vite) à deux pages :

- **`src/pages/Home.jsx`** — page d'accueil / couverture : photo du couple, nom, bouton
  « Ouvrez votre invitation ici ! », QR code à présenter à l'entrée.
- **`src/pages/Invite.jsx`** — invitation complète, avec dans l'ordre :
  1. Photo stylisée du couple
  2. « Vous êtes invités » + nom du couple + message complet de l'invitation
  3. Événement (soirée dansante), lieu, adresse, bouton de localisation, message de bienvenue
  4. Compte à rebours ("dans exactement")
  5. Galerie photos (carrousel automatique)
  6. Dress code (3 couleurs)
  7. Vos préférences (boissons alcoolisées / non alcoolisées) + bouton "Confirmer ma présence"
  8. Livre d'or (lecture des messages + envoi d'un nouveau message)
  9. QR code téléchargeable

Un bouton WhatsApp flottant est affiché en haut à gauche sur les deux pages.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez `http://localhost:5173`. La page d'accueil est sur `/`, l'invitation
complète est sur `/#/meya-osee` (le slug est configurable, voir plus bas).

## Personnaliser le contenu

Toutes les données (noms, dates, adresses, boissons, couleurs du dress code,
photos, livre d'or...) sont centralisées dans :

```
src/data/inviteData.js
```

Remplace directement les valeurs de `FALLBACK_INVITE`, ou branche un appel API
(MongoDB, etc.) dans `Home.jsx` / `Invite.jsx` pour charger les données par
`slug` depuis ton backend — la structure de l'objet est déjà prête pour ça.

Le slug par défaut se configure via la variable d'environnement
`VITE_INVITE_SLUG` (fichier `.env`) :

```
VITE_INVITE_SLUG=meya-osee
```

## Photos

Renseigne les URLs des photos dans `inviteData.js` :

- `coverPhotoUrl` — photo principale du couple (section 1 + fond du countdown)
- `coupleCirclePhotoUrl` — photo ronde utilisée sur la page d'accueil
- `galleryPhotos` — tableau d'URLs pour le carrousel de la galerie

## Build de production

```bash
npm run build
```

Le résultat est généré dans `dist/`, prêt à être déployé (Netlify, Vercel,
GitHub Pages, etc.).
