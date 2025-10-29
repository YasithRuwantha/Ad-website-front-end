"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  fullName: string
  email: string
  role: string
  balance: number
  plan: string
  totalPayouts: number
}
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, referralCode?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) setUser(JSON.parse(userData))
    setIsLoading(false)
  }, [])

  // 🟢 Login
const login = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    // ✅ Store token & user in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Update React state
    setUser(data.user);

    // Optional: verify it's stored
    console.log("Saved user:", localStorage.getItem("user"));
    console.log("Saved token:", localStorage.getItem("token"));

    // Optional: alert for debugging
    alert(`Login success!\nUser: ${JSON.stringify(data.user, null, 2)}`);
    setUser(data.user); // ✅ this is enough

  } catch (err: any) {
    alert(err.message || "Login error");
  }
};


  // 🟢 Signup
  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName: name }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Signup failed")

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    setUser(data.user)
  }

  // 🔴 Logout
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
