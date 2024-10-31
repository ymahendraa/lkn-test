import express from "express";
import { login, logout } from "../controllers/AuthController";

const router = express.Router();

// route to login
router.post("/login", login);

// route to logout
router.post("/logout", logout);

export default router;
