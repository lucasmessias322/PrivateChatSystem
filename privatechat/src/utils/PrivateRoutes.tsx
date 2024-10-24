import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const PrivateRoutes = () => {
  const { userData, token, userId } = useContext(AuthContext);

  // Verifica se o usuário está autenticado
  if (!userData || !token || !userId) {
    return <Navigate to="/account/login" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
