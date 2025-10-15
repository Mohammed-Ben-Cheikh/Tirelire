import express from "express";
import KycController from "../controllers/KycController.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/uploadImage.js";

const kycRouter = express.Router();

kycRouter.post(
  "/service/kyc",
  authenticate,
  upload.single("nationalIdImage"),
  KycController.create
);

kycRouter.post(
  "/service/kyc/validate",
  authenticate,
  upload.single("selfieImage"),
  KycController.validate
);

export default kycRouter;
