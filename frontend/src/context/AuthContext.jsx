import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("alignedlife_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("alignedlife_token")) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const persistAuth = (data) => {
    localStorage.setItem("alignedlife_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (payload, mode = "login") => {
    const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
    const { data } = await api.post(endpoint, payload);
    return persistAuth(data);
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    return persistAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("alignedlife_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, loginWithGoogle, logout, refreshUser: fetchMe }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
