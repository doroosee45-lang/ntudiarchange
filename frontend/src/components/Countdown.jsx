import React, { useEffect, useState } from "react";
import { CARD_CENTER, SUBHEADING } from "../lib/ui.js";

function getTimeLeft(targetDate) {
  const total = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { total, days, hours, minutes, seconds };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ targetDate, photoUrl, dateLabel }) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className={CARD_CENTER}>
      <div className="relative w-[240px] h-[240px] mx-auto mb-4.5 rounded-full overflow-hidden animate-photoReveal">
        {photoUrl ? (
          <img src={photoUrl} alt="Les mariés" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#2a2a2a]" />
        )}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="absolute inset-2.5 rounded-full bg-black/70 flex items-center justify-center font-script italic text-5xl text-gold-strong">
            {time.days}
            <span className="text-[22px] ml-1">j</span>
          </div>
        </div>
      </div>

      <p className={SUBHEADING + " mt-1 mb-2"}>Dans exactement</p>
      <div className="grid grid-cols-4 gap-2.5 text-center my-3.5">
        <div>
          <div className="font-display text-[26px] text-cream">{pad(time.days)}</div>
          <div className="text-[11px] tracking-[0.15em] text-cream-dim">J</div>
        </div>
        <div>
          <div className="font-display text-[26px] text-cream">{pad(time.hours)}</div>
          <div className="text-[11px] tracking-[0.15em] text-cream-dim">H</div>
        </div>
        <div>
          <div className="font-display text-[26px] text-cream">{pad(time.minutes)}</div>
          <div className="text-[11px] tracking-[0.15em] text-cream-dim">M</div>
        </div>
        <div>
          <div className="font-display text-[26px] text-cream">{pad(time.seconds)}</div>
          <div className="text-[11px] tracking-[0.15em] text-cream-dim">S</div>
        </div>
      </div>

      {dateLabel && (
        <div className="flex items-center justify-center gap-2.5 border border-line rounded-full py-3 px-4.5 text-gold-strong font-display text-sm">
          <span>📅</span> {dateLabel}
        </div>
      )}
    </div>
  );
}
