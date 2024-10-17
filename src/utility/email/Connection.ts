import { ENV } from "@/config/env";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: ENV.MAIL_HOST,
  port: ENV.MAIL_PORT,
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS,
  },
});

async function SendEmail({
  to,
  bcc,
  subject,
  text = "Something went wrong! Update Mail Application this email is for loi request",
  html,
  attachments,
}) {
  try {
    const mailResponse = await transporter.sendMail({
      from: `"Astha Trip" <${MAIL_USER}>`,
      to,
      bcc,
      subject,
      text,
      html,
      attachments,
    });
    return { send: mailResponse.messageId };
  } catch (error) {
    console.log("🚀 ~ SendEmail ~ error:", error);
    return { send: false, err: error, message: error.message };
  }
}
module.exports = SendEmail;
