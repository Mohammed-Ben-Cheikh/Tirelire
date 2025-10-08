import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const registerValidateur = [
  body("username")
    .exists()
    .withMessage("Le champ prénom est requis")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Le prénom doit contenir entre 2 et 20 caractères"),

  body("email")
    .exists()
    .withMessage("Le champ email est requis")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
    .exists()
    .withMessage("Le champ mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),

  body("confirmPassword")
    .exists()
    .withMessage("La confirmation du mot de passe est requise"),
];

export const loginValidateur = [
  body("email")
    .exists()
    .withMessage("Le champ email est requis")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
    .exists()
    .withMessage("Le champ mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error(errors.array()[0].msg, 400);
  }
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.error("Les mots de passe ne correspondent pas", 400);
  }
  try {
    const findUser = await User.find({ email });
    if (findUser.length > 0) {
      return res.error("Cet email est déjà utilisé", 409);
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    try {
      await user.save();
      return res.success(
        { user: sanitizeUserData(user) },
        "Utilisateur enregistré avec succès",
        201
      );
    } catch (saveError) {
      console.error("Erreur lors de l'insertion de l'utilisateur", saveError);
      return res.error(
        "Échec de l'enregistrement de l'utilisateur",
        500,
        saveError
      );
    }
  } catch (error) {
    console.log(error);
    return res.error("Une erreur inattendue s'est produite", 500);
  }
}

/**
 * User controller function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error(errors.array()[0].msg, 400);
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // Correction ici
    if (!user) {
      return res.error("Email ou mot de passe invalide", 404);
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.error("Email ou mot de passe invalide", 401);
    }
    const userData = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(userData);
    return res.success(
      { user: sanitizeUserData(user), token },
      "Utilisateur connecté avec succès",
      200
    );
  } catch (error) {
    console.log(error);
    return res.error("Une erreur inattendue s'est produite", 500, error);
  }
}

export function sanitizeUserData(userData) {
  const userResponse = { ...userData.toObject() };
  delete userResponse.password;
  return userResponse;
}
