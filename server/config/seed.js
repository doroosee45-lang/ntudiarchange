// Script pour créer/mettre à jour l'invitation par défaut dans MongoDB.
// Utilisation : npm run seed  (depuis le dossier server)
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Invite = require("../models/Invite");

async function seed() {
  await connectDB();

  const data = {
    slug: "archange-gladys",
    groomName: "Archange",
    brideName: "Gladys",
    groomFullName: "Archange NTUDI",
    brideFullName: "Gladys BAMOPALABI",
    coupleLabel: "COUPLE ARCHANGE",
    eventTitle: "Vous êtes invité",
    eventType: "Soirée dansante",
    weddingDate: new Date("2026-08-23T20:00:00"),

    ceremonyTitle: "Bénédiction Nuptiale",
    ceremonyTime: "20h00",
    ceremonyLocation: "La Maison de Miséricorde",
    ceremonyAddress: "02 Av. des Écuries, Réf. Institut Kilimani, Rond point Magasin",

    receptionTitle: "Soirée Dansante",
    receptionTime: "20h00",
    receptionLocation: "Salle de Fête Exodus; 3ème étage",
    receptionAddress: "Arrêt station Barre (DGC)",
    receptionMapUrl: "https://maps.google.com/?q=Salle+de+Fete+Exodus",

    welcomeMessage:
      "ont l'honneur de vous convier à la soirée dansante célébrant leur mariage, placée sous le signe de l'amour, dans une atmosphère de joie et de grâce. Votre présence illuminera cet événement unique et en rehaussera l'éclat.",
    noteMessage:
      "Afin de garantir le parfait déroulement des festivités, la ponctualité de chacun est vivement sollicitée.",
    welcomeClosing: "Soyez les bienvenus",

    tableNumber: "45",
    tableLabel: "BUNDA",

    dressCode: {
      title: "Prière de respecter le dresscode SVP !",
      subtitle: "Palette à respecter",
      colors: ["#D62B23", "#212B45", "#0A0A0A"],
    },

    rsvpDeadline: new Date("2026-08-20T00:00:00"),
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "243827066141",

    // Remplace par de vraies URLs (ex. hébergées sur Cloudinary) si tu veux
    // que les photos s'affichent aussi côté API — le frontend utilise en
    // attendant ses propres imports locaux (src/assets) comme repli visuel.
    coverPhotoUrl: "",
    coupleCirclePhotoUrl: "",
    galleryPhotos: [],
    guestOf: "Monsieur & Madame",

    drinks: {
      maxTotal: 2,
      alcoholic: ["Castel", "Beaufort", "Tembo", "Nkoy", "Likofi", "Primus", "Turbo", "Heineken"],
      nonAlcoholic: ["Coca", "Fanta", "Maltina", "Vitalo", "Energy Malt", "Sprite", "Eau"],
    },
  };

  const invite = await Invite.findOneAndUpdate({ slug: data.slug }, data, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  console.log("✅ Invitation créée/à jour :", invite.slug);
  mongoose.connection.close();
}

seed();
