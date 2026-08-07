const { verifyToken } = require("../utils/token");
const { User } = require("../models");

/**
 * Authentication Middleware
 * Verifies Bearer JWT and attaches authenticated user and workspace context to `req`
 */
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    // Fetch user without exposing sensitive password hash
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    // Attach user and workspace context for quick access in controllers
    req.user = user;
    req.workspaceId = decoded.workspaceId || user.workspaceId;
    req.role = decoded.role || user.role;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = protect;