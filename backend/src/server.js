import os from "os";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./Config/DbConnection.js";
import { Server } from "socket.io";
import userChats from "./models/userChats.js";
import jwt from "jsonwebtoken";

dotenv.config();

export function verifyToken(token) {
  if (!token) throw new Error("Token não fornecido!");

  try {
    const secret = process.env.SECRET;
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  } catch (err) {
    throw new Error("Token inválido!");
  }
}

// Função para obter o IP local da rede
function getNetworkIP() {
  const nets = os.networkInterfaces();
  let localIP = null;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Verifica se é IPv4 e se não é interno
      if (net.family === "IPv4" && !net.internal) {
        localIP = net.address;
        break;
      }
    }
    if (localIP) break;
  }

  return localIP || "0.0.0.0";
}

const PORT = process.env.PORT || 8081;
const HOST = getNetworkIP();

connectDB();
const server = app.listen(PORT, () => {
  console.log(`Servidor iniciado em ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ["*"],
    credentials: true,
  },
  maxHttpBufferSize: 1e9, // 1 GB
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado", socket.id);

  socket.on("joinChat", (data) => {
    socket.join(data);
  });

  socket.on("chatmessage", async (data) => {
    try {
      const { token, combineUsersId, messages, lastMessage } = data;
      const decodedToken = verifyToken(token);

      const updatedChat = await userChats.findOneAndUpdate(
        { combineUsersId: combineUsersId },
        { $set: { messages: messages, lastMessage: lastMessage } },
        { new: true, upsert: true }
      );

      console.log("Mensagem salva no banco de dados");
      io.to(combineUsersId).emit("chatmessage_out", updatedChat);
    } catch (error) {
      console.error("Erro ao processar chatmessage:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("deletarMensagem", async (data) => {
    try {
      const { token, combineUsersId, messages } = data;
      const decodedToken = verifyToken(token);
      const newLastMessage =
        messages.length > 0 ? messages[messages.length - 1].msg : null;

      const updatedChat = await userChats.findOneAndUpdate(
        { combineUsersId: combineUsersId },
        { $set: { messages: messages, lastMessage: newLastMessage } },
        { new: true }
      );

      io.to(combineUsersId).emit("mensagemDeletada", updatedChat);
      console.log("Mensagem deletada no banco de dados");
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error.message);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado!", socket.id);
  });
});
