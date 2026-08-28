import React from "react";

export default function WhatsAppFloatButton({ phoneNumber, message = "Bonjour, j'ai une question sur l'invitation." }) {
  const href = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : undefined;

  return (
    <a
      className="fixed z-50 w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.4)] border-none animate-floatY transition duration-200 hover:-translate-y-0.5 hover:scale-[1.06] hover:shadow-[0_10px_26px_rgba(37,211,102,0.5)] active:scale-[0.94]"
      style={{
        // max(...) garde 18px sur desktop et respecte l'encoche / la zone
        // sûre sur mobile (iPhone en mode paysage, etc.).
        top: "max(18px, env(safe-area-inset-top))",
        left: "max(18px, env(safe-area-inset-left))",
      }}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter les mariés sur WhatsApp"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm0 18.15c-1.6 0-3.09-.47-4.34-1.28l-.31-.19-3 .79.8-2.92-.2-.3A8.14 8.14 0 1 1 20.15 12 8.16 8.16 0 0 1 12 20.15Zm4.48-6.1c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"
          fill="#fff"
        />
      </svg>
    </a>
  );
}
