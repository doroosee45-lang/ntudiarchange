import React, { useEffect, useState } from "react";
import { CARD_CENTER, EYEBROW, SUBHEADING } from "../lib/ui.js";

export default function DressCode({ dressCode, autoPlay = true, interval = 4500 }) {
  const images = dressCode?.images || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, images.length]);

  if (!dressCode) return null; // rien à afficher si les données ne sont pas encore là

  const go = (delta) => setIndex((i) => (i + delta + images.length) % images.length);

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
      <p className={EYEBROW}>{dressCode.title || "Dress Code"}</p>
      {dressCode.subtitle && <p className={SUBHEADING}>{dressCode.subtitle}</p>}

      {images.length > 0 && (
        <div className="relative max-w-[420px] mx-auto mt-4.5 animate-photoReveal">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] border-2 border-cream shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
            <div
              className="flex h-full transition-transform duration-[550ms] ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {images.map((src, i) => (
                <div key={i} className="min-w-full h-full bg-[#1a1a1a]">
                  <img
                    src={src}
                    alt={`Dress code ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Image précédente"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm text-cream flex items-center justify-center transition hover:bg-black/65 hover:scale-105 active:scale-95"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Image suivante"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-sm text-cream flex items-center justify-center transition hover:bg-black/65 hover:scale-105 active:scale-95"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  className={
                    i === index
                      ? "w-[18px] h-[7px] rounded-sm bg-gold-strong transition-all"
                      : "w-[7px] h-[7px] rounded-full bg-cream/30 transition-all"
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
