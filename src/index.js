import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "holla from main mohammed" });
});

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
