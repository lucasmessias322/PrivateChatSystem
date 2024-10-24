import express from "express";
import User from "../models/userSchema.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.get("/:userId", checkToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    await User.findById(userId, "-password").then((userdata) => {
      return res.json(userdata);
    });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao buscar Usuario :(",
      erro,
    });
  }
});

router.get("/", checkToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    await User.find({}, "-password").then((userdata) => {
      return res.json(userdata);
    });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao buscar Usuarios :(",
      erro,
    });
  }
});

// Nova rota para pesquisa de usuários
//GET /search?search=nome_do_usuario
router.get("/search", checkToken, async (req, res) => {
  const searchQuery = req.query.search || ""; // Pega a query string "search"

  if (!searchQuery) {
    return res.status(400).json({
      error: true,
      message: "A query de pesquisa não pode estar vazia.",
    });
  }

  try {
    // Busca usuários cujo nome contenha a query de pesquisa (case-insensitive)
    const regex = new RegExp(searchQuery, "i"); // 'i' torna a busca case-insensitive
    await User.find({ name: regex }, "-password").then((userdata) => {
      return res.json(userdata);
    });
  } catch (erro) {
    return res.status(400).json({
      error: true,
      message: "Erro ao buscar usuários.",
      erro,
    });
  }
});

export default router;
