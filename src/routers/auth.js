import express from "express";
import AuthController from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  AuthController.registerValidateur,
  AuthController.register
);
authRouter.post("/login", AuthController.loginValidateur, AuthController.login);
authRouter.post("/validate", AuthController.validate);
authRouter.post("/message/validate", AuthController.validateMessage);
authRouter.post("/reset", AuthController.reset);
authRouter.post("/message/reset", AuthController.resetMessage);

export default authRouter;
