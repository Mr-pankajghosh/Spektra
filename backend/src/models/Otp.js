import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  password: { type: String },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
}, { timestamps: true });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
