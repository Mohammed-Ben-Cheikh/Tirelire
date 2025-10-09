import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  AuthController.registerValidateur,
  AuthController.register
);
authRouter.post("/login", AuthController.loginValidateur, AuthController.login);

export default authRouter;
