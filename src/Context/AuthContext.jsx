import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setToken } from "../Services/api";

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user_profile");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        setToken(token);
      }
    } catch (e) {}
  }, []);

  const login = async ({ email, password }) => {
    setLoadingAuth(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res?.data?.authorization_token ?? res?.data?.token ?? null;
      const u = res?.data?.user ?? null;
      if (!token) return { success: false, message: "No se devolvió ningún token del servidor" };
      setToken(token);
      setUser(u);
      try { localStorage.setItem("auth_token", token); localStorage.setItem("user_profile", JSON.stringify(u)); } catch (e) {}
      return { success: true, user: u };
    } catch (err) {
      console.error("Auth.login error", err);
      return { success: false, message: err?.message || "Error al iniciar sesión" };
    } finally {
      setLoadingAuth(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoadingAuth(true);
    try {

      const payload = { username: name || undefined, name: name || undefined, email, password };
      const res = await api.post("/auth/register", payload);
      return { success: true, message: res?.message || "Registro exitoso" };
    } catch (err) {
      console.error("Auth.register error", err);
      return { success: false, message: err?.message || "Error al registrarse" };
    } finally {
      setLoadingAuth(false);
    }
  };

  const forgotPassword = async ({ email }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      return { success: true, message: res?.message || "Si el correo existe, recibirás instrucciones" };
    } catch (err) {
      console.error("Auth.forgotPassword error", err);
      return { success: false, message: err?.message || "Error al enviar el correo de restablecimiento" };
    }
  };

  const resetPassword = async ({ token, password }) => {
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      return { success: true, message: res?.message || "Contraseña actualizada" };
    } catch (err) {
      console.error("Auth.resetPassword error", err);
      return { success: false, message: err?.message || "Error al restablecer la contraseña" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try { localStorage.removeItem("user_profile"); localStorage.removeItem("auth_token"); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loadingAuth, forgotPassword, resetPassword, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}