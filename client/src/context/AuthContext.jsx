import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const { access_token, role, class_assigned } = res.data;

    // Save to state
    setToken(access_token);
    setUser({ role, class_assigned });

    // Save to localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem(
      "user",
      JSON.stringify({ role, class_assigned })
    );

    // Attach token to axios
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${access_token}`;

    navigate("/dashboard");
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // ---------------- RESTORE SESSION ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // restore token into axios
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);