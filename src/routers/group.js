import express from "express";
import GroupController from "../controllers/GroupController.js";

const groupRouter = express.Router();

groupRouter.get("/group/:slug", GroupController.getGroup);

groupRouter.get("/group", GroupController.getGroups);

groupRouter.post("/group", GroupController.create);

groupRouter.put("/group", GroupController.update);

groupRouter.delete("/group", GroupController.delete);

export default groupRouter;
