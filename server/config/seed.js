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
    coupleLabel: "Mariage Coutumier",
    eventTitle: "Vous êtes invités",
    eventType: "Mariage Coutumier",
    weddingDate: new Date("2026-09-09T19:30:00"),

    ceremonyTitle: "Mariage Coutumier",
    ceremonyTime: "19h30",
    ceremonyLocation: "Salle de fête Le Jonker",
    ceremonyAddress: "AV. Kigira N° 1132, Lemba Terminus",

    receptionTitle: "La Célébration",
    receptionTime: "19h30",
    receptionLocation: "Salle de fête Le Jonker",
    receptionAddress: "AV. Kigira N° 1132, Lemba Terminus",
    receptionMapUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Salle de fête Le Jonker, AV. Kigira N° 1132, Lemba Terminus, Kinshasa"),

    welcomeMessage:
      "ont la profonde joie de vous faire part de leur mariage coutumier, scellant devant leurs familles et leurs proches l'union de deux histoires, de deux familles et de deux cœurs.",
    noteMessage:
      "Que ce Kaïros soit le commencement d'une nouvelle page, écrite dans l'amour, la fidélité, la paix et la bénédiction.",
    presenceMessage:
      "Votre présence, vos pensées et vos bénédictions donneront à ce jour une valeur toute particulière.",
    welcomeClosing: "Avec amour et reconnaissance,",
    signatureLine: "Archange & Gladys ❤️",

    tableNumber: "45",
    tableLabel: "Kaïros",

    dressCode: {
      title: "Dress Code",
      subtitle: "Les tons de la palette sont à l'honneur pour cette belle célébration.",
      colors: ["#1e120a", "#5c3a20", "#9c4f28", "#c17f42", "#bda887"],
    },

    rsvpDeadline: new Date("2026-09-05T00:00:00"),
    contactPhone: "+243 827 066 141",
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
