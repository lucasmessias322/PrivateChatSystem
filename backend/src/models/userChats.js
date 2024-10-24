import mongoose from "mongoose";

const userChats = new mongoose.Schema({
  userOneInfo: {
    id: { type: String, require: true },
    name: { type: String, require: true },
    username: { type: String, require: true },
  },
  userTwoInfo: {
    id: { type: String, require: true },
    name: { type: String, require: true },
    username: { type: String, require: true },
  },
  combineUsersId: {
    type: String,
    require: true,
  },
  messages: [],
  lastMessage: {
    type: String,
    require: false,
  },
});

export default mongoose.model("userChats", userChats);
