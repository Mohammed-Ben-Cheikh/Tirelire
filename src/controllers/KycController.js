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
    const isUserValidate = await Kyc.findOne({ userId });
    if (isUserValidate) {
      return res.error("Vous avez déjà soumis vos informations KYC", 409);
    }
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
    console.log(isUserValidate.nationalIdNumber);
    if (isUserValidate.nationalIdNumber == nationalIdNumber) {
      return res.error(
        "Vous avez déjà soumis vos informations avec cet carte nationale d'identité",
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
}
export default KycController;
