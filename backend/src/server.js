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

const PORT = process.env.PORT || 8081;

connectDB();
const server = app.listen(PORT, () => {
  console.log("Servidor iniciado na porta: " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: ["*", "http://localhost:5173"],
    credentials: true,
  },
  pingTimeout: 60000, // 60 segundos
  pingInterval: 25000, // 25 segundos
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado", socket.id);

  socket.on("joinChat", (data) => {
    socket.join(data);
  });

  socket.on("chatmessage", async (data) => {
    // console.log("[SOCKET] ChatMessage recebida", data);

    try {
      // Verifica se o token foi fornecido
      const { token, combineUsersId, messages, lastMessage } = data;

      // Validação do token
      const decodedToken = verifyToken(token);

      // Atualiza ou insere o chat no banco de dados
      const updatedChat = await userChats.findOneAndUpdate(
        { combineUsersId: combineUsersId },
        { $set: { messages: messages, lastMessage: lastMessage } },
        { new: true, upsert: true }
      );

      console.log("Mensagem salva no banco de dados");

      // Emite a mensagem para todos os clientes conectados
      io.to(combineUsersId).emit("chatmessage_out", updatedChat);
    } catch (error) {
      console.error("Erro ao processar chatmessage:", error.message);
      socket.emit("error", { message: error.message }); // Notifica o cliente sobre o erro
    }
  });
  // Listener para o evento "deletarMensagem"
  socket.on("deletarMensagem", async (data) => {
    try {
      const { token, combineUsersId, messages } = data;

      // Validação do token
      const decodedToken = verifyToken(token);
      // Verifica se ainda há mensagens após a exclusão
      const newLastMessage =
        messages.length > 0 ? messages[messages.length - 1].msg : null;

      // Atualiza o chat no banco de dados com as mensagens restantes
      const updatedChat = await userChats.findOneAndUpdate(
        { combineUsersId: combineUsersId },
        { $set: { messages: messages, lastMessage: newLastMessage } },
        { new: true }
      );

      // Emite o evento de mensagem deletada para todos os usuários conectados
      io.to(combineUsersId).emit("mensagemDeletada", updatedChat);
      console.log("Mensagem deletada no banco de dados");
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error.message);
      socket.emit("error", { message: error.message }); // Notifica o cliente sobre o erro
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado!", socket.id);
  });
});
