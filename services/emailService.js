import nodeMailer from "nodemailer";
import ErrorHandler from "../middlewares/error.js";

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email delivery failed:", {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    });
    throw new ErrorHandler("Email could not be sent", 500);
  }
};
