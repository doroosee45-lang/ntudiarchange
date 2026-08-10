const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");
const Guest = require("../models/Guest");

// GET /api/invite/link/:token -> récupérer l'invitation + le nom de l'invité
// à partir de son lien personnalisé unique (ex: /invitation/abc123).
// Déclarée avant "/:slug" pour ne pas être capturée par cette route générique.
router.get("/link/:token", async (req, res) => {
  try {
    const guest = await Guest.findOne({ guestToken: req.params.token }).populate("invitationId");
    if (!guest || !guest.invitationId)
      return res.status(404).json({ success: false, message: "Lien d'invitation introuvable" });

    res.json({
      success: true,
      guestName: guest.guestName,
      guestToken: guest.guestToken,
      ...guest.invitationId.toObject(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// GET /api/invite/:slug -> récupérer une invitation par son identifiant unique
router.get("/:slug", async (req, res) => {
  try {
    const invite = await Invite.findOne({ slug: req.params.slug });
    if (!invite)
      return res.status(404).json({ success: false, message: "Invitation introuvable" });
    res.json(invite);
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// POST /api/invite -> créer une nouvelle invitation
router.post("/", async (req, res) => {
  try {
    const invite = await Invite.create(req.body);
    res.status(201).json(invite);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/invite/:slug -> mettre à jour une invitation
router.put("/:slug", async (req, res) => {
  try {
    const invite = await Invite.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invite)
      return res.status(404).json({ success: false, message: "Invitation introuvable" });
    res.json(invite);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
