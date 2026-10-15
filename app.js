import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {errorMiddleware} from "./middlewares/error.js";
import authRouter from "./router/userRoutes.js";
dotenv.config();


const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Server is running" });
});


app.use(errorMiddleware); // Use the error handling middleware
export default app;
