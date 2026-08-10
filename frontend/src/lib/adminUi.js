// Classes Tailwind partagées pour l'espace admin. Thème sombre et sobre,
// dans la même famille de couleurs (or / crème / encre) que le site public,
// mais une mise en page plus dense et utilitaire (tableaux, formulaires).

export const PAGE = "max-w-6xl mx-auto";
export const H1 = "font-display text-2xl text-cream mb-1";
export const H2 = "font-display text-lg text-cream mb-4";
export const SUBTITLE = "text-cream-dim text-sm mb-6";

export const BTN = "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
export const BTN_PRIMARY = BTN + " bg-gradient-to-b from-gold-strong to-gold-deep text-[#241b06] hover:brightness-105";
export const BTN_GHOST = BTN + " bg-white/5 text-cream border border-white/10 hover:bg-white/10";
export const BTN_DANGER = BTN + " bg-red-900/40 text-red-200 border border-red-800/60 hover:bg-red-900/60";
export const BTN_SMALL = "px-3 py-1.5 text-xs";

export const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-cream text-sm placeholder:text-cream-dim/50 " +
  "focus:outline-none focus:border-gold-strong/70 focus:bg-white/[0.07] transition";
export const INPUT_SEARCH = INPUT + " max-w-xs";

export const FIELD_LABEL = "block text-xs uppercase tracking-[0.12em] text-cream-dim/80 mb-1.5";

export const CARD = "bg-[#151310] border border-white/10 rounded-2xl p-5";

export const TABLE_WRAP = "overflow-x-auto rounded-xl border border-white/10";
export const TABLE = "w-full text-sm border-collapse";
export const TH = "text-left text-xs uppercase tracking-[0.1em] text-cream-dim/70 font-medium px-4 py-3 bg-white/[0.03] border-b border-white/10 whitespace-nowrap";
export const TD = "px-4 py-3 border-b border-white/5 text-cream align-middle";
export const EMPTY_ROW = "px-4 py-8 text-center text-cream-dim/60";

export const ALERT_ERROR = "bg-red-950/50 border border-red-800/50 text-red-200 rounded-lg px-4 py-3 text-sm mb-4";
export const LOADING = "text-cream-dim text-sm py-8 text-center";

export function badgeClass(status) {
  const base = "inline-block px-2.5 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "confirmed":
    case "checked-in":
      return base + " bg-green-900/40 text-green-300 border border-green-800/50";
    case "declined":
      return base + " bg-red-900/40 text-red-300 border border-red-800/50";
    case "not-checked":
      return base + " bg-white/5 text-cream-dim border border-white/10";
    default:
      return base + " bg-yellow-900/30 text-yellow-300 border border-yellow-800/40";
  }
}

export const TAB_BASE = "px-4 py-2 rounded-full text-sm font-medium transition";
export const TAB_ACTIVE = TAB_BASE + " bg-gold-strong text-[#241b06]";
export const TAB_IDLE = TAB_BASE + " bg-white/5 text-cream-dim hover:bg-white/10";

export const MODAL_OVERLAY = "fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4";
export const MODAL_CARD = "bg-[#151310] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto";

export const GRID_2 = "grid grid-cols-1 sm:grid-cols-2 gap-4";
