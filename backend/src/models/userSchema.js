import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },

    messages: []
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", User);
