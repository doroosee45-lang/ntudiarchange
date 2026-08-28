const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // ex: "archange-gladys"
    groomName: { type: String, required: true }, // ex: "Archange"
    brideName: { type: String, required: true }, // ex: "Gladys"
    groomFullName: { type: String, default: "" }, // ex: "Archange NTUDI"
    brideFullName: { type: String, default: "" }, // ex: "Gladys BAMOPALABI"
    coupleLabel: { type: String, default: "" }, // ex: "COUPLE ARCHANGE"
    eventTitle: { type: String, default: "Vous êtes invité" },
    eventType: { type: String, default: "Soirée dansante" },
    weddingDate: { type: Date, required: true },

    // Bénédiction / cérémonie
    ceremonyTitle: { type: String, default: "Bénédiction Nuptiale" },
    ceremonyTime: { type: String, default: "" }, // ex: "15h00"
    ceremonyLocation: { type: String, default: "" },
    ceremonyAddress: { type: String, default: "" },

    // Réception / soirée dansante
    receptionTitle: { type: String, default: "Soirée Dansante" },
    receptionTime: { type: String, default: "" },
    receptionLocation: { type: String, default: "" },
    receptionAddress: { type: String, default: "" },
    receptionMapUrl: { type: String, default: "" },

    address: { type: String, default: "" }, // conservé pour compat. avec l'existant
    welcomeMessage: {
      type: String,
      default:
        "Votre présence sera pour nous un honneur et rendra cette journée encore plus mémorable.",
    },
    noteMessage: { type: String, default: "" },
    presenceMessage: { type: String, default: "" },
    welcomeClosing: { type: String, default: "Soyez les bienvenus" },
    signatureLine: { type: String, default: "" },

    // Numéro de table "Kaïros" — dynamique et modifiable par invitation
    // (ex: 1, 2, 3...). Affiché "Kaïros {kairosTable}".
    kairosTable: { type: Number, default: 1 },

    // Mention discrète à propos des cadeaux (ex: "NB : Les cadeaux en espèces.")
    giftsNote: { type: String, default: "" },

    // Dress code : titre + sous-titre + carousel d'images (illustrant la palette)
    dressCode: {
      title: { type: String, default: "Dress Code" },
      subtitle: { type: String, default: "" },
      images: { type: [String], default: [] },
    },

    rsvpDeadline: { type: Date },
    contactPhone: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },

    coverPhotoUrl: { type: String, default: "" }, // photo hero (grand format)
    coupleCirclePhotoUrl: { type: String, default: "" }, // photo ronde page d'accueil
    countdownPhotoUrl: { type: String, default: "" }, // photo dans le compte à rebours
    galleryPhotos: { type: [String], default: [] },
    guestOf: { type: String, default: "Couple Archange" }, // libellé "invité de"

    // Boissons proposées pour le RSVP
    drinks: {
      maxTotal: { type: Number, default: 2 },
      alcoholic: { type: [String], default: [] },
      nonAlcoholic: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invite", InviteSchema);
