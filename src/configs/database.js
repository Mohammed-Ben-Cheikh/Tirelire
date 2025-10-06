import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;
    await mongoose.connect(mongoURL);
    console.log("Connexion MongoDB établie avec succès");
  } catch (error) {
    console.error(`Erreur à la connexion avec MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
