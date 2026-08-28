// Le "slug" identifie l'invitation. Tu peux aussi le lire depuis l'URL :
// ex. meyaandoseewedding.com/meya-osee -> slug = "meya-osee"
export const SLUG = import.meta.env.VITE_INVITE_SLUG || "meya-osee";

// Photos importées depuis src/assets
import couplePhoto from "../assets/couple-photo.jpeg";
import photo19_29_53 from "../assets/WhatsApp Image 2026-08-08 at 19.29.53.jpeg";
import photo19_29_54 from "../assets/WhatsApp Image 2026-08-08 at 19.29.54.jpeg";
import photo19_30_16 from "../assets/WhatsApp Image 2026-08-08 at 19.31.58.jpeg";
import photo19_31_57 from "../assets/WhatsApp Image 2026-08-08 at 19.31.57.jpeg";
import photo19_31_58 from "../assets/WhatsApp Image 2026-08-08 at 19.30.16.jpeg";
import photo19_31_58b from "../assets/WhatsApp Image 2026-08-08 at 19.31.58 (1).jpeg";
import dressCodePalette from "../assets/Dress code.jpeg";

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
  weddingDate: "2026-09-09T19:30:00",

  // Cérémonie coutumière
  ceremonyTitle: "Mariage Coutumier",
  ceremonyTime: "19h30",
  ceremonyLocation: "Salle de fête Le Jonker",
  ceremonyAddress: "AV. Kigira N° 1132, Lemba Terminus",

  // Célébration / lieu de réception (même événement, un seul lieu)
  receptionTitle: "La Célébration",
  receptionTime: "19h30",
  receptionLocation: "Salle de fête Le Jonker",
  receptionAddress: "AV. Kigira N° 1132, Lemba Terminus",
  receptionMapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Salle de fête Le Jonker, AV. Kigira N° 1132, Lemba Terminus, Kinshasa"),

  // Texte officiel de l'invitation
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
    image: dressCodePalette,
    colors: ["#1e120a", "#5c3a20", "#9c4f28", "#c17f42", "#bda887"],
  },

  rsvpDeadline: "2026-09-05T00:00:00",
  contactPhone: "+243 827 066 141",
  contactEmail: "",
  whatsappNumber: "243827066141",

  coverPhotoUrl: photo19_31_58,
  coupleCirclePhotoUrl: couplePhoto,
  galleryPhotos: [
    photo19_29_53,
    photo19_29_54,
    photo19_30_16,
    photo19_31_57,
    photo19_31_58b,
    photo19_31_58,
  ],
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
