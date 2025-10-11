import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  AuthController.registerValidateur,
  AuthController.register
);
authRouter.post("/login", AuthController.loginValidateur, AuthController.login);
authRouter.post(
  "/validate",
  AuthController.tokenValidateur,
  AuthController.validate
);
authRouter.post(
  "/message/validate",
  AuthController.emailValidateur,
  AuthController.validateMessage
);
authRouter.post("/reset", AuthController.resetValidateur, AuthController.reset);
authRouter.post(
  "/message/reset",
  AuthController.emailValidateur,
  AuthController.resetMessage
);

export default authRouter;
