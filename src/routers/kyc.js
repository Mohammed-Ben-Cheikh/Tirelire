import express from "express";
import KycController from "../controllers/KycController.js";
import { authenticate, is } from "../middleware/auth.js";
import upload from "../middleware/uploadImage.js";

const kycRouter = express.Router();

kycRouter.post(
  "/service/kyc",
  authenticate,
  upload.single("nationalIdImage"),
  KycController.createValidateur,
  KycController.create
);

kycRouter.post(
  "/service/kyc/validate",
  authenticate,
  upload.single("selfieImage"),
  KycController.validate
);

kycRouter.get(
  "/service/kyc/:kycId",
  authenticate,
  is(["particulier", "admin"]),
  KycController.getKyc
);

kycRouter.get(
  "/service/kyc/admin",
  authenticate,
  is("admin"),
  KycController.getKycs
);

kycRouter.post(
  "/service/kyc/admin/validate",
  authenticate,
  upload.single("selfieImage"),
  KycController.adminValidationValidateur,
  KycController.adminValidation
);

export default kycRouter;
