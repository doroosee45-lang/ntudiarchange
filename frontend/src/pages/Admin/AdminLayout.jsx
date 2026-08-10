import React, { useState } from "react";
import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// Layout de l'espace admin. Protège toutes les routes enfants :
// sans JWT valide -> redirection vers /admin/login.
const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/invitations", label: "Invitations" },
  { to: "/admin/guests", label: "Invités" },
  { to: "/admin/rsvp", label: "RSVP" },
  { to: "/admin/preferences", label: "Préférences" },
  { to: "/admin/guestbook", label: "Livre d'or" },
  { to: "/admin/qrcodes", label: "QR Codes" },
  { to: "/admin/scanner", label: "Scanner" },
];

export default function AdminLayout() {
  const { isAuthenticated, admin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const linkClass = (isActive) =>
    "block px-4 py-2.5 rounded-lg text-sm font-medium transition " +
    (isActive ? "bg-gold-strong/15 text-gold-strong" : "text-cream-dim hover:bg-white/5 hover:text-cream");

  return (
    <div className="min-h-screen bg-ink text-cream flex">
      <aside
        className={
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#100e0b] border-r border-white/10 flex flex-col transition-transform duration-200 " +
          (menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        }
      >
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-strong to-gold-deep text-[#241b06] font-display font-bold flex items-center justify-center text-sm">
            A&amp;G
          </span>
          <div className="leading-tight">
            <strong className="block font-display text-sm">Admin</strong>
            <small className="text-cream-dim text-xs">Wedding</small>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => linkClass(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-display text-sm">
              {(admin?.name || "A").charAt(0).toUpperCase()}
            </span>
            <div className="leading-tight min-w-0">
              <strong className="block text-sm truncate">{admin?.name || "Administrateur"}</strong>
              <small className="text-cream-dim text-xs truncate block">{admin?.email}</small>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Link className="text-xs text-gold-strong hover:underline" to="/">
              ← Voir le site
            </Link>
            <button
              type="button"
              className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10"
              onClick={logout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#100e0b]">
          <button
            type="button"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <span className="font-display text-sm">Espace d'administration</span>
        </header>

        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
