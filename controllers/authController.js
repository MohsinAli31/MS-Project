import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/generateToken.js";

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

export const loginUser = asyncHandler(async (req, res, next) => {})
export const getUser = asyncHandler(async (req, res, next) => {})
export const logoutUser = asyncHandler(async (req, res, next) => {})
export const forgotPassword = asyncHandler(async (req, res, next) => {})
export const resetPassword = asyncHandler(async (req, res, next) => {})

  