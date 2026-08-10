const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");
const Guest = require("../models/Guest");

// Validation backend du RSVP. La liste des boissons autorisées est lue
// dynamiquement depuis l'invitation elle-même (invite.drinks), pour rester
// cohérente avec ce qui est proposé dans l'UI (ex. bières congolaises,
// sodas...) plutôt qu'une liste générique figée.
function validateRsvp(body, invite) {
  const errors = [];

  const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
  if (!guestName) errors.push("Le nom de l'invité est obligatoire.");
  else if (guestName.length > 120) errors.push("Le nom est trop long (120 max).");

  const attendance = body.attendance;
  if (!["confirmed", "declined"].includes(attendance))
    errors.push("Statut de présence invalide.");

  // Si l'invité décline, on neutralise le nombre de personnes et les
  // boissons : un invité absent n'a ni accompagnants ni préférences.
  const isDeclined = attendance === "declined";

  let numberOfGuests = Number(body.numberOfGuests);
  if (isDeclined) {
    numberOfGuests = 0;
  } else if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1 || numberOfGuests > 20) {
    errors.push("Le nombre de personnes doit être un entier entre 1 et 20.");
  }

  const alcoholicOptions = invite?.drinks?.alcoholic || [];
  const nonAlcoholicOptions = invite?.drinks?.nonAlcoholic || [];
  const maxTotal = invite?.drinks?.maxTotal || 2;

  const alcoholicDrinkPreferences = isDeclined
    ? []
    : Array.isArray(body.alcoholicDrinkPreferences)
      ? body.alcoholicDrinkPreferences.filter((p) => alcoholicOptions.includes(p))
      : [];
  const nonAlcoholicDrinkPreferences = isDeclined
    ? []
    : Array.isArray(body.nonAlcoholicDrinkPreferences)
      ? body.nonAlcoholicDrinkPreferences.filter((p) => nonAlcoholicOptions.includes(p))
      : [];

  if (!isDeclined && alcoholicDrinkPreferences.length + nonAlcoholicDrinkPreferences.length > maxTotal) {
    errors.push(`Vous pouvez choisir au maximum ${maxTotal} boisson(s) au total.`);
  }

  const alcoholicDrink = isDeclined ? false : alcoholicDrinkPreferences.length > 0;

  return {
    errors,
    data: {
      guestName,
      attendance,
      numberOfGuests,
      alcoholicDrink,
      alcoholicDrinkPreferences,
      nonAlcoholicDrinkPreferences,
    },
  };
}

// POST /api/rsvp -> enregistrer (créer ou mettre à jour) la réponse d'un invité
router.post("/", async (req, res) => {
  try {
    const invite = await Invite.findOne({ slug: req.body.slug });
    if (!invite)
      return res.status(404).json({ success: false, message: "Invitation introuvable." });

    const { errors, data } = validateRsvp(req.body, invite);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join(" ") });
    }

    // Upsert : si l'invité existe déjà pour cette invitation, on met à jour,
    // sinon on crée. Évite les doublons pour un même invité.
    const filter = {
      invitationId: invite._id,
      guestName: data.guestName,
    };

    const update = {
      $set: {
        attendance: data.attendance,
        numberOfGuests: data.numberOfGuests,
        alcoholicDrink: data.alcoholicDrink,
        alcoholicDrinkPreferences: data.alcoholicDrinkPreferences,
        nonAlcoholicDrinkPreferences: data.nonAlcoholicDrinkPreferences,
      },
      $setOnInsert: {
        guestName: data.guestName,
        invitationId: invite._id,
      },
    };

    const guest = await Guest.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      message: "Votre réponse a bien été enregistrée.",
      data: guest,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/rsvp/:slug -> lister les invités/réponses pour une invitation
router.get("/:slug", async (req, res) => {
  try {
    const invite = await Invite.findOne({ slug: req.params.slug });
    if (!invite)
      return res.status(404).json({ success: false, message: "Invitation introuvable." });

    const guests = await Guest.find({ invitationId: invite._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: guests });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
});

module.exports = router;
