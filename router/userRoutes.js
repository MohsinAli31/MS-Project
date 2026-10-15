import express from "express";
import { registerUser, loginUser, getUser, forgotPassword, resetPassword, logoutUser } from "../controllers/authController.js";
// import { isAuthenticated } from "../middlewares/auth.js";
// import multer from "multer";

const router = express.Router();

// Register a new user
router.post("/register", registerUser); 

// Login a user
router.post("/login", loginUser);
router.get("/me", getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// Logout a user
// router.get("/logout", isAuthenticated, logoutUser);

// // Get my profile
// router.get("/profile", isAuthenticated, getUser);

export default router;
