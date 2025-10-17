import mongoose from "mongoose";
const { Schema } = mongoose;

const invitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
