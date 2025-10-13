import crypto from "crypto";
import PasswordReset from "../../models/PasswordReset.js";
import mailSender from "../mailSender.js";

export const passwordResetMail = async (to) => {
  const mailValidationToken = crypto.randomBytes(32).toString("hex");
  const encryptedData = Buffer.from(
    JSON.stringify({
      email: to,
      timestamp: Date.now(),
    })
  ).toString("base64");
  const combinedToken = `${mailValidationToken}.${encryptedData}`;

  const APP_URL = process.env.APP_URL;
  const message = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .header { background-color: #4a86e8; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4a86e8; color: #ddd; text-decoration: none; border-radius: 5px; }
          .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Réinitialisation de mot de passe</h2>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
              <a class="button" href="${APP_URL}/auth/reset-password?token=${combinedToken}">Réinitialiser le mot de passe</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
            <p>${APP_URL}/auth/reset-password?token=${combinedToken}</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>Ce message est automatique, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const subject = "Réinitialisation de mot de passe";

  try {
    const mailSent = await mailSender(to, subject, message);
    if (mailSent) {
      const storeToken = new PasswordReset({
        email: to,
        token: combinedToken,
      });
      await storeToken.save();
      return {
        success: true,
        message:
          "Un email de réinitialisation de mot de passe a été envoyé à votre adresse",
      };
    } else {
      return {
        success: false,
        message:
          "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer plus tard.",
      };
    }
  } catch (error) {
    console.error("Erreur dans passwordResetMail: ", error);
    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email de réinitialisation",
    };
  }
};
