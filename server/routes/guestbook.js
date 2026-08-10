const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");
const GuestBook = require("../models/GuestBook");

const MAX_LENGTH = 280;

// POST /api/guestbook -> ajouter un message au livre d'or
router.post("/", async (req, res) => {
  try {
    const { slug, guestName, message } = req.body;

    const name = typeof guestName === "string" ? guestName.trim() : "";
    const text = typeof message === "string" ? message.trim() : "";

    if (!name) return res.status(400).json({ success: false, message: "Votre nom est obligatoire." });
    if (name.length > 120)
      return res.status(400).json({ success: false, message: "Le nom est trop long (120 max)." });
    if (!text) return res.status(400).json({ success: false, message: "Le message est obligatoire." });
    if (text.length > MAX_LENGTH)
      return res.status(400).json({ success: false, message: `Le message ne doit pas dépasser ${MAX_LENGTH} caractères.` });

    const invite = await Invite.findOne({ slug });
    if (!invite) return res.status(404).json({ success: false, message: "Invitation introuvable." });

    const entry = await GuestBook.create({
      invitationId: invite._id,
      guestName: name,
      message: text,
    });

    res.status(201).json({
      success: true,
      message: "Merci pour votre message !",
      data: entry,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/guestbook/:slug -> lister les messages d'une invitation
router.get("/:slug", async (req, res) => {
  try {
    const invite = await Invite.findOne({ slug: req.params.slug });
    if (!invite) return res.status(404).json({ success: false, message: "Invitation introuvable." });

    const entries = await GuestBook.find({ invitationId: invite._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

module.exports = router;
