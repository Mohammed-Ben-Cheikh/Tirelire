import express from "express";
import {
  login,
  register,
  registerValidateur,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidateur, register);
authRouter.post("/login", login);

export default authRouter;
