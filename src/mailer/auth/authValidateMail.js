import crypto from "crypto";
import MailValidation from "../../models/EmailValidation.js";
import mailSender from "../mailSender.js";

export const validateMail = async (to) => {
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
            <h2>Email Verification</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a class="button" href="${APP_URL}/auth/validate?token=${combinedToken}">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p>${APP_URL}/auth/validate?token=${combinedToken}</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const subject = "Vérification d'email - Veuillez vérifier votre compte";

  try {
    const mailSent = await mailSender(to, subject, message);
    if (mailSent) {
      const storeToken = new MailValidation({
        email: to,
        token: combinedToken,
      });
      await storeToken.save();
      return {
        success: true,
        message: "Un email de vérification a été envoyé à votre adresse",
      };
    } else {
      return {
        success: false,
        message:
          "Impossible d'envoyer l'email de vérification. Veuillez réessayer plus tard.",
      };
    }
  } catch (error) {
    console.error("Erreur dans validateMail: ", error);
    return {
      success: false,
      message: "Erreur lors de l'envoi de l'email de vérification",
    };
  }
};
