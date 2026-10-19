import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/generateToken.js";
import {forgotPasswordEmailTemplate} from "../utils/emailTemplates.js";
import crypto from "crypto";
import { sendEmail } from "../services/emailService.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    throw new ErrorHandler("Please provide all required fields", 400);
  }
  let user= await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  user = new User({ name, email, password, role });
  await user.save();
  return generateToken(user, 201, "User registered successfully", res);

})

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    throw new ErrorHandler("Please provide email, password, and role", 400);
  }
  const user = await User.findOne({ email, role }).select("+password");
  if(!user) {
    throw new ErrorHandler("Invalid credentials", 401);
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ErrorHandler("Invalid credentials", 401);
  }
  generateToken(user, 200, "User logged in successfully", res);

})
export const logout = asyncHandler(async (req, res, next) => {
    res.status(200)
      .cookie("token", "", {
        expires: new Date(Date.now() ),
        httpOnly: true
  })
  .json({
          success: true,
          message: "Logged out successfully",
        });
})
export const getUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
})
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorHandler("User not found with this email", 404);
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.frontend_url}/reset-password?token=${resetToken}`;
  // Send email with resetPasswordUrl
  // createing email template in utils/emailTemplate.js
  const { subject, html: message } = forgotPasswordEmailTemplate({
    name: user.name,
    resetPasswordUrl,
  });
  try {
    await sendEmail({
      to: user.email,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ErrorHandler("Email could not be sent", 500);
  }
})

// Reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const {token} = req.params;
  const resetpasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetpasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new ErrorHandler("Invalid or expired password reset token", 400);
  }
  if (!req.body.password || !req.body.confirmPassword) {
    throw new ErrorHandler("Please provide password && confirm password", 400);
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new ErrorHandler("Password and confirm password do not match", 400);
  }

  user.password = req.body.password;
  user.resetpasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();
  generateToken(user, 200, "Password reset successful", res);

})

  