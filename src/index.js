import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./configs/database.js";
import { responseHandler } from "./middleware/responseHandler.js";
import authRouter from "./routers/auth.js";
import groupRouter from "./routers/group.js";
import kycRouter from "./routers/kyc.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(responseHandler);
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api", kycRouter);
app.use("/api", groupRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`app listening on port http://localhost:${PORT}`);
  });
});
