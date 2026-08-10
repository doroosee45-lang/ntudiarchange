import React, { useMemo } from "react";

/**
 * Particles — effet élégant et discret de petites étoiles / particules
 * lumineuses qui descendent lentement sur toutes les pages.
 * Purement décoratif : pointer-events none, positionné derrière le contenu.
 */
const COLORS = [
  "rgba(232, 196, 104, 0.9)", // or / champagne
  "rgba(232, 196, 104, 0.7)",
  "rgba(255, 255, 255, 0.75)", // blanc fin
  "rgba(255, 255, 255, 0.5)",
];

export default function Particles({ count = 26 }) {
  const particles = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    const total = isMobile ? Math.round(count * 0.45) : count;

    return Array.from({ length: total }).map((_, i) => {
      const size = 2 + Math.random() * 4; // 2–6 px
      const left = Math.random() * 100; // %
      const duration = 9 + Math.random() * 14; // 9–23 s
      const delay = -Math.random() * 20; // démarrent déjà en cours de chute
      const drift = -14 + Math.random() * 28; // px de dérive latérale
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isStar = Math.random() < 0.22; // ~22% de petites étoiles
      return {
        id: i,
        size,
        left,
        duration,
        delay,
        drift,
        color,
        isStar,
        opacity: 0.35 + Math.random() * 0.5,
      };
    });
  }, [count]);

  return (
    <div
      className="fixed inset-0 z-[1] overflow-hidden pointer-events-none opacity-70 sm:opacity-100"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle animate-particleFall"
          data-star={p.isStar || undefined}
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: p.isStar ? `0 0 8px ${p.color}` : "none",
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--p-op": p.opacity,
          }}
        />
      ))}
    </div>
  );
}
