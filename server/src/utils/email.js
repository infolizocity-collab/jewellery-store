// utils/email.js
import nodemailer from "nodemailer";

export const sendOrderEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Order email sent to:", to);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

