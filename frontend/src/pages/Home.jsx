


import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { FALLBACK_INVITE } from "../data/inviteData.js";
import { fetchInvite, fetchInviteByGuestToken } from "../lib/api.js";
import { HOME_CARD, EYEBROW, MUTED } from "../lib/ui.js";

// Page d'accueil / "teaser" affichée AVANT l'invitation complète.
//
// 3 façons d'y arriver :
//  - /                        -> invitation par défaut (FALLBACK_INVITE.slug), pas de nom d'invité
//  - /:slug                   -> invitation identifiée par son slug, pas de nom d'invité précis
//  - /invitation/:token       -> lien personnalisé d'un invité (nom + invitation liés)
//
// Dans tous les cas, le bouton "Télécharger l'invitation" amène ensuite vers
// la page complète (Invite.jsx), à /invitation/:token/carte ou /:slug/carte.
export default function Home() {
  const { slug: slugFromUrl, token: guestTokenFromUrl } = useParams();
  const slug = slugFromUrl || FALLBACK_INVITE.slug;

  const [invite, setInvite] = useState(
    slug === FALLBACK_INVITE.slug ? FALLBACK_INVITE : { ...FALLBACK_INVITE, slug }
  );
  const [guestName, setGuestName] = useState(null);

  // Lien invité invalide/supprimé : même logique que sur la page complète,
  // on ne doit pas afficher l'invitation de secours au nom de quelqu'un d'autre.
  const [guestLinkInvalid, setGuestLinkInvalid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const request = guestTokenFromUrl ? fetchInviteByGuestToken(guestTokenFromUrl) : fetchInvite(slug);

    request
      .then((data) => {
        if (!cancelled && data) {
          setGuestLinkInvalid(false);
          setGuestName(data.guestName || null);
          // On garde les photos importées localement (l'API ne les héberge pas
          // forcément) et on fusionne le reste des champs distants.
          setInvite((prev) => ({ ...prev, ...data, coupleCirclePhotoUrl: prev.coupleCirclePhotoUrl }));
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (guestTokenFromUrl) {
          setGuestLinkInvalid(true);
        }
        // Sinon (route par slug ou racine), silencieux : on reste sur les
        // données de secours si l'API est indisponible.
      });
    return () => {
      cancelled = true;
    };
  }, [slug, guestTokenFromUrl]);

  // Chemin de la page complète, une fois le bouton "Télécharger l'invitation" cliqué.
  const fullInvitePath = guestTokenFromUrl
    ? `/invitation/${guestTokenFromUrl}/carte`
    : `/${invite.slug}/carte`;

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#${
          guestTokenFromUrl ? `/invitation/${guestTokenFromUrl}` : `/${invite.slug}`
        }`
      : `/${invite.slug}`;

  // Lien invité invalide/supprimé : page d'erreur sobre, même style que le reste de l'app.
  if (guestTokenFromUrl && guestLinkInvalid) {
    return (
      <div className="relative min-h-screen min-h-dvh bg-stage overflow-x-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 pointer-events-none bg-dots" />
        <div className={HOME_CARD}>
          <p className={EYEBROW}>Invitation indisponible</p>
          <h1 className="font-display text-xl md:text-2xl tracking-[0.04em] text-center text-cream mb-3 animate-textReveal">
            Ce lien n'est plus valide
          </h1>
          <p className={MUTED + " text-center"}>
            Ce lien d'invitation n'existe pas ou n'est plus disponible. Merci de contacter les organisateurs pour obtenir votre lien personnalisé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-h-dvh bg-stage overflow-x-hidden flex items-center justify-center p-8">
      <div className="absolute inset-0 pointer-events-none bg-dots" />

      <div className={HOME_CARD}>
        <div className="w-[130px] h-[130px] rounded-full border-2 border-gold overflow-hidden mx-auto mb-4 shadow-[0_0_24px_rgba(217,179,82,0.35)] animate-photoReveal">
          {invite.coupleCirclePhotoUrl ? (
            <img
              src={invite.coupleCirclePhotoUrl}
              alt={`${invite.groomName} & ${invite.brideName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#241f19] flex items-center justify-center font-script italic text-gold-strong text-2xl">
              {invite.groomName[0]}
              {invite.brideName[0]}
            </div>
          )}
        </div>

        <p className={EYEBROW}>Vous êtes invité</p>
        <h1 className="font-display text-2xl md:text-[26px] tracking-[0.06em] text-center text-cream mb-1.5 animate-textReveal">
          {invite.coupleLabel}
        </h1>

        <span className="inline-block border border-line rounded-full px-4 py-1.5 text-[11px] tracking-[0.18em] text-gold-strong mb-3.5">
          {invite.eventType.toUpperCase()}
        </span>

        <p className="font-script italic text-2xl mt-3 text-cream text-center">
          {invite.groomName} &amp; {invite.brideName}
        </p>

        {guestName && (
          <p className={MUTED + " text-center mt-3"}>
            Cher/Chère <strong className="text-cream">{guestName}</strong>,
          </p>
        )}

        <Link
          to={fullInvitePath}
          className="mt-6 relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-full font-display text-[15px] tracking-[0.02em] font-semibold shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-[1.06] active:translate-y-0 active:scale-[0.97] bg-gradient-to-b from-gold-strong to-gold-deep text-[#241b06] animate-goldPulse after:content-[''] after:absolute after:top-0 after:-left-[60%] after:w-[45%] after:h-full after:[background:linear-gradient(100deg,transparent_0%,rgba(255,255,255,.55)_50%,transparent_100%)] after:[transform:skewX(-20deg)] after:animate-shineSweep"
        >
          ✉️ Ouvrir votre invitation
        </Link>

        <div className="bg-white p-4 rounded-2xl w-fit mx-auto mt-6 border-2 border-gold">
          <QRCodeCanvas value={inviteUrl} size={170} bgColor="#ffffff" fgColor="#0b0a08" />
        </div>
        <p className="text-cream-dim text-[15px] leading-relaxed mt-2">Présentez ce code à l'entrée</p>
      </div>
    </div>
  );
}