import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("skillswap_token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("skillswap_user") || "null")
  );

  const login = (newToken, newUser) => {
    localStorage.setItem("skillswap_token", newToken);
    localStorage.setItem("skillswap_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("skillswap_token");
    localStorage.removeItem("skillswap_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updater) => {
  setUser((prevUser) => {
    const newUser = typeof updater === "function" ? updater(prevUser) : updater;
    localStorage.setItem("skillswap_user", JSON.stringify(newUser));
    return newUser;
  });
};

  return (
    <AuthContext.Provider value={{ token, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}