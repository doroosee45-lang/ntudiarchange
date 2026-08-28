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
import { CARD_CENTER, CARD, EYEBROW, HR_GOLD, INFO_BOX, INFO_LABEL, INFO_VALUE, MUTED, BTN_MAPS, FRAME, HOME_CARD } from "../lib/ui.js";
import { getDateParts, dateLabel, capitalize } from "../lib/date.js";

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
            // Idem pour l'image du dress code : l'API ne l'héberge pas forcément.
            dressCode: data.dressCode ? { ...data.dressCode, image: prev.dressCode.image } : prev.dressCode,
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

  // Lien partagé (QR code + bouton "Télécharger le QR Code") : on pointe vers
// la page d'accueil (étape 1 du flux), pas directement vers "/carte", pour
// que toute personne qui rescanne/partage ce code passe aussi par l'écran
// "Vous êtes invité" avant d'arriver sur l'invitation complète.
const inviteUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}#${
        guestTokenFromUrl ? `/invitation/${guestTokenFromUrl}` : `/${invite.slug}`
      }`
    : `/${invite.slug}`;

  // Toutes les sections liées à la date (héros, section événement, compte à
  // rebours, assistant vocal) dérivent de invite.weddingDate : une seule
  // source de vérité, jamais de date en dur dans le JSX.
  const hero = getDateParts(invite.weddingDate);

  // Lien invité invalide/supprimé : page d'erreur sobre, dans le même
  // langage visuel que le reste de l'app (aucun nouveau style introduit).
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
    <div className="relative min-h-screen min-h-dvh bg-stage overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none bg-dots" />
      <WhatsAppFloatButton phoneNumber={invite.whatsappNumber} />
      <WeddingAssistant
        groomName={invite.groomName}
        brideName={invite.brideName}
        weddingDate={invite.weddingDate}
        venue={invite.receptionLocation}
        address={invite.receptionAddress}
      />

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
                {invite.groomName} &amp; {invite.brideName}
              </p>
              <div className="w-[120px] h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-85 mb-4.5 animate-textReveal" />
              <div className="flex items-end gap-7 md:gap-10 animate-textReveal">
                <div className="flex flex-col items-center leading-[1.15]">
                  <span className="font-display text-[0.72rem] tracking-[0.28em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    {hero.dayName}
                  </span>
                  <span className="font-display font-semibold text-[2.8rem] md:text-[3.4rem] leading-none text-gold-strong [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] my-1">
                    {hero.dayNum}
                  </span>
                  <span className="font-display text-[0.8rem] tracking-[0.3em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    {hero.month}
                  </span>
                  <span className="font-display text-[0.8rem] tracking-[0.3em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    {hero.year}
                  </span>
                </div>
                <div className="flex flex-col items-center leading-[1.15]">
                  <span className="font-display text-[0.62rem] tracking-[0.24em] uppercase text-cream [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    À partir de
                  </span>
                  <span className="font-display font-semibold text-[1.3rem] md:text-[1.6rem] tracking-[0.06em] text-gold-strong [text-shadow:0_2px_14px_rgba(0,0,0,0.5)] mt-1.5">
                    {hero.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — texte officiel de l'invitation, révélé progressivement */}
        <div className={CARD_CENTER + " relative overflow-hidden"}>
          {/* Halo doré discret, purement décoratif, derrière le texte */}
          <div
            className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-[220px] h-[220px] rounded-full bg-gold-strong/10 blur-3xl animate-coverGlow"
            aria-hidden="true"
          />

          <p className={EYEBROW}>{invite.eventTitle}</p>
          <h1 className="font-display text-2xl md:text-[26px] tracking-[0.06em] text-center text-cream mb-1.5 animate-textReveal">
            {invite.coupleLabel}
          </h1>
          <div className={HR_GOLD} />
          <p
            className="font-script italic font-semibold text-[30px] text-center text-cream mb-5 animate-textReveal"
            style={{ animationDelay: "0.1s" }}
          >
            {invite.groomName} &amp; {invite.brideName}
          </p>

          <div className="relative space-y-5 max-w-[440px] mx-auto text-left sm:text-center">
            <p className={MUTED + " animate-textReveal"} style={{ animationDelay: "0.2s" }}>
              {invite.welcomeMessage}
            </p>
            <p
              className="font-script italic text-[19px] leading-relaxed text-gold-strong animate-textReveal"
              style={{ animationDelay: "0.35s" }}
            >
              {invite.noteMessage}
            </p>
            <p className={MUTED + " animate-textReveal"} style={{ animationDelay: "0.5s" }}>
              {invite.presenceMessage}
            </p>
            <div className="pt-1 animate-textReveal" style={{ animationDelay: "0.65s" }}>
              <p className={MUTED}>{invite.welcomeClosing}</p>
              <p className="font-script italic text-2xl text-cream mt-1.5">{invite.signatureLine}</p>
            </div>
          </div>

          <div className="inline-flex items-center justify-center w-[78px] h-[78px] rounded-full border-2 border-gold bg-[#0e63c9] text-white font-display leading-[1.1] mt-6 mx-auto">
            <div className="text-center">
              <div className="text-[9px] tracking-[1px]">{invite.tableLabel}</div>
              <div className="text-xl">#{invite.tableNumber}</div>
            </div>
          </div>
        </div>

        {/* Section 3 — événement + localisation */}
        <div className={CARD}>
          <p className={EYEBROW}>{invite.ceremonyTitle}</p>
          <h2 className="font-script italic font-semibold text-[28px] text-center text-cream mb-1.5">
            {invite.receptionTitle}
          </h2>
          <p className="font-display text-sm tracking-[0.08em] text-cream-dim text-center mb-3.5">
            {capitalize(hero.dayName)} {hero.dayNum} {capitalize(hero.month)} {hero.year}
            <br />
            À partir de {hero.time}
          </p>
          <div className={HR_GOLD} />

          <div className={INFO_BOX + " text-center"}>
            <div className={INFO_LABEL}>📍 Lieu</div>
            <div className={INFO_VALUE}>{invite.receptionLocation}</div>
            <p className={MUTED + " mt-2"}>{invite.receptionAddress}</p>
            <a
              className={BTN_MAPS + " mt-4"}
              href={invite.receptionMapUrl}
              target="_blank"
              rel="noreferrer"
            >
              📍 Voir la localisation
            </a>
          </div>
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
