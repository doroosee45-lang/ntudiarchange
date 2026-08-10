const mongoose = require("mongoose");
const crypto = require("crypto");

// Un invité est associé à son invitation (via invitationId).
// Il regroupe le RSVP, les préférences boissons et son QR personnel.
const GuestSchema = new mongoose.Schema(
  {
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
      required: true,
    },
    guestName: { type: String, required: true, trim: true },
    // Identifiant court et unique utilisé pour le lien personnalisé de
    // l'invité, ex: https://monsite.com/#/invitation/abc123
    // Généré automatiquement à la création (voir hook pre-validate ci-dessous).
    guestToken: { type: String, unique: true, index: true, sparse: true },
    guestPhoto: { type: String, default: "" },
    attendance: {
      type: String,
      enum: ["confirmed", "declined", "pending"],
      default: "pending",
    },
    numberOfGuests: { type: Number, default: 1, min: 1 },
    alcoholicDrink: { type: Boolean, default: false },
    alcoholicDrinkPreferences: { type: [String], default: [] },
    nonAlcoholicDrinkPreferences: { type: [String], default: [] },
    qrCode: { type: String, default: "" },
    // Contrôle d'accès le jour de l'événement
    checkInStatus: {
      type: String,
      enum: ["not-checked", "checked-in"],
      default: "not-checked",
    },
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Évite les doublons évidents : un même nom pour une même invitation.
GuestSchema.index({ invitationId: 1, guestName: 1 });

// Génère un identifiant court (6 caractères alphanumériques, ex: "abc123")
// pour le lien personnalisé de l'invité, avec vérification d'unicité.
function generateToken() {
  return crypto.randomBytes(4).toString("hex").slice(0, 6);
}

GuestSchema.pre("validate", async function assignGuestToken(next) {
  if (this.guestToken) return next();
  const Guest = this.constructor;
  let token;
  let attempts = 0;
  do {
    token = generateToken();
    attempts += 1;
    // eslint-disable-next-line no-await-in-loop
    var exists = await Guest.exists({ guestToken: token });
  } while (exists && attempts < 10);
  this.guestToken = token;
  next();
});

module.exports = mongoose.model("Guest", GuestSchema);
