const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // ou "bcrypt" selon ce que tu utilises

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: "Administrateur" },
});

// Hash automatique du mot de passe avant sauvegarde
adminSchema.pre("save", async function (next) {
  console.log("🔧 Hook pre-save déclenché, isModified password ?", this.isModified("password"));
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("🔧 Nouveau hash généré :", this.password.slice(0, 10));
  next();
});

// Méthode de comparaison utilisée au login
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);