import mongoose from "mongoose";
const { Schema } = mongoose;

const KycSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    nationalIdNumber: {
      type: String,
      required: [true, "Le numéro de carte nationale est requis"],
      trim: true,
      unique: true,
      match: [/^[A-Z0-9]{6,20}$/, "Numéro de CNI invalide"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "La date de naissance est requise"],
    },
    address: {
      street: { type: String, required: [true, "La rue est requise"] },
      city: { type: String, required: [true, "La ville est requise"] },
      postalCode: {
        type: String,
        required: [true, "Le code postal est requis"],
      },
      country: { type: String, default: "Maroc", required: true },
    },
    nationalIdImageUrl: {
      type: String,
      required: [true, "L'image de la carte nationale est requise"],
    },
    selfieImageUrl: {
      type: String,
    },
    facialVerificationCompleted: {
      type: Boolean,
      default: false,
    },
    facialVerificationScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["pending", "in_review", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
    reviewedBy: {
      source: { type: String, enum: ["human", "ai"] },
      user: { type: Schema.Types.ObjectId, ref: "User" },
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

const Kyc = mongoose.model("Kyc", KycSchema);

export default Kyc;
