import mongoose from "mongoose";
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du groupe est requis"],
      trim: true,
      maxlength: [100, "Le nom ne peut dépasser 100 caractères"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut dépasser 500 caractères"],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    maxMembers: {
      type: Number,
      required: [true, "Le nombre maximum de membres est requis"],
      min: [2, "Un groupe doit avoir au moins 2 membres"],
      max: [50, "Un groupe ne peut dépasser 50 membres"],
    },
    currentMembersCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    activatedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Group = mongoose.model("Group", GroupSchema);
export default Group;
