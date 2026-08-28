// Le "slug" identifie l'invitation. Tu peux aussi le lire depuis l'URL :
// ex. meyaandoseewedding.com/meya-osee -> slug = "meya-osee"
export const SLUG = import.meta.env.VITE_INVITE_SLUG || "meya-osee";

// Photos importées depuis src/assets. Chaque photo n'est utilisée qu'une
// seule fois dans toute l'invitation (héros, cercle d'accueil, compte à
// rebours, galerie) pour éviter tout doublon à l'affichage.
import couplePhoto from "../assets/couple-photo.jpeg";
import photo1 from "../assets/photo1.jpeg";
import photo2 from "../assets/photo2.jpeg";
import photo3 from "../assets/photo3.jpeg";
import photo4 from "../assets/photo4.jpeg";
import photo5 from "../assets/photo5.jpeg";
import photo6 from "../assets/photo6.jpeg";
import photo7 from "../assets/photo7.jpeg";
import dressCode1 from "../assets/dresse code1.jpeg";
import dressCode2 from "../assets/Dresse code2.jpeg";

// Données affichées tant que l'API n'a pas encore répondu (ou si tu préfères
// ne pas utiliser MongoDB tout de suite). Remplace directement ces valeurs
// par les vraies infos si tu veux une version 100% statique.
export const FALLBACK_INVITE = {
  slug: SLUG,
  groomName: "Archange NTUDI",
  brideName: "Gladys BAMOPALABI",
  coupleLabel: "Mariage Coutumier",
  eventTitle: "Vous êtes invités",
  eventType: "Mariage Coutumier",
  weddingDate: "2026-09-09T19:30:00+01:00",

  // Cérémonie coutumière
  ceremonyTitle: "Mariage Coutumier",
  ceremonyTime: "19h30",
  ceremonyLocation: "Salle de fête Le JOCKER",
  ceremonyAddress: "AV. Kigira N° 1132, Lemba Terminus",

  // Célébration / lieu de réception (même événement, un seul lieu)
  receptionTitle: "La Célébration",
  receptionTime: "19h30",
  receptionLocation: "Salle de fête Le JOCKER",
  receptionAddress: "AV. Kigira N° 1132, Lemba Terminus",
  receptionMapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Salle de fête Le JOCKER, AV. Kigira N° 1132, Lemba Terminus, Kinshasa"),

  // Texte officiel de l'invitation
  welcomeMessage:
    "ont la profonde joie de vous faire part de leur mariage coutumier, scellant devant leurs familles et leurs proches l'union de deux histoires, de deux familles et de deux cœurs.",
  noteMessage:
    "Que ce Kaïros soit le commencement d'une nouvelle page, écrite dans l'amour, la fidélité, la paix et la bénédiction.",
  presenceMessage:
    "Votre présence, vos pensées et vos bénédictions donneront à ce jour une valeur toute particulière.",
  welcomeClosing: "Avec amour et reconnaissance,",
  signatureLine: "Archange & Gladys ❤️",

  // Numéro de table "Kaïros" — donnée dynamique : change uniquement cette
  // valeur pour une autre invitation (Kaïros 1, Kaïros 2, Kaïros 3...).
  kairosTable: 1,

  // NB cadeaux, affiché discrètement près des infos pratiques de l'événement.
  giftsNote: "NB : Les cadeaux en espèces.",

  dressCode: {
    title: "Dress Code",
    subtitle: "Les tons de la palette sont à l'honneur pour cette belle célébration.",
    images: [dressCode1, dressCode2],
  },

  rsvpDeadline: "2026-09-05T00:00:00+01:00",
  contactPhone: "+243 827 066 141",
  contactEmail: "",
  whatsappNumber: "243827066141",

  coverPhotoUrl: photo3,
  coupleCirclePhotoUrl: couplePhoto,
  countdownPhotoUrl: photo2,
  galleryPhotos: [photo1, photo4, photo5, photo6, photo7],
  guestOf: "Monsieur & Madame",

  drinks: {
    maxTotal: 2,
    alcoholic: ["Castel", "Beaufort", "Tembo", "Nkoy", "Likofi", "Primus", "Turbo", "Heineken"],
    nonAlcoholic: ["Coca", "Fanta", "Maltina", "Vitalo", "Energy Malt", "Sprite", "Eau"],
  },

  guestbook: [
    { name: "Plamedie", message: "Mes félicitations à vous ma belle. Que le Bon Dieu vous protège... de bonnes choses à vous ma belle" },
    { name: "Lydia sangwa", message: "Toutes mes félicitations" },
    { name: "Grand B", message: "Que Dieu garde votre union je vous souhaite une longue vie pleine de bonheur, d'amour, de richesse ❤️🙌" },
    { name: "Grand B", message: "Que Dieu garde votre union et qu'il vous accorde une longue vie remplie d'amour, de bonheur et qu'il vous donne beaucoup d'argent" },
    { name: "Invité", message: "Toutes mes félicitations à vous 🎉🎊🎉❤️" },
  ],
};
