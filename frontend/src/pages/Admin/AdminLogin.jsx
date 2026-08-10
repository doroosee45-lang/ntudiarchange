import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Page de connexion administrateur (/admin/login).
// POST /api/admin/login -> token JWT -> AuthContext -> redirection /admin.
export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Déjà connecté -> on redirige vers le dashboard.
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 401
          ? "Identifiants incorrects."
          : "Erreur de connexion. Vérifiez que le serveur est lancé.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stage flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-panel border border-line rounded-card p-8 shadow-card backdrop-blur-[2px]">
        <p className="font-display tracking-[0.28em] text-xs text-gold-strong uppercase text-center mb-2">
          Espace privé
        </p>
        <h1 className="font-script italic text-3xl text-center text-cream mb-1">Administration</h1>
        <p className="text-cream-dim text-sm text-center mb-6">Archange &amp; Gladys — gestion des invités</p>

        {error && (
          <div className="bg-red-950/50 border border-red-800/50 text-red-200 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="block text-xs uppercase tracking-[0.12em] text-cream-dim/80 mb-1.5">
              Adresse e-mail
            </span>
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-cream text-sm focus:outline-none focus:border-gold-strong/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@archange-gladys-wedding.com"
              required
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="block text-xs uppercase tracking-[0.12em] text-cream-dim/80 mb-1.5">
              Mot de passe
            </span>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-cream text-sm focus:outline-none focus:border-gold-strong/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          <button
            className="w-full bg-gradient-to-b from-gold-strong to-gold-deep text-[#241b06] rounded-lg py-3 font-display font-semibold text-sm hover:brightness-105 transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <Link className="block text-center text-cream-dim text-sm mt-6 hover:text-gold-strong" to="/">
          ← Retour au site public
        </Link>
      </div>
    </div>
  );
}
