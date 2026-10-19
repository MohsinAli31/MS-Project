import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import ErrorHandler from "./error.js";
import { User } from "../models/user.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ErrorHandler("Not authorized, please login to access this route", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select("-resetpasswordToken -resetpasswordExpire ");
  if (!req.user) {
    throw new ErrorHandler("User not found", 404);
  }
  next();
});
