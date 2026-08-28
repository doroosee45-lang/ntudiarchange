// Petites constantes de classes Tailwind partagées entre les composants,
// pour garder un design cohérent (boutons, cartes, cadres...) sans dupliquer
// de longues chaînes d'utilitaires partout.

const BTN_BASE =
  "inline-flex items-center justify-center gap-2.5 w-full py-4 px-5 rounded-full font-display " +
  "text-[15px] tracking-[0.02em] font-semibold shadow-[0_10px_26px_rgba(0,0,0,0.25)] transition " +
  "duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-[1.06] " +
  "active:translate-y-0 active:scale-[0.97] active:brightness-[0.98] " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100";

export const BTN_GOLD =
  BTN_BASE +
  " relative overflow-hidden bg-gradient-to-b from-gold-strong to-gold-deep text-[#241b06] animate-goldPulse " +
  "after:content-[''] after:absolute after:top-0 after:-left-[60%] after:w-[45%] after:h-full " +
  "after:[background:linear-gradient(100deg,transparent_0%,rgba(255,255,255,.55)_50%,transparent_100%)] " +
  "after:[transform:skewX(-20deg)] after:animate-shineSweep";

export const BTN_GREEN = BTN_BASE + " animate-btnReveal bg-gradient-to-b from-[#38b57c] to-green-deep text-[#08260f]";

export const BTN_OUTLINE =
  BTN_BASE + " animate-btnReveal bg-black/35 text-cream border border-gold/40 w-auto flex-1 py-3 text-[13px]";

export const BTN_RED = BTN_BASE + " animate-btnReveal bg-[#c0392b] text-white";

export const BTN_MAPS =
  BTN_BASE +
  " relative overflow-hidden animate-btnReveal bg-gradient-to-b from-[#c17f42] to-[#8a4a24] text-cream " +
  "shadow-[0_10px_26px_rgba(0,0,0,0.3),0_0_0_rgba(232,196,104,0)] " +
  "hover:shadow-[0_10px_26px_rgba(0,0,0,0.3),0_0_20px_rgba(232,196,104,0.4)]";

export const CARD = "relative bg-panel border border-line rounded-card p-7 mb-5 shadow-card backdrop-blur-[2px]";
export const CARD_CENTER = CARD + " text-center";

export const FRAME = "relative max-w-[560px] mx-auto px-4 pt-5 pb-12 sm:pt-8 corner-frame animate-frameGlow";

export const HOME_CARD = "max-w-[480px] w-full text-center px-7 py-10 corner-frame animate-frameGlow";

export const EYEBROW = "font-display tracking-[0.32em] text-xs text-gold-strong text-center uppercase mb-2.5 animate-textReveal";

export const HR_GOLD = "w-[70px] h-px bg-gold opacity-70 mx-auto my-2.5 mb-5";

export const SECTION_HEADING =
  "flex items-center justify-center gap-2.5 font-script text-[26px] text-cream mb-1.5 text-center animate-textReveal";

export const SUBHEADING = "font-display text-[13px] tracking-[0.2em] text-gold-strong text-center my-5 mb-3.5";

export const MUTED = "text-cream-dim text-[15px] leading-relaxed";

export const INFO_BOX = "border border-gold/25 rounded-2xl p-4 mb-3.5 bg-black/25";
export const INFO_LABEL = "text-[11px] tracking-[0.2em] text-cream-dim/80 uppercase mb-1.5";
export const INFO_VALUE = "font-script text-xl text-cream";

export const PILL_BASE =
  "px-5 py-3 rounded-full border text-cream text-sm tracking-[0.02em] transition-all duration-150 " +
  "disabled:opacity-35 disabled:cursor-not-allowed";
export const PILL_IDLE = PILL_BASE + " border-gold/35 bg-black/25";
export const PILL_SELECTED = PILL_BASE + " bg-gold-strong border-gold-strong text-[#241b06] font-semibold";

export const MODAL_OVERLAY = "fixed inset-0 bg-black/75 z-[100] flex items-end justify-center";
export const MODAL_SHEET =
  "w-full max-w-[560px] max-h-[88vh] overflow-y-auto bg-[#0e0d0a] border-t border-line rounded-t-[22px] p-5";
export const TEXT_INPUT =
  // text-base (16px) : sous cette taille, Safari iOS zoome automatiquement
  // la page au focus d'un champ, ce qui casse la mise en page.
  "w-full bg-white/[0.04] border border-gold/30 rounded-xl p-3.5 text-cream font-body text-base mb-3 " +
  "placeholder:text-cream-dim/60 focus:outline-none focus:border-gold-strong";
