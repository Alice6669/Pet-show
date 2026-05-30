import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../componentes/userContext";

export default function PrivateRoute({ children }) {
  const { usuario } = useContext(UserContext);

  return usuario ? children : <Navigate to="/login" replace />;
}
