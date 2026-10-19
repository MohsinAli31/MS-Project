import express from "express";
import { registerUser, loginUser, getUser, forgotPassword, resetPassword, logout } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
// import multer from "multer";

const router = express.Router();

// Register a new user
router.post("/register", registerUser); 

// Login a user
router.post("/login", loginUser);
router.get("/me",isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

// Logout a user
router.get("/logout", isAuthenticated, logout);
// router.get("/logout", logout);

// // Get my profile

export default router;
