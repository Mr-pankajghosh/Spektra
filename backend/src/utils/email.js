import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password
  },
});

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export async function sendOTPEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: `"Spektra App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f5f7; padding: 30px 0;">
          <!-- Container -->
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(90deg, #4f46e5, #6366f1); padding: 20px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 28px;">Spektra</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; text-align: center; color: #111;">
              <p style="font-size: 16px; margin-bottom: 20px;">Use the following OTP to complete your action:</p>
              <div style="background: #e0e7ff; display: inline-block; padding: 20px 35px; font-size: 28px; font-weight: bold; border-radius: 10px; letter-spacing: 2px; margin-bottom: 20px;">
                ${otp}
              </div>
              <p style="font-size: 16px; color: #555;">This OTP will expire in <b>10 minutes</b>.</p>
              <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not request this, please ignore this email.</p>
            </div>

            <!-- Footer -->
            <div style="background: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #777;">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Spektra. All rights reserved.</p>
              <p style="margin: 5px 0;">
                Visit our <a href="${process.env.FRONTEND_URL}" style="color: #4f46e5; text-decoration: none;">website</a> | 
                Contact <a href="mailto:support@spektra.com" style="color: #4f46e5; text-decoration: none;">support@spektra.com</a>
              </p>
              <p style="margin: 5px 0;">
                <a href="https://twitter.com" style="margin: 0 5px; text-decoration: none;">🐦 Twitter</a> |
                <a href="https://linkedin.com" style="margin: 0 5px; text-decoration: none;">🔗 LinkedIn</a> |
                <a href="https://instagram.com" style="margin: 0 5px; text-decoration: none;">📸 Instagram</a>
              </p>
            </div>

          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent to", to);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
}

export async function sendResetLinkEmail(to, token) {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log("Sending reset link:", resetUrl);

    await transporter.sendMail({
      from: `"Spektra App" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      text: `Click this link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f5f7; padding: 30px 0;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(90deg, #4f46e5, #6366f1); padding: 20px; text-align: center; color: #fff;">
              <h1 style="margin: 0; font-size: 28px;">Spektra</h1>
            </div>
            <div style="padding: 30px; text-align: center; color: #111;">
              <p style="font-size: 16px; margin-bottom: 20px;">Click the button below to reset your password:</p>
              <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold;">Reset Password</a>
              <p style="font-size: 14px; color: #888; margin-top: 20px;">This link will expire in 1 hour. If you did not request this, please ignore this email.</p>
            </div>
            <div style="background: #f4f5f7; padding: 20px; text-align: center; font-size: 12px; color: #777;">
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Spektra. All rights reserved.</p>
              <p style="margin: 5px 0;">
                Visit our <a href="${process.env.FRONTEND_URL}" style="color: #4f46e5; text-decoration: none;">website</a> | 
                Contact <a href="mailto:support@spektra.com" style="color: #4f46e5; text-decoration: none;">support@spektra.com</a>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ Reset link email sent to", to);
  } catch (error) {
    console.error("❌ Error sending reset link email:", error);
    throw error;
  }
}
