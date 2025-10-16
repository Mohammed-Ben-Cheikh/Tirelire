import Kyc from "../models/Kyc.js";
import { validateFace } from "../services/validateImage.service.js";

class KycController {
  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async create(req, res) {
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      nationalIdNumber,
      dateOfBirth,
      street,
      city,
      postalCode,
      country,
    } = req.body;
    const isKycExists = await Kyc.findOne({ userId });
    if (isKycExists) {
      return res.error("Vous avez déjà soumis vos informations KYC", 409);
    }
    const kycs = await Kyc.find({ nationalIdNumber });
    if (kycs.length > 0) {
      return res.error(
        "Cette carte nationale d'identité est déjà utilisée",
        409
      );
    }
    const nationalIdImageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    try {
      const kyc = new Kyc({
        userId,
        firstName,
        lastName,
        nationalIdNumber,
        dateOfBirth,
        address: {
          street,
          city,
          postalCode,
          country,
        },
        nationalIdImageUrl,
      });
      try {
        const savedKyc = await kyc.save();
        return res.success(
          savedKyc,
          "Informations KYC soumises avec succès",
          201
        );
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement des informations KYC:",
          error
        );
        return res.error(
          "Échec de l'enregistrement des informations KYC",
          500,
          error
        );
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la demande KYC:", error);
      return res.error("Données KYC fournies non valides", 400, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async validate(req, res) {
    const { userId } = req.user;
    const selfieImageUrl = `${process.env.API_URL}/uploads/${req.file.filename}`;
    try {
      const kyc = await Kyc.findOne({ userId });
      if (!kyc) {
        return res.error(
          "Aucune information KYC trouvée pour cet utilisateur",
          404
        );
      }
      if (kyc.facialVerificationCompleted) {
        return res.error("Vous avez déjà vérifié votre identité", 409);
      }
      const validation = validateFace(kyc.nationalIdImageUrl, selfieImageUrl);
      if (validation.validate) {
        kyc.facialVerificationCompleted = true;
        kyc.facialVerificationScore = validation.score;
        kyc.selfieImageUrl = selfieImageUrl;
        kyc.reviewedAt = new Date().toISOString();
        kyc.status = "approved";
        kyc.reviewedBy = {
          source: "ai",
          user: null,
        };
        await kyc.save();
        return res.success(
          {},
          "Image correspond à la carte nationale d'identité",
          200
        );
      }
      return res.error(
        "L'image ne correspond pas à la carte nationale d'identité",
        400
      );
    } catch (error) {
      console.error("Erreur lors de la validation de l'image:", error);
      return res.error("Validation échouée", 400, error);
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async getKycs(req, res) {
    try {
      const kycs = await Kyc.find();
      if (kycs.length === 0) {
        return res.error("Aucune information KYC trouvée", 404);
      }
      return res.success(
        { kycs },
        "Informations KYC récupérées avec succès",
        200
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations KYC:",
        error
      );
      return res.error(
        "Échec de la récupération des informations KYC",
        500,
        error
      );
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async getKyc(req, res) {
    const userId = req.user.userId;
    try {
      const kycId = req.query.kycId;
      if (!kycId) {
        return res.error("L'identifiant KYC est requis", 400);
      }
      const kyc = await Kyc.findById(kycId);
      if (!kyc) {
        return res.error("Aucune information KYC trouvée", 404);
      }
      return res.success(
        { kyc },
        "Informations KYC récupérées avec succès",
        200
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations KYC:",
        error
      );
      return res.error(
        "Échec de la récupération des informations KYC",
        500,
        error
      );
    }
  }

  /**
   * User controller function
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   */
  static async adminValidation(req, res) {
    const userId = req.user.userId;
    const { kycId, status, rejectionReason } = req.body;
    const allowedStatuses = ["pending", "in_review", "approved", "rejected"];
    try {
      const kyc = await Kyc.findById(kycId);
      if (!kyc) {
        return res.error("Aucune information KYC trouvée", 404);
      }
      if (!status || !allowedStatuses.includes(status)) {
        return res.error("Statut invalide", 400);
      }
      if (kyc) {
        if (status === "rejected") {
          if (!rejectionReason) {
            return res.error("Un motif de rejet est requis", 400);
          }
          kyc.rejectionReason = rejectionReason;
        }
        kyc.facialVerificationCompleted = true;
        kyc.status = status;
        kyc.facialVerificationScore = 1;
        kyc.reviewedAt = new Date().toISOString();
        kyc.reviewedBy = {
          source: "human",
          user: userId,
        };
      }
      kyc.status = status;
      await kyc.save();
      return res.success(
        { kyc },
        `Statut KYC ${
          status === "approved"
            ? "approuvé"
            : status === "rejected"
            ? "rejeté"
            : "mis à jour"
        } avec succès`,
        200
      );
    } catch (error) {
      console.error("Erreur lors de la validation KYC:", error);
      return res.error("Validation échouée", 500, error);
    }
  }
}
export default KycController;
