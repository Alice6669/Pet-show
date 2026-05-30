// UserContext.jsx
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

    useEffect(() => {
  const usuarioSalvo = localStorage.getItem("usuario");
  if (usuarioSalvo) {
    setUsuario(JSON.parse(usuarioSalvo));
  }
    }, []);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
