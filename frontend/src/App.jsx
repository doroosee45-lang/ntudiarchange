// import React from "react";
// import { HashRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import Home from "./pages/Home.jsx";
// import Invite from "./pages/Invite.jsx";
// import Particles from "./components/Particles.jsx";

// import AdminLogin from "./pages/Admin/AdminLogin.jsx";
// import AdminLayout from "./pages/Admin/AdminLayout.jsx";
// import Dashboard from "./pages/Admin/Dashboard.jsx";
// import Invitations from "./pages/Admin/Invitations.jsx";
// import Guests from "./pages/Admin/Guests.jsx";
// import RSVPs from "./pages/Admin/RSVPs.jsx";
// import AdminPreferences from "./pages/Admin/Preferences.jsx";
// import GuestBookAdmin from "./pages/Admin/GuestBookAdmin.jsx";
// import QRCodeAdmin from "./pages/Admin/QRCodeAdmin.jsx";
// import Scanner from "./pages/Admin/Scanner.jsx";

// export default function App() {
//   return (
//     <AuthProvider>
//       <HashRouter>
//         {/* Couche globale de particules : positionnée une seule fois derrière tout le contenu */}
//         <Particles />
//         <Routes>
//           {/* Espace admin — routes statiques, prioritaires sur /:slug */}
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<Dashboard />} />
//             <Route path="invitations" element={<Invitations />} />
//             <Route path="guests" element={<Guests />} />
//             <Route path="rsvp" element={<RSVPs />} />
//             <Route path="preferences" element={<AdminPreferences />} />
//             <Route path="guestbook" element={<GuestBookAdmin />} />
//             <Route path="qrcodes" element={<QRCodeAdmin />} />
//             <Route path="scanner" element={<Scanner />} />
//           </Route>

//           {/* Site public */}
//           <Route path="/" element={<Home />} />
//           {/* Lien personnalisé par invité : /invitation/:token (ex: /invitation/abc123) */}
//           <Route path="/invitation/:token" element={<Invite />} />
//           <Route path="/:slug" element={<Invite />} />
//           <Route path="*" element={<Home />} />
//         </Routes>
//       </HashRouter>
//     </AuthProvider>
//   );
// }


import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Invite from "./pages/Invite.jsx";
import Particles from "./components/Particles.jsx";

import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Invitations from "./pages/Admin/Invitations.jsx";
import Guests from "./pages/Admin/Guests.jsx";
import RSVPs from "./pages/Admin/RSVPs.jsx";
import AdminPreferences from "./pages/Admin/Preferences.jsx";
import GuestBookAdmin from "./pages/Admin/GuestBookAdmin.jsx";
import QRCodeAdmin from "./pages/Admin/QRCodeAdmin.jsx";
import Scanner from "./pages/Admin/Scanner.jsx";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        {/* Couche globale de particules : positionnée une seule fois derrière tout le contenu */}
        <Particles />
        <Routes>
          {/* Espace admin — routes statiques, prioritaires sur /:slug */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="invitations" element={<Invitations />} />
            <Route path="guests" element={<Guests />} />
            <Route path="rsvp" element={<RSVPs />} />
            <Route path="preferences" element={<AdminPreferences />} />
            <Route path="guestbook" element={<GuestBookAdmin />} />
            <Route path="qrcodes" element={<QRCodeAdmin />} />
            <Route path="scanner" element={<Scanner />} />
          </Route>

          {/* Site public */}
          <Route path="/" element={<Home />} />

          {/* Lien personnalisé par invité : /invitation/:token (ex: /invitation/abc123)
              -> Étape 1 : page d'accueil personnalisée (nom de l'invité + bouton "Télécharger l'invitation")
              -> Étape 2 : /invitation/:token/carte -> l'invitation complète (Invite.jsx) */}
          <Route path="/invitation/:token/carte" element={<Invite />} />
          <Route path="/invitation/:token" element={<Home />} />

          {/* Lien générique par invitation : /:slug
              -> même logique en 2 étapes que ci-dessus */}
          <Route path="/:slug/carte" element={<Invite />} />
          <Route path="/:slug" element={<Home />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}