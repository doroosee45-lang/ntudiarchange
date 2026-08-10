// Le "slug" identifie l'invitation. Tu peux aussi le lire depuis l'URL :
// ex. meyaandoseewedding.com/meya-osee -> slug = "meya-osee"
export const SLUG = import.meta.env.VITE_INVITE_SLUG || "meya-osee";

// Photos importées depuis src/assets
import couplePhoto from "../assets/couple-photo.jpeg";
import photo19_29_53 from "../assets/WhatsApp Image 2026-08-08 at 19.29.53.jpeg";
import photo19_29_54 from "../assets/WhatsApp Image 2026-08-08 at 19.29.54.jpeg";
import photo19_30_16 from "../assets/WhatsApp Image 2026-08-08 at 19.30.16.jpeg";
import photo19_31_57 from "../assets/WhatsApp Image 2026-08-08 at 19.31.57.jpeg";
import photo19_31_58 from "../assets/WhatsApp Image 2026-08-08 at 19.31.58.jpeg";
import photo19_31_58b from "../assets/WhatsApp Image 2026-08-08 at 19.31.58 (1).jpeg";

// Données affichées tant que l'API n'a pas encore répondu (ou si tu préfères
// ne pas utiliser MongoDB tout de suite). Remplace directement ces valeurs
// par les vraies infos si tu veux une version 100% statique.
export const FALLBACK_INVITE = {
  slug: SLUG,
  groomName: "Archange ",
  brideName: "Gladys",
  coupleLabel: "le nom du couple inivté", // il doit commencer a changez a chaque fois qu'ion crée une invitation doit prendre le nom du couple, ou la personne que nous allons invité 
  eventTitle: "Vous êtes invité",
  eventType: "Soirée dansante",
  weddingDate: "2026-08-23T20:00:00",

  // Bénédiction / cérémonie
  ceremonyTitle: "Bénédiction Nuptiale",
  ceremonyTime: "20h00",
  ceremonyLocation: "La Maison de Miséricorde",
  ceremonyAddress: "02 Av. des Écuries, Réf. Institut Kilimani, Rond point Magasin",

  // Réception / soirée dansante
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

rsvpDeadline: "2026-08-20T00:00:00",
  contactPhone: "",
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
