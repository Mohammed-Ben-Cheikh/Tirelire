import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone_number: {
      type: String,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["particulier", "admin"],
      default: "particulier",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    kyc_status: {
      type: String,
      enum: ["pending", "in_review", "approved", "rejected"],
      default: "pending",
    },
    last_login_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
