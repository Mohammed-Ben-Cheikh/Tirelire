import express from "express";
import GroupController from "../controllers/GroupController.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/uploadImage.js";
const groupRouter = express.Router();

groupRouter.get("/group/:slug", GroupController.getGroup);

groupRouter.get("/group", GroupController.getGroups);

groupRouter.post(
  "/group",
  authenticate,
  upload.single("image"),
  GroupController.create
);

groupRouter.put(
  "/group/:slug",
  authenticate,
  upload.single("image"),
  GroupController.update
);

groupRouter.delete("/group", authenticate, GroupController.delete);

export default groupRouter;
