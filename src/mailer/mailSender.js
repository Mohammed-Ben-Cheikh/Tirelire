import transporter from "../utils/mailer.js";

const mailSender = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_NAME}" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      html: message,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur envoi email: ", error);
    return false; 
  }
};

export default mailSender;
