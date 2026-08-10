import React, { useEffect, useState } from "react";
import { CARD, SECTION_HEADING, HR_GOLD } from "../lib/ui.js";

export default function GalleryCarousel({ photos = [], autoPlay = true, interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const slides = photos.length ? photos : [null, null, null];

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, slides.length]);

  return (
    <div className={CARD}>
      <p className={SECTION_HEADING}>📷 Galerie</p>
      <div className={HR_GOLD} />
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-[450ms] ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              className="min-w-full aspect-[4/5] bg-[#1a1a1a] border-2 border-cream rounded-2xl overflow-hidden animate-photoReveal"
            >
              {src ? (
                <img src={src} alt={`Photo des mariés ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream-dim/60 font-script italic">
                  Photo à venir
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            className={
              i === index
                ? "w-[18px] h-[7px] rounded-sm bg-gold-strong transition-all"
                : "w-[7px] h-[7px] rounded-full bg-cream/30 transition-all"
            }
            onClick={() => setIndex(i)}
            aria-label={`Aller à la photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
