import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

export const registerValidateur = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Le prénom doit contenir entre 2 et 20 caractères"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

export const loginValidateur = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Veuillez fournir un email valide"),

  body("password")
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
    return res.status(400).render("register", {
      error: errors.array()[0].msg,
    });
  }
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.error("Les mots de passe ne correspondent pas", 400);
  }
  try {
    const findUser = User.find({ email });
    if (findUser) {
      return res.error("Cet email est déjà utilisé", 409);
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User(username, email, hashedPassword);
    try {
      await user.save();
      return res.success(user, "User registered successfully", 201);
    } catch (saveError) {
      console.error("Error inserting user", saveError);
      return res.error("Failed to register user", 500, saveError);
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
    return res.status(400).render("login", {
      error: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;
  try {
    const user = await User.find({ email });
    if (!user) {
      return res.error("Email ou mot de passe invalide", 404);
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.error("Email ou mot de passe invalide", 401);
    }
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const token = generateToken(userData);
    return res.success({ user, token }, "User logged in successfully", 200);
  } catch (error) {
    console.log(error);
    return res.error("Une erreur inattendue s'est produite", 500);
  }
}
