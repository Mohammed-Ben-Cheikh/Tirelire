import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error("Erreur de configuration du transporteur email:", error);
    } else {
      console.log("Transporteur email configuré avec succès");
    }
  });
} catch (error) {
  console.error("Erreur lors de la création du transporteur email:", error);
  transporter = null;
}

export default transporter;
