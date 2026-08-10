import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CARD_CENTER, SECTION_HEADING, MUTED, BTN_GOLD } from "../lib/ui.js";

export default function QrCodeSection({ url, label }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "invitation-qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={CARD_CENTER}>
      <p className={SECTION_HEADING}>🎫 Votre code d'entrée</p>
      <p className={MUTED}>Présentez ce code à l'entrée</p>
      <div className="bg-white p-4 rounded-2xl w-fit mx-auto my-4.5 border-2 border-gold" ref={canvasRef}>
        <QRCodeCanvas value={url} size={200} bgColor="#ffffff" fgColor="#0b0a08" />
      </div>
      {label && <p className={MUTED}>{label}</p>}
      <button className={BTN_GOLD + " mt-4"} onClick={handleDownload}>
        ⬇️  Télécharger le QR Code
      </button>
    </div>
  );
}
