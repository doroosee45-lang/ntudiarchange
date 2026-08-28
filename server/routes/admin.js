const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Invite = require("../models/Invite");
const Guest = require("../models/Guest");
const GuestBook = require("../models/GuestBook");
const { protect, JWT_SECRET } = require("../middleware/auth");

// ==========================================================================
// AUTHENTIFICATION ADMIN
// ==========================================================================

// POST /api/admin/login -> connexion
// POST /api/admin/login -> connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔎 Tentative de login, email reçu :", JSON.stringify(email));
    console.log("🔎 Mot de passe reçu (longueur) :", password ? password.length : 0);

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email et mot de passe requis." });

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    console.log("🔎 Admin trouvé en base ?", admin ? `OUI (${admin.email})` : "NON");
    if (admin) {
      console.log("🔎 Hash stocké commence par :", admin.password.slice(0, 10));
    }

    if (!admin)
      return res.status(401).json({ success: false, message: "Identifiants incorrects." });

    const ok = await admin.comparePassword(password);
    console.log("🔎 Comparaison bcrypt réussie ?", ok);

    if (!ok)
      return res.status(401).json({ success: false, message: "Identifiants incorrects." });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "60d" });

    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// Toutes les routes ci-dessous sont protégées par JWT
router.use(protect);

// ==========================================================================
// DASHBOARD
// ==========================================================================

// GET /api/admin/dashboard -> statistiques essentielles
router.get("/dashboard", async (req, res) => {
  try {
    const guests = await Guest.find();
    const confirmed = guests.filter((g) => g.attendance === "confirmed");
    const declined = guests.filter((g) => g.attendance === "declined");
    const pending = guests.filter((g) => g.attendance === "pending");
    const present = guests.filter((g) => g.checkInStatus === "checked-in");

    const peopleExpected = confirmed.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);
    const peoplePresent = present.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);
    const confirmationRate =
      confirmed.length + declined.length > 0
        ? Math.round((confirmed.length / (confirmed.length + declined.length)) * 100)
        : 0;

    res.json({
      success: true,
      data: {
        invitations: await Invite.countDocuments(),
        guests: {
          total: guests.length,
          confirmed: confirmed.length,
          declined: declined.length,
          pending: pending.length,
          present: present.length,
        },
        peopleExpected,
        peoplePresent,
        confirmationRate,
        guestbookMessages: await GuestBook.countDocuments(),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// ==========================================================================
// GESTION DES INVITATIONS
// ==========================================================================

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// GET /api/admin/invitations
router.get("/invitations", async (req, res) => {
  try {
    const invites = await Invite.find().sort({ createdAt: -1 });
    res.json({ success: true, data: invites });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// POST /api/admin/invitations -> créer (slug auto si absent)
router.post("/invitations", async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) {
      body.slug = slugify(`${body.groomName || ""} ${body.brideName || ""}`) || "invitation";
    }
    const invite = await Invite.create(body);
    res.status(201).json({ success: true, data: invite });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/admin/invitations/:id
router.get("/invitations/:id", async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ success: false, message: "Invitation introuvable." });
    res.json({ success: true, data: invite });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// PUT /api/admin/invitations/:id
router.put("/invitations/:id", async (req, res) => {
  try {
    const invite = await Invite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invite) return res.status(404).json({ success: false, message: "Invitation introuvable." });
    res.json({ success: true, data: invite });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/invitations/:id
router.delete("/invitations/:id", async (req, res) => {
  try {
    const invite = await Invite.findByIdAndDelete(req.params.id);
    if (!invite) return res.status(404).json({ success: false, message: "Invitation introuvable." });
    // Supprime aussi les invités et messages du livre d'or associés
    await Guest.deleteMany({ invitationId: invite._id });
    await GuestBook.deleteMany({ invitationId: invite._id });
    res.json({ success: true, message: "Invitation supprimée." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// ==========================================================================
// GESTION DES INVITÉS
// ==========================================================================

// GET /api/admin/guests?search=...&invitationId=...
router.get("/guests", async (req, res) => {
  try {
    const { search, invitationId } = req.query;
    const query = {};
    if (invitationId) query.invitationId = invitationId;
    if (search) query.guestName = { $regex: search, $options: "i" };

    const guests = await Guest.find(query)
      .populate("invitationId", "slug groomName brideName")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: guests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// POST /api/admin/guests
// Seul le nom de l'invité est requis : si aucune invitation n'est précisée,
// on rattache automatiquement l'invité à l'unique invitation existante
// (application mono-invitation : un seul design, plusieurs invités/liens).
router.post("/guests", async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.invitationId) {
      const defaultInvite = await Invite.findOne().sort({ createdAt: 1 });
      if (!defaultInvite)
        return res.status(400).json({ success: false, message: "Aucune invitation configurée." });
      body.invitationId = defaultInvite._id;
    }
    const guest = await Guest.create(body);
    res.status(201).json({ success: true, data: guest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/guests/:id
router.put("/guests/:id", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!guest) return res.status(404).json({ success: false, message: "Invité introuvable." });
    res.json({ success: true, data: guest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/guests/:id
router.delete("/guests/:id", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: "Invité introuvable." });
    res.json({ success: true, message: "Invité supprimé." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// ==========================================================================
// RSVP & PRÉFÉRENCES
// ==========================================================================

// GET /api/admin/rsvp?filter=all|confirmed|declined|pending
router.get("/rsvp", async (req, res) => {
  try {
    const { filter } = req.query;
    const query = {};
    if (filter && ["confirmed", "declined", "pending"].includes(filter)) {
      query.attendance = filter;
    }
    const guests = await Guest.find(query)
      .populate("invitationId", "slug groomName brideName")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: guests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// GET /api/admin/preferences -> agrégation des boissons
router.get("/preferences", async (req, res) => {
  try {
    const guests = await Guest.find({ attendance: "confirmed" });
    const alcool = {};
    const sansAlcool = {};
    let alcoolCount = 0;
    let total = 0;

    guests.forEach((g) => {
      total++;
      if (g.alcoholicDrink) {
        alcoolCount++;
        (g.alcoholicDrinkPreferences || []).forEach((p) => {
          alcool[p] = (alcool[p] || 0) + 1;
        });
      }
      (g.nonAlcoholicDrinkPreferences || []).forEach((p) => {
        sansAlcool[p] = (sansAlcool[p] || 0) + 1;
      });
    });

    res.json({
      success: true,
      data: {
        total,
        alcoolCount,
        alcool,
        sansAlcool,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// ==========================================================================
// CHECK-IN (contrôle à l'entrée)
// ==========================================================================

// POST /api/admin/checkin -> marquer un invité comme présent
// body: { guestId }
router.post("/checkin", async (req, res) => {
  try {
    const { guestId } = req.body;
    if (!guestId)
      return res.status(400).json({ success: false, message: "guestId requis." });

    const guest = await Guest.findById(guestId).populate("invitationId", "slug groomName brideName");
    if (!guest)
      return res.status(404).json({ success: false, message: "Invité introuvable." });

    // Double scan détecté
    if (guest.checkInStatus === "checked-in") {
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        message: "Invité déjà présent.",
        data: guest,
      });
    }

    guest.checkInStatus = "checked-in";
    guest.checkedInAt = new Date();
    await guest.save();

    res.json({
      success: true,
      alreadyCheckedIn: false,
      message: "Invité marqué comme présent.",
      data: guest,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// GET /api/admin/checkin/:guestId -> vérifier le statut d'un invité
router.get("/checkin/:guestId", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.guestId).populate(
      "invitationId",
      "slug groomName brideName"
    );
    if (!guest)
      return res.status(404).json({ success: false, message: "Invité introuvable." });
    res.json({ success: true, data: guest });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// ==========================================================================
// LIVRE D'OR ADMIN
// ==========================================================================

// GET /api/admin/guestbook?search=...
router.get("/guestbook", async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }
    const entries = await GuestBook.find(query)
      .populate("invitationId", "slug groomName brideName")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

// DELETE /api/admin/guestbook/:id -> supprimer un message inapproprié
router.delete("/guestbook/:id", async (req, res) => {
  try {
    const entry = await GuestBook.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Message introuvable." });
    res.json({ success: true, message: "Message supprimé." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

module.exports = router;
