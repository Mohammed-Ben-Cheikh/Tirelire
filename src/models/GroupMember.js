import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupMemberSchema = new Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["invited", "active", "inactive", "left"],
      default: "invited",
    },
    turnOrder: {
      type: Number,
      min: 1,
    },
    joinedAt: {
      type: Date,
    },
    leftAt: {
      type: Date,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    totalContributed: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentsMade: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentsLate: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const GroupMember = mongoose.model("GroupMember", GroupMemberSchema);

export default GroupMember;
