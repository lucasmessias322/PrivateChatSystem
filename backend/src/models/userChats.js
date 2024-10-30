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
  messages: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      }, // ID único gerado automaticamente
      userId: { type: String, require: true },
      msg: { type: String, require: true },
      image: { type: String, require: false },
      sendTime: { type: String, require: true },
      expireAt: {
        type: Date,
        required: true,
        expireAt: { type: Date, expires: "5m", default: Date.now },
      },
    },
  ],
  lastMessage: {
    type: String,
    require: false,
  },
});

export default mongoose.model("userChats", userChats);
