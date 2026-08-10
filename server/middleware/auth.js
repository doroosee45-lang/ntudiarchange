const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_tres_long_et_aleatoire";

// Middleware : vérifie que l'utilisateur est authentifié (JWT valide).
// Toutes les routes /api/admin/* protégées passeront par ici.
function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Non authentifié. Token manquant." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré." });
  }
}

module.exports = { protect, JWT_SECRET };
