import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import { passwordResetMail } from "../mailer/auth/authResetMail.js";
import { validateMail } from "../mailer/auth/authValidateMail.js";
import EmailValidation from "../models/EmailValidation.js";
import PasswordReset from "../models/PasswordReset.js";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

class AuthController {
  static sanitizeUserData = (userData) => {
    const userResponse = { ...userData.toObject() };
    delete userResponse.password;
    return userResponse;
  };

  static decryptEmailFromToken = (combinedToken) => {
    try {
      const encryptedPart = combinedToken.split(".")[1];
      if (!encryptedPart) return null;
      const decodedData = JSON.parse(
        Buffer.from(encryptedPart, "base64").toString()
      );
      return decodedData.email;
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };

  static registerValidateur = [
    body("firstName")
      .exists()
      .withMessage("Le champ prénom est requis")
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage("Le prénom doit contenir entre 2 et 20 caractères"),

    body("lastName")
      .exists()
      .withMessage("Le champ nom est requis")
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage("Le nom doit contenir entre 2 et 20 caractères"),

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

  static loginValidateur = [
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

  static emailValidateur = [
    body("email")
      .exists()
      .withMessage("Le champ email est requis")
      .isEmail()
      .normalizeEmail()
      .withMessage("Veuillez fournir un email valide"),
  ];

  static resetValidateur = [
    body("password")
      .exists()
      .withMessage("Le champ mot de passe est requis")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),

    body("confirmPassword")
      .exists()
      .withMessage("La confirmation du mot de passe est requise"),

    body("token").exists().withMessage("Le token est requis"),
  ];

  static tokenValidateur = [
    body("token").exists().withMessage("Le token est requis"),
  ];

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { email, password, confirmPassword, firstName, lastName } =
        req.body;
      if (password !== confirmPassword) {
        return res.error("Les mots de passe ne correspondent pas", 400);
      }
      const findUser = await User.find({ email });
      if (findUser.length > 0) {
        return res.error("Cet email est déjà utilisé", 409);
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      try {
        await user.save();
        const mailResult = await validateMail(email);
        if (mailResult.success) {
          return res.success(
            { user: AuthController.sanitizeUserData(user) },
            `Utilisateur enregistré avec succès. ${mailResult.message}`,
            201
          );
        } else {
          return res.success(
            {
              user: AuthController.sanitizeUserData(user),
              emailWarning: true,
            },
            "Utilisateur enregistré avec succès, mais l'email de vérification n'a pas pu être envoyé. Veuillez réessayer plus tard.",
            201
          );
        }
      } catch (saveError) {
        console.error(
          "Erreur lors de l'insertion de l'utilisateur:",
          saveError
        );
        return res.error(
          "Échec de l'enregistrement de l'utilisateur",
          500,
          saveError
        );
      }
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.error("Email ou mot de passe invalide", 404);
      }
      if (!user.email_verified) {
        return res.error(
          "Votre compte n'est pas vérifié. Veuillez vérifier votre email.",
          403,
          { mailvalidationrequire: true }
        );
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
        { user: AuthController.sanitizeUserData(user), token },
        "Utilisateur connecté avec succès",
        200
      );
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async validate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { token } = req.body;
      const email = AuthController.decryptEmailFromToken(token);
      const tokenData = await EmailValidation.findOne({ token });
      if (!tokenData || tokenData.email !== email) {
        return res.error(
          "Token invalide ou ne correspond pas à votre email",
          400
        );
      }
      const user = await User.findOneAndUpdate(
        { email },
        { email_verified: true },
        { new: true }
      );
      if (!user) {
        return res.error("Utilisateur non trouvé", 404);
      }
      await EmailValidation.deleteOne({ token });
      const userData = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
      const jwtToken = generateToken(userData);
      return res.success(
        { user: AuthController.sanitizeUserData(user), token: jwtToken },
        "Utilisateur connecté avec succès",
        200
      );
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async validateMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.error("Utilisateur non trouvé", 404);
      }
      if (user.email_verified === true) {
        return res.success(
          null,
          "Votre compte est déjà vérifié. Vous pouvez vous connecter.",
          200
        );
      }
      const mailResult = await validateMail(email);
      if (mailResult.success) {
        return res.success(null, mailResult.message, 200);
      } else {
        return res.error(mailResult.message, 500);
      }
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async reset(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { password, confirmPassword, token } = req.body;
      if (password !== confirmPassword) {
        return res.error("Les mots de passe ne correspondent pas", 400);
      }
      const email = AuthController.decryptEmailFromToken(token);
      const tokenData = await PasswordReset.findOne({ token });
      if (!tokenData || tokenData.email !== email) {
        return res.error(
          "Token invalide ou ne correspond pas à votre email",
          400
        );
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
      );
      if (!user) {
        return res.error("Utilisateur non trouvé", 404);
      }
      await PasswordReset.deleteOne({ token });
      const userData = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
      const jwtToken = generateToken(userData);
      return res.success(
        { user: AuthController.sanitizeUserData(user), token: jwtToken },
        "Utilisateur connecté avec succès",
        200
      );
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async resetMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.error(errors.array()[0].msg, 400);
      }
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.error("Utilisateur non trouvé", 404);
      }
      const mailResult = await passwordResetMail(email);
      if (mailResult.success) {
        return res.success(null, mailResult.message, 200);
      } else {
        return res.error(mailResult.message, 500);
      }
    } catch (error) {
      console.log(error);
      return res.error("Une erreur inattendue s'est produite", 500, error);
    }
  }
}
export default AuthController;
