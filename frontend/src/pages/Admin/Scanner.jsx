import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useAuth } from "../../context/AuthContext.jsx";
import { PAGE, H1, SUBTITLE, INPUT, BTN_PRIMARY, BTN_GHOST, ALERT_ERROR } from "../../lib/adminUi.js";

// Scanner de QR codes pour le check-in.
// Format attendu du QR : <origin>/#/:slug?guest=GUEST_ID
// Scénario :
//   Scan -> extraction guestId -> GET /checkin/:guestId (vérif)
//   -> POST /checkin (marquer présent) | alreadyCheckedIn (double scan)
export default function Scanner() {
  const { authFetch } = useAuth();
  const html5QrRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [result, setResult] = useState(null); // { type, guest, message }
  const [manualId, setManualId] = useState("");

  // Récupère le guestId depuis une URL scannée (ex: ?guest=abc123).
  function extractGuestId(raw) {
    try {
      const withoutHash = raw.replace("/#/", "/");
      const url = new URL(withoutHash);
      const g = url.searchParams.get("guest");
      if (g) return g;
    } catch {
      // ce n'est pas une URL valide -> on tente un scan "brut"
    }
    if (/^[a-f0-9]{24}$/i.test(raw.trim())) return raw.trim();
    return null;
  }

  async function checkIn(guestId) {
    let guest;
    try {
      const res = await authFetch({ url: `/admin/checkin/${guestId}` });
      guest = res.data.data;
    } catch (err) {
      setResult({ type: "error", message: err?.response?.data?.message || "QR invalide : invité introuvable." });
      return;
    }

    if (guest.checkInStatus === "checked-in") {
      setResult({ type: "duplicate", guest, message: "⚠️ Invité déjà présent (double scan)." });
      return;
    }

    try {
      const res = await authFetch({ method: "post", url: "/admin/checkin", data: { guestId } });
      setResult({ type: "success", guest: res.data.data, message: "✓ Invitation valide — marqué présent." });
    } catch (err) {
      setResult({ type: "error", message: err?.response?.data?.message || "Erreur lors du check-in." });
    }
  }

  function handleScan(raw) {
    const guestId = extractGuestId(raw);
    if (!guestId) {
      setResult({ type: "error", message: "QR invalide : aucun identifiant invité trouvé." });
      return;
    }
    checkIn(guestId);
  }

  function startScanner() {
    setCameraError("");
    setResult(null);
    const html5Qr = new Html5Qrcode("qr-reader", false);
    html5QrRef.current = html5Qr;

    html5Qr
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          stopScanner();
          handleScan(decodedText);
        },
        () => {}
      )
      .then(() => setScanning(true))
      .catch((err) => {
        setCameraError("Impossible d'accéder à la caméra. Utilisez la saisie manuelle.");
        console.error(err);
        setScanning(false);
      });
  }

  async function stopScanner() {
    setScanning(false);
    if (html5QrRef.current) {
      try {
        if (html5QrRef.current.isScanning) {
          await html5QrRef.current.stop();
          html5QrRef.current.clear();
        }
      } catch (e) {
        console.warn(e);
      }
      html5QrRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      if (html5QrRef.current) {
        try {
          html5QrRef.current.stop().catch(() => {});
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualId) return;
    setResult(null);
    checkIn(manualId.trim());
  }

  const resultStyles = {
    success: "bg-green-950/40 border-green-800/50 text-green-200",
    duplicate: "bg-yellow-950/40 border-yellow-800/50 text-yellow-200",
    error: "bg-red-950/40 border-red-800/50 text-red-200",
  };

  return (
    <div className={PAGE}>
      <h1 className={H1}>Scanner &amp; Check-in</h1>
      <p className={SUBTITLE}>Scannez le QR code d'un invité pour valider son entrée.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div id="qr-reader" className="rounded-xl overflow-hidden bg-black/40 min-h-[280px]" />

          {!scanning && !result && (
            <button className={BTN_PRIMARY + " mt-4 w-full"} onClick={startScanner}>
              Démarrer le scanner
            </button>
          )}

          {scanning && (
            <button className={BTN_GHOST + " mt-4 w-full"} onClick={stopScanner}>
              Arrêter le scanner
            </button>
          )}

          {cameraError && <div className={ALERT_ERROR + " mt-4"}>{cameraError}</div>}
        </div>

        <div>
          {result && (
            <div className={"rounded-xl border p-5 mb-5 text-center " + resultStyles[result.type]}>
              <div className="text-3xl mb-2">{result.type === "success" ? "✓" : result.type === "duplicate" ? "⚠️" : "✕"}</div>
              <p className="font-medium mb-2">{result.message}</p>
              {result.guest && (
                <div className="text-sm">
                  <strong className="block">{result.guest.guestName}</strong>
                  <span className="opacity-80">
                    {result.guest.invitationId
                      ? `${result.guest.invitationId.groomName} & ${result.guest.invitationId.brideName}`
                      : ""}
                  </span>
                  {result.guest.checkInStatus === "checked-in" && result.guest.checkedInAt && (
                    <small className="block mt-1 opacity-70">
                      Présent depuis {new Date(result.guest.checkedInAt).toLocaleTimeString("fr-FR")}
                    </small>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="bg-[#151310] border border-white/10 rounded-xl p-5">
            <p className="text-cream-dim text-sm mb-3">Saisie manuelle (si caméra indisponible)</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input className={INPUT} placeholder="Identifiant invité (guestId)" value={manualId} onChange={(e) => setManualId(e.target.value)} />
              <button className={BTN_PRIMARY} type="submit">
                Vérifier
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
