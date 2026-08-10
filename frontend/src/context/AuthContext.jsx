import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "wedding_admin_token";
const ADMIN_KEY = "wedding_admin_profile";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Instance axios pré-configurée avec l'URL de l'API et le token courant.
  const client = useMemo(() => {
    const instance = axios.create({ baseURL: API_BASE });
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [token]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    else localStorage.removeItem(ADMIN_KEY);
  }, [admin]);

  async function login(email, password) {
    const res = await client.post("/admin/login", { email, password });
    setToken(res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  }

  function logout() {
    setToken("");
    setAdmin(null);
  }

  // Petit adaptateur pour garder l'API `authFetch({ url, method, data, params })`
  // utilisée par les pages admin (style axios).
  function authFetch({ url, method = "get", data, params }) {
    return client.request({ url, method, data, params });
  }

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token),
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  return ctx;
}
