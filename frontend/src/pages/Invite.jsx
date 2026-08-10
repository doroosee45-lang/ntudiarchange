import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FALLBACK_INVITE } from "../data/inviteData.js";
import { fetchInvite, fetchInviteByGuestToken } from "../lib/api.js";
import WhatsAppFloatButton from "../components/WhatsAppFloatButton.jsx";
import Countdown from "../components/Countdown.jsx";
import GalleryCarousel from "../components/GalleryCarousel.jsx";
import DressCode from "../components/DressCode.jsx";
import Preferences from "../components/Preferences.jsx";
import GuestBook from "../components/GuestBook.jsx";
import QrCodeSection from "../components/QrCodeSection.jsx";
import WeddingAssistant from "../components/WeddingAssistant.jsx";
import { CARD_CENTER, CARD, EYEBROW, HR_GOLD, INFO_BOX, INFO_LABEL, INFO_VALUE, MUTED, BTN_RED, FRAME, HOME_CARD } from "../lib/ui.js";

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) + ` • ${new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;

export default function Invite() {
  const { slug: slugFromUrl, token: guestTokenFromUrl } = useParams();
  const slug = slugFromUrl || FALLBACK_INVITE.slug;

  // Les données locales (FALLBACK_INVITE) servent de repli immédiat + de source
  // pour les photos (importées en local via src/assets). Les données réelles
  // (dates, adresses, boissons, dress code...) viennent de l'API si disponible.
  const [invite, setInvite] = useState(
    slug === FALLBACK_INVITE.slug ? FALLBACK_INVITE : { ...FALLBACK_INVITE, slug }
  );

  // Ne concerne que le flux "lien personnalisé par invité" (/invitation/:token) :
  // si le token ne correspond à aucun invité (supprimé, lien invalide/erroné),
  // on affiche un message propre plutôt que l'invitation générique de secours.
  const [guestLinkInvalid, setGuestLinkInvalid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Lien personnalisé par invité (/invitation/:token) : on résout le nom
    // de l'invité correspondant en plus des données de l'invitation.
    // Sinon, comportement historique par slug d'invitation.
    const request = guestTokenFromUrl
      ? fetchInviteByGuestToken(guestTokenFromUrl)
      : fetchInvite(slug);

    request
      .then((data) => {
        if (!cancelled && data) {
          setGuestLinkInvalid(false);
          setInvite((prev) => ({
            ...prev,
            ...data,
            // On conserve les photos locales (imports Vite) : l'API ne les sert pas forcément.
            coverPhotoUrl: prev.coverPhotoUrl,
            coupleCirclePhotoUrl: prev.coupleCirclePhotoUrl,
            galleryPhotos: prev.galleryPhotos,
          }));
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (guestTokenFromUrl) {
          // Lien invité invalide ou supprimé : on ne doit surtout pas
          // afficher l'invitation de secours au nom de quelqu'un d'autre.
          setGuestLinkInvalid(true);
        }
        // Sinon (route par slug), silencieux : on reste sur les données de
        // secours si l'API est indisponible — comportement historique inchangé.
      });
    return () => {
      cancelled = true;
    };
  }, [slug, guestTokenFromUrl]);

  const inviteUrl = typeof window !== "undefined" ? window.location.href : `/${invite.slug}`;

  // Lien invité invalide/supprimé : page d'erreur sobre, dans le même
  // langage visuel que le reste de l'app (aucun nouveau style introduit).
  if (guestTokenFromUrl && guestLinkInvalid) {
    return (
      <div className="relative min-h-screen bg-stage overflow-x-hidden flex items-center justify-center p-8">
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
    <div className="relative min-h-screen bg-stage overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none bg-dots" />
      <WhatsAppFloatButton phoneNumber={invite.whatsappNumber} />
      <WeddingAssistant coupleLabel={invite.coupleLabel} />

      <div className={FRAME}>
        {/* Section 1 — photo des mariés, stylisée, avec informations sur la photo */}
        <div className={CARD_CENTER + " !p-0 overflow-hidden"}>
          <div className="relative overflow-hidden corner-frame-tight aspect-[4/5] bg-[#241f19] animate-photoReveal">
            {invite.coverPhotoUrl ? (
              <img
                src={invite.coverPhotoUrl}
                alt={`${invite.groomName} & ${invite.brideName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-script italic text-[28px] text-gold-strong">
                {invite.groomName} &amp; {invite.brideName}
              </div>
            )}

            {/* Overlay très léger + informations posées sur la photo */}
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-8 hero-overlay-gradient">
              <p className="mb-3.5 font-script italic font-semibold text-[2.1rem] leading-[1.1] text-gold-strong tracking-[0.02em] [text-shadow:0_2px_14px_rgba(0,0,0,0.45)] animate-textReveal">
                Archange &amp; Gladys
              </p>
              <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-85 mb-4.5 animate-textReveal" />
              <div className="flex items-end gap-7 md:gap-10 animate-textReveal">
                <div className="flex flex-col items-center leading-[1.15]">
                  <span className="font-display text-[0.72rem] tracking-[0.28em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    Dimanche
                  </span>
                  <span className="font-display font-semibold text-[2.8rem] md:text-[3.4rem] leading-none text-gold-strong [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] my-1">
                    23
                  </span>
                  <span className="font-display text-[0.8rem] tracking-[0.3em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    Août
                  </span>
                  <span className="font-display text-[0.8rem] tracking-[0.3em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    2026
                  </span>
                </div>
                <div className="flex flex-col items-center leading-[1.15]">
                  <span className="font-display text-[0.62rem] tracking-[0.24em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    À partir de
                  </span>
                  <span className="font-display font-semibold text-[1.3rem] md:text-[1.6rem] tracking-[0.06em] text-gold-strong [text-shadow:0_2px_14px_rgba(0,0,0,0.5)] mt-1.5">
                    20H00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — vous êtes invité + message complet */}
        <div className={CARD_CENTER}>
          <p className={EYEBROW}>Vous êtes invités</p>
          <h1 className="font-display text-2xl md:text-[26px] tracking-[0.06em] text-center text-cream mb-1.5 animate-textReveal">
            {invite.coupleLabel}
          </h1>
          <div className={HR_GOLD} />
          <p className="font-script italic font-semibold text-[30px] text-center text-cream mb-3.5">
            {invite.groomName} &amp; {invite.brideName}
          </p>
          {invite.guestName && (
            <p className={MUTED + " text-center mb-2"}>
              Cher/Chère <strong className="text-cream">{invite.guestName}</strong>,
            </p>
          )}
          <p className={MUTED}>{invite.welcomeMessage}</p>
          <p className={MUTED + " mt-3.5"}>
            <em>NB : {invite.noteMessage}</em>
          </p>

          <div className={INFO_BOX + " mt-5 text-left"}>
            <div className={INFO_LABEL}>{invite.ceremonyTitle}</div>
            <div className={INFO_VALUE + " text-base"}>{invite.ceremonyLocation}</div>
            <p className={MUTED + " mt-1"}>
              {invite.ceremonyAddress} — {invite.ceremonyTime}
            </p>
          </div>

          <div className="inline-flex items-center justify-center w-[78px] h-[78px] rounded-full border-2 border-gold bg-[#0e63c9] text-white font-display leading-[1.1] mt-4.5 mx-auto">
            <div className="text-center">
              <div className="text-[9px] tracking-[1px]">{invite.tableLabel}</div>
              <div className="text-xl">#{invite.tableNumber}</div>
            </div>
          </div>
        </div>

        {/* Section 3 — événement : soirée dansante, lieu, adresse, localisation */}
        <div className={CARD}>
          <p className={EYEBROW}>Événement</p>
          <h2 className="font-script italic font-semibold text-[28px] text-center text-cream mb-3.5">
            {invite.receptionTitle}
          </h2>
          <div className={HR_GOLD} />

          <div className={INFO_BOX}>
            <div className={INFO_LABEL}>Lieu de l'événement</div>
            <div className={INFO_VALUE}>{invite.receptionLocation}</div>
          </div>

          <div className={INFO_BOX}>
            <div className={INFO_LABEL}>Adresse</div>
            <p className="m-0 mb-3">{invite.receptionAddress}</p>
            <a className={BTN_RED} href={invite.receptionMapUrl} target="_blank" rel="noreferrer">
              📍 Localisation
            </a>
          </div>

          <p className={MUTED + " text-center italic mt-2"}>{invite.welcomeClosing}</p>
        </div>

        {/* Section 4 — compte à rebours */}
        <Countdown
          targetDate={invite.weddingDate}
          photoUrl={invite.coverPhotoUrl}
          dateLabel={dateLabel(invite.weddingDate)}
        />

        {/* Galerie photos des mariés */}
        <GalleryCarousel photos={invite.galleryPhotos} />

        {/* Dress code */}
        <DressCode dressCode={invite.dressCode} />

        {/* Préférences + confirmation de présence */}
        <Preferences slug={invite.slug} drinks={invite.drinks} />

        {/* Livre d'or */}
        <GuestBook slug={invite.slug} coupleLabel={invite.coupleLabel} fallbackEntries={invite.guestbook} />

        {/* QR code téléchargeable */}
        <QrCodeSection url={inviteUrl} label={`${invite.groomName} & ${invite.brideName}`} />
      </div>
    </div>
  );
}
