"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, useContext } from "react";

interface User {
  id: string | number;
  email: string;
  fullname: string;
  phone: string;
  companyName: string;
  companyAddress: string;
  roles?: string[]; // backend sends role_id, we can map later
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (data: {
    access_token: string;
    refresh_token: string;
    refresh_token_expires: string;
    user: any; // raw backend user
  }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const refresh_token_expires = localStorage.getItem("refresh_token_expires");
    const userData = localStorage.getItem("user");

    if (access_token && refresh_token && refresh_token_expires && userData) {
      setToken(access_token);
      setRefreshToken(refresh_token);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (data: {
    access_token: string;
    refresh_token: string;
    refresh_token_expires: string;
    user: any;
  }) => {
    const mappedUser: User = {
      id: data.user.id,
      email: data.user.email,
      fullname: data.user.fullname,
      phone: data.user.phone,
      companyName: data.user.company_name,
      companyAddress: data.user.company_address,
      roles: [String(data.user.role_id)], // simple mapping
    };

    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    setUser(mappedUser);
    setIsAuthenticated(true);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("refresh_token_expires", data.refresh_token_expires);
    localStorage.setItem("user", JSON.stringify(mappedUser));
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        refreshToken,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
