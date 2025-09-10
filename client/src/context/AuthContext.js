import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ token: null, user: null });

  // load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("eventra_auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
    }
  }, []);

  // whenever auth changes, set axios Authorization header + persist storage
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      localStorage.setItem("eventra_auth", JSON.stringify(auth));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("eventra_auth");
    }
  }, [auth]);

  const login = (data) => {
    // data = { token, user }
    setAuth({ token: data.token, user: data.user });
  };

  const logout = () => {
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
