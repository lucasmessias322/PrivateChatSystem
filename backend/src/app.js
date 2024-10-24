import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import AuthRoutes from "./Routes/AuthRoutes.js";
import UserRoutes from "./Routes/UsersRoutes.js";
import MessagesRoutes from "./Routes/MessagesRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["*"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ msg: "welcome to api" });
});

app.use("/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/chats", MessagesRoutes);

export default app;
