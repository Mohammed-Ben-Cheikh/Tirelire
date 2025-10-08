import mongoose from "mongoose";

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
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
export default connectDB;
