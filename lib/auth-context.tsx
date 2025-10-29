"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  address?: string
  city?: string
  country?: string
  role: "user" | "admin"
  plan: "starter" | "normal" | "premium"
  balance: number
  referralCode: string
  referralEarnings: number
  createdAt: string
  payoutMethod?: "bank" | "paypal" | "stripe"
  bankAccount?: string
  paypalEmail?: string
  totalEarnings: number
  totalPayouts: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string, name: string, referralCode?: string) => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo credentials
const DEMO_USERS = {
  "admin@example.com": { password: "admin123", role: "admin" as const },
  "user@example.com": { password: "user123", role: "user" as const },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS]
    if (!demoUser || demoUser.password !== password) {
      throw new Error("Invalid credentials")
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      phone: "+1 (555) 123-4567",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
      address: "123 Main Street",
      city: "San Francisco",
      country: "United States",
      role: demoUser.role,
      plan: "starter",
      balance: demoUser.role === "admin" ? 10000 : 100,
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referralEarnings: 0,
      createdAt: new Date().toISOString(),
      payoutMethod: "bank",
      bankAccount: "****1234",
      paypalEmail: "",
      totalEarnings: demoUser.role === "admin" ? 50000 : 1250,
      totalPayouts: demoUser.role === "admin" ? 45000 : 800,
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const signup = async (email: string, password: string, name: string, referralCode?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      phone: "+1 (555) 000-0000",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email,
      address: "",
      city: "",
      country: "",
      role: "user",
      plan: "starter",
      balance: referralCode ? 50 : 0,
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referralEarnings: 0,
      createdAt: new Date().toISOString(),
      payoutMethod: "bank",
      bankAccount: "",
      paypalEmail: "",
      totalEarnings: 0,
      totalPayouts: 0,
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      localStorage.setItem("user", JSON.stringify(updated))
      setUser(updated)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
