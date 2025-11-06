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
  phone: string
  adsPerDay: number
}
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, phone: string, referralCode?: string) => Promise<string>
  logout: () => void
  updateUser: (updates: Partial<User>) => void

}

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Throw an error so the page can catch it
      throw new Error(data.message || "Invalid email or password");
    }
    
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

};

const updateUser = (updates: Partial<User>) => {
  if (!user) return
  const updatedUser = { ...user, ...updates }
  setUser(updatedUser)
  localStorage.setItem("user", JSON.stringify(updatedUser))
}


  // 🟢 Signup
  // 🟢 Signup in auth-context.tsx
const signup = async (email: string, password: string, name: string, phone: string, referralCode?: string) => {
  let extractedReferral: string | undefined = referralCode;

  if (referralCode) {
    const extracted = extractEmailFromRef(referralCode);
    if (extracted) extractedReferral = extracted;
  } else if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const refFromUrl = urlParams.get("ref");
    if (refFromUrl) extractedReferral = refFromUrl;
  }

    const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullName: name, phone, referralCode: extractedReferral }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");

  // ✅ Return message instead of alert
  return "Signup successful! Please wait for admin approval.";
};


  // 🔴 Logout
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}


function extractEmailFromRef(urlString: string) {
  try {
    // 1. Create a URL object from the string
    const url = new URL(urlString);
    
    // 2. Create a URLSearchParams object from the query part of the URL (e.g., "?ref=admin@gmail.com")
    const params = new URLSearchParams(url.search);
    
    // 3. Get the value associated with the 'ref' parameter
    const email = params.get('ref');
    
    return email;
    
  } catch (e) {
    // Handle cases where the string is not a valid URL
    console.error("Invalid URL string provided:", e.message);
    return null; 
  }
}

