import User from "../models/User.js";
import { extractTokenFromHeader, verifyToken } from "../utils/jwt.js";
/**
 * Middleware to add success and error response methods to res object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res.error("Utilisateur non trouvé ou désactivé", 401);
    }
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.error(
      "Token invalide",
      401,
      error instanceof Error ? error.message : null
    );
  }
};

