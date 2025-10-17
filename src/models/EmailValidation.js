import mongoose from "mongoose";

const { Schema } = mongoose;

const emailValidationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries and to automatically remove expired tokens
emailValidationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const MailValidation = mongoose.model("EmailValidation", emailValidationSchema);

export default MailValidation;
