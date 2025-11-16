import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOTPEmail, sendResetLinkEmail } from "../utils/email.js";
import { upsertStreamUser } from "../lib/stream.js";
import { generateToken, hashToken } from "../utils/token.js";

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email, isVerified: true });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Error in requestOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp, fullName, password } = req.body;

    if (!email || !otp || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ message: "OTP not requested" });
    if (otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified)
        return res.status(400).json({ message: "User already exists" });

      user.fullName = fullName;
      user.password = password;
      user.isVerified = true;
      await user.save();
    } else {
      const idx = Math.floor(Math.random() * 100) + 1;
      const randomAvatar = `https://api.multiavatar.com/${idx}.png`;

      user = await User.create({
        email,
        fullName,
        password,
        profilePic: randomAvatar,
        isVerified: true,
      });
    }

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || "",
      });
    } catch (error) {
      console.log("Error creating Stream user:", error.message);
    }

    await Otp.deleteOne({ email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email, isVerified: true });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ success: true, message: "Logout successful" });
}


export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️⃣ Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(resetToken);

    // 2️⃣ Save hashed token in DB
  user.resetToken = hashedToken;
user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    await user.save();

    // 3️⃣ Send plain token to email (backend constructs URL)
    await sendResetLinkEmail(email, resetToken);

    console.log("Reset token sent (plain):", resetToken);
    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    let tokenFromUrl = req.params.token;

    tokenFromUrl = decodeURIComponent(tokenFromUrl);

    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "New password is required" });

    const hashedToken = hashToken(tokenFromUrl);
    console.log("Token from URL:", tokenFromUrl);
    console.log("Hashed token:", hashedToken);

 const user = await User.findOne({
  resetToken: hashedToken,
  resetTokenExpiry: { $gt: Date.now() },
});


    console.log("Found user:", user ? user.email : null);

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const {
      fullName = "",
      bio = "",
      profilePic = "",
      nativeLanguage = "",
      learningLanguage = "",
      location = "",
      skillsHave = [],
      skillsLearn = [],
      gender = "",
      occupation = "",
      secretAboutYou = "",
    } = req.body;

    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!bio) missingFields.push("bio");
    if (!nativeLanguage) missingFields.push("nativeLanguage");
    if (!learningLanguage) missingFields.push("learningLanguage");
    if (!location) missingFields.push("location");

    // Convert to arrays if string
    const skillsHaveArr = Array.isArray(skillsHave)
      ? skillsHave
      : typeof skillsHave === "string"
      ? skillsHave.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const skillsLearnArr = Array.isArray(skillsLearn)
      ? skillsLearn
      : typeof skillsLearn === "string"
      ? skillsLearn.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!skillsHaveArr.length) missingFields.push("skillsHave");
    if (!skillsLearnArr.length) missingFields.push("skillsLearn");

    if (missingFields.length) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        profilePic,
        nativeLanguage,
        learningLanguage,
        location,
        skillsHave: skillsHaveArr,
        skillsLearn: skillsLearnArr,
        gender,
        occupation,
        secretAboutYou,
        isOnboarded: true,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

  
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user:", streamError.message);
    }

    const token = jwt.sign(
      { userId: updatedUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in onboard controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
