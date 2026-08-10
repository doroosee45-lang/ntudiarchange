import React from "react";
import { CARD_CENTER, EYEBROW, SUBHEADING } from "../lib/ui.js";

export default function DressCode({ dressCode }) {
  if (!dressCode) return null; // rien à afficher si les données ne sont pas encore là

  const colors = dressCode.colors || []; // évite le crash si le champ est absent

  return (
    <div className={CARD_CENTER}>
      <svg
        className="w-10 h-10 mx-auto mb-2 text-gold-strong"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M8 4 4 7l2 3 1-.6V20h10V9.4l1 .6 2-3-4-3-1.5 1.5a2.5 2.5 0 0 1-3 0L8 4Z" />
      </svg>
      <p className={EYEBROW}>Dress Code</p>
      <h2 className="font-script italic font-semibold text-2xl text-center text-cream mb-3.5">
        {dressCode.title}
      </h2>
      <p className={SUBHEADING}>{dressCode.subtitle}</p>
      {colors.length > 0 && (
        <div className="flex justify-center mt-4.5 mb-1">
          {colors.map((c, i) => (
            <div
              key={i}
              className="w-[74px] h-[74px] rounded-full border-[3px] border-cream shadow-[0_6px_14px_rgba(0,0,0,0.4)] -ml-4 first:ml-0"
              style={{ background: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
}