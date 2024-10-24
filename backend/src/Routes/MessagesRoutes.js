import express from "express";
import multer from "multer";
import userChats from "../models/userChats.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

//criar chats entre os dois usuarios

router.post("/", checkToken, async (req, res) => {
  const { userOneInfo, userTwoInfo, combineUsersId, messages } = req.body;

  try {
    // Verifica se já existe um chat com o mesmo combineUsersId
    const existingChat = await userChats.findOne({ combineUsersId });

    if (existingChat) {
      return res.status(400).json({
        error: true,
        message: "Chat já existe",
      });
    }

    // Se o chat não existir, cria um novo
    await userChats.create({
      userOneInfo,
      userTwoInfo,
      combineUsersId,
      messages,
    });
    return res.status(200).json({ msg: "Chat criado com sucesso" });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao criar novo chat :(",
      erro,
    });
  }
});

// Rota para editar um UserChat específico
router.put("/:combinedId", checkToken, async (req, res) => {
  const { combineUsersId, messages } = req.body;

  try {
    // Atualiza o chat com o novo conteúdo de mensagens
    const updatedChat = await userChats.findOneAndUpdate(
      { combineUsersId: combineUsersId },
      { $set: { messages: messages } },
      { new: true, upsert: true }
    );

    if (!updatedChat) {
      return res.status(404).json({
        error: true,
        message: "Chat não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Chat atualizado com sucesso",
      updatedChat,
    });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao atualizar o chat :(",
      erro,
    });
  }
});

//pegar chats entre os dois usuarios
router.get("/:combinedId", checkToken, async (req, res) => {
  const combineUsersId = req.params.combinedId;
  try {
    await userChats.findOne({ combineUsersId }).then((userChat) => {
      return res.json(userChat);
    });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao buscar Messages :(",
      erro,
    });
  }
});

router.get("/userChats/:userId", checkToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    // Corrigindo a consulta para verificar os IDs corretamente
    const userChatsList = await userChats.find({
      $or: [
        { "userOneInfo.id": userId }, // Acesso ao ID do primeiro usuário
        { "userTwoInfo.id": userId }, // Acesso ao ID do segundo usuário
      ],
    });

    // Verifica se a lista de chats está vazia
    if (userChatsList.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Nenhum chat encontrado para este usuário.",
      });
    }

    return res.json(userChatsList);
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao buscar chats :(",
      erro,
    });
  }
});

export default router;
