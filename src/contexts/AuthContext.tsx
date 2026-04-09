import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: "",
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("querio_auth") === "true";
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("querio_email") || "";
  });

  useEffect(() => {
    localStorage.setItem("querio_auth", String(isAuthenticated));
    localStorage.setItem("querio_email", userEmail);
  }, [isAuthenticated, userEmail]);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    localStorage.removeItem("querio_auth");
    localStorage.removeItem("querio_email");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
