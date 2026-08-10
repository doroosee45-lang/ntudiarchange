import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { FALLBACK_INVITE } from "../data/inviteData.js";
import { fetchInvite } from "../lib/api.js";
import { HOME_CARD, EYEBROW } from "../lib/ui.js";

export default function Home() {
  // On affiche tout de suite les données locales de secours, puis on les
  // remplace dès que l'API répond (source de vérité : MongoDB via /api/invite/:slug).
  const [invite, setInvite] = useState(FALLBACK_INVITE);

  useEffect(() => {
    let cancelled = false;
    fetchInvite(FALLBACK_INVITE.slug)
      .then((data) => {
        if (!cancelled && data) {
          // On garde les photos importées localement (l'API ne les héberge pas
          // forcément) et on fusionne le reste des champs distants.
          setInvite((prev) => ({ ...prev, ...data, coupleCirclePhotoUrl: prev.coupleCirclePhotoUrl }));
        }
      })
      .catch(() => {
        // Silencieux : on reste sur les données de secours si l'API est indisponible.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}#/${invite.slug}`
      : `/${invite.slug}`;

  return (
    <div className="relative min-h-screen bg-stage overflow-x-hidden flex items-center justify-center p-8">
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

        <Link
          to={`/${invite.slug}`}
          className="mt-6 relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-full font-display text-[15px] tracking-[0.02em] font-semibold shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-[1.06] active:translate-y-0 active:scale-[0.97] bg-gradient-to-b from-gold-strong to-gold-deep text-[#241b06] animate-goldPulse after:content-[''] after:absolute after:top-0 after:-left-[60%] after:w-[45%] after:h-full after:[background:linear-gradient(100deg,transparent_0%,rgba(255,255,255,.55)_50%,transparent_100%)] after:[transform:skewX(-20deg)] after:animate-shineSweep"
        >
          ✉️ Ouvrez votre invitation ici !
        </Link>

        <div className="bg-white p-4 rounded-2xl w-fit mx-auto mt-6 border-2 border-gold">
          <QRCodeCanvas value={inviteUrl} size={170} bgColor="#ffffff" fgColor="#0b0a08" />
        </div>
        <p className="text-cream-dim text-[15px] leading-relaxed mt-2">Présentez ce code à l'entrée</p>
      </div>
    </div>
  );
}
