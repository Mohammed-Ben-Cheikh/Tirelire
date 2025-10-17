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

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} roles - Required role or array of roles
 * @returns {Function} Express middleware function that validates user roles
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const is = (roles) => async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) {
      return res.error("Utilisateur non trouvé ou désactivé", 401);
    }
    if (
      roles && !Array.isArray(roles)
        ? [roles].includes(decoded.role)
        : roles.includes(decoded.role)
    ) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } else {
      return res.error("Accès non autorisé pour ce rôle", 403);
    }
  } catch (error) {
    return res.error(
      "Token invalide",
      401,
      error instanceof Error ? error.message : null
    );
  }
};
