import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export const generateToken = (userData) => {
  return jwt.sign(userData, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: "tirelire",
    audience: "tirelire-users",
  });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "tirelire",
      audience: "tirelire-users",
    });
    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error}`);
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    throw new Error("En-tête d'autorisation manquant");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Format d'en-tête d'autorisation invalide");
  }

  return authHeader.substring(7);
};
