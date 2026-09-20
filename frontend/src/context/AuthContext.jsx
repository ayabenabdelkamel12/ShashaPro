import { createContext, useContext, useEffect, useState } from "react";
import {
  register as registerRequest,
  login as loginRequest,
  getMe,
  logout as logoutRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("shashapro_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("shashapro_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const register = async (userData) => {
    const data = await registerRequest(userData);

    if (data.token) {
      localStorage.setItem("shashapro_token", data.token);
    }

    setUser(data.user);

    return data;
  };

  const login = async (credentials) => {
    const data = await loginRequest(credentials);

    localStorage.setItem("shashapro_token", data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // On nettoie quand même la session locale.
    }

    localStorage.removeItem("shashapro_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}