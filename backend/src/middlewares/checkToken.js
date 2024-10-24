import jwt from "jsonwebtoken";

export function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

export function checkTokenAndAdmPermission(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    // Verificar o token e obter as informações do usuário
    const decodedToken = jwt.verify(token, secret);
    const { role } = decodedToken;

    // Verificar se o usuário possui a role "admin"
    if (!role.includes("admin")) {
      return res.status(403).json({ msg: "Permissão negada" });
    }

    // Se o usuário for admin, permitir o acesso à próxima rota
    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}
