import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  // check if user exists
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;
    // Defina o tempo de expiração do token JWT (por exemplo, 1 hora a partir de agora)
    const expiresIn = 604800; //604800 em segundos 7 dias
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        username: user.username,
      },
      secret,
      { expiresIn }
    );

    res.status(200).json({
      msg: "Autenticação realizada com sucesso!",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/register", async (req, res) => {
  const { name, username, password, confirmpassword } = req.body;
  const secret = process.env.SECRET;

  // validations
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  } else if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  } else if (password !== confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisam ser iguais!" });
  }

  // check if user exists
  const userNameExists = await User.findOne({ username });
  if (userNameExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const createUser = new User({
    name,
    username,
    password: passwordHash,
  });

  try {
    await createUser.save();

    const user = await User.findOne({ username });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        username: user.username,
      },
      secret
    );

    res.status(201).json({
      msg: "Usuário criado com sucesso!",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

export default router;
