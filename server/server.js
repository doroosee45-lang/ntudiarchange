require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const inviteRoutes = require("./routes/invite");
const rsvpRoutes = require("./routes/rsvp");
const guestbookRoutes = require("./routes/guestbook");
const adminRoutes = require("./routes/admin");

const app = express();

connectDB();

// CORS : autorise une ou plusieurs origines (séparées par des virgules dans
// CLIENT_URL), plus les ports par défaut de Vite en développement, pour
// éviter les erreurs de blocage quand le port du frontend change.
const DEFAULT_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = [
  ...DEFAULT_DEV_ORIGINS,
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin(origin, callback) {
      // Requêtes sans origine (ex: curl, Postman) ou origine autorisée -> OK
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origine non autorisée par CORS : ${origin}`));
    },
  })
);
app.use(express.json({ limit: "5mb" }));

// Routes publiques (Phases 1-3) — aucune authentification requise
app.use("/api/invite", inviteRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/guestbook", guestbookRoutes);

// Routes d'administration (Phase 4) — protégées par JWT (sauf /login)
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Invitation de Mariage — OK");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
