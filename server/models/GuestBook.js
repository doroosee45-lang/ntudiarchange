const mongoose = require("mongoose");

// Livre d'or : messages laissés par les invités, associés à une invitation.
const GuestBookSchema = new mongoose.Schema(
  {
    invitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invite",
      required: true,
    },
    guestName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 280 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GuestBook", GuestBookSchema);
