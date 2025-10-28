import crypto from "crypto";

export function generateToken() {
  const resetToken = crypto.randomBytes(32).toString("hex"); // sent via email
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // saved in DB
  return { resetToken, hashedToken };
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
