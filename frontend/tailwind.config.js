/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0a08",
        panel: "rgba(20, 18, 15, 0.72)",
        "panel-soft": "rgba(20, 18, 15, 0.55)",
        cream: "#f4ecd8",
        "cream-dim": "rgba(244, 236, 216, 0.65)",
        gold: "#d9b352",
        "gold-strong": "#e8c468",
        "gold-deep": "#b8873a",
        "gold-light": "#f0d385",
        green: "#2fa76a",
        "green-deep": "#1f7c4f",
        line: "rgba(217, 179, 82, 0.45)",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        script: ["Cormorant Garamond", "serif"],
        body: ["Marcellus", "serif"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(0, 0, 0, 0.55)",
      },
      borderRadius: {
        card: "22px",
      },
      keyframes: {
        coverGlow: {
          "0%, 100%": { boxShadow: "0 0 30px rgba(201, 162, 75, 0.28)" },
          "50%": { boxShadow: "0 0 50px rgba(201, 162, 75, 0.5)" },
        },
        sparkleTwinkle: {
          "0%, 100%": { opacity: 0.25, transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: 1, transform: "scale(1.15) rotate(20deg)" },
        },
        particleFall: {
          "0%": { transform: "translate3d(0, -4vh, 0) translateX(0)", opacity: 0 },
          "8%": { opacity: "var(--p-op, 0.7)" },
          "50%": { transform: "translate3d(var(--drift, 10px), 48vh, 0)", opacity: "var(--p-op, 0.7)" },
          "92%": { opacity: 0 },
          "100%": { transform: "translate3d(calc(var(--drift, 10px) * -0.6), 104vh, 0)", opacity: 0 },
        },
        photoReveal: {
          "0%": { opacity: 0, transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        btnReveal: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        textReveal: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        frameGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 2px rgba(232, 196, 104, 0.15))" },
          "50%": { filter: "drop-shadow(0 0 8px rgba(232, 196, 104, 0.35))" },
        },
        goldPulse: {
          "0%, 100%": {
            filter: "brightness(1)",
            boxShadow: "0 10px 26px rgba(0, 0, 0, 0.25), 0 0 0 rgba(232, 196, 104, 0)",
          },
          "50%": {
            filter: "brightness(1.05)",
            boxShadow: "0 10px 26px rgba(0, 0, 0, 0.25), 0 0 22px rgba(232, 196, 104, 0.45)",
          },
        },
        shineSweep: {
          "0%": { left: "-60%" },
          "18%": { left: "125%" },
          "100%": { left: "125%" },
        },
        assistantPing: {
          "0%": { transform: "scale(0.85)", opacity: 0.8 },
          "100%": { transform: "scale(1.45)", opacity: 0 },
        },
        dotPulse: {
          "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
          "50%": { opacity: 1, transform: "scale(1.1)" },
        },
        ringHint: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(47, 167, 106, 0.55)" },
          "50%": { boxShadow: "0 0 0 9px rgba(47, 167, 106, 0)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        coverGlow: "coverGlow 4s ease-in-out infinite",
        sparkleTwinkle: "sparkleTwinkle 2.6s ease-in-out infinite",
        particleFall: "particleFall linear infinite",
        photoReveal: "photoReveal 1s ease both",
        btnReveal: "btnReveal 0.6s ease both",
        textReveal: "textReveal 0.8s ease both",
        frameGlow: "frameGlow 3.2s ease infinite",
        goldPulse: "btnReveal 0.6s ease both, goldPulse 4s ease-in-out infinite",
        shineSweep: "shineSweep 5.5s ease-in-out infinite",
        assistantPing: "assistantPing 1.4s ease-out infinite",
        dotPulse: "dotPulse 1.1s ease-in-out infinite",
        ringHint: "ringHint 1.6s ease-in-out infinite",
        floatY: "floatY 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
