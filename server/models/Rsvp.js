const mongoose = require("mongoose");

const RsvpSchema = new mongoose.Schema(
  {
    invite: { type: mongoose.Schema.Types.ObjectId, ref: "Invite", required: true },
    fullName: { type: String, required: true },
    attending: { type: Boolean, required: true },
    numberOfGuests: { type: Number, default: 1, min: 1 },
    phone: { type: String, default: "" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rsvp", RsvpSchema);
