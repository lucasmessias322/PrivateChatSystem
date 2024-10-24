import mongoose from "mongoose";

const Msg = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  msg: {
    type: String,
    require: true,
  },
  sendTime: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: "3d" },
  },
});

export default mongoose.model("messages", Msg);
