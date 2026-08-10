require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Admin = require("../models/Admin");

async function seedAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans le fichier .env"
    );
    mongoose.connection.close();
    process.exit(1);
  }

  let admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
  if (admin) {
    admin.password = password;
    // Forcé : si l'ancien mot de passe était par erreur stocké en clair et
    // qu'il est identique à la valeur du .env, Mongoose ne détecte aucun
    // changement (comparaison de valeur) et ne redéclenche pas le hook de
    // hachage. markModified() force le hachage dans tous les cas.
    admin.markModified("password");
    admin.name = process.env.ADMIN_NAME || admin.name || "Administrateur";
  } else {
    admin = new Admin({
      email,
      password,
      name: process.env.ADMIN_NAME || "Administrateur",
    });
  }
  await admin.save();

  console.log("✅ Administrateur prêt :", admin.email);
  mongoose.connection.close();
}

seedAdmin();