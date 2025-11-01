"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface User {
  _id: string
  fullName: string
  email: string
  role: string
  balance: number
  plan: string
  totalPayouts: number
  phone: string
  remaining?: number
  status?: string // pending, approved, rejected
  luckydrawStatus?: string
}

interface UserContextType {
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
  approveUser: (id: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  updateUser: (id: string, data: Partial<User>) => Promise<void>
  addRemainingAds: (id: string, extra: number, luckydrawAttempt?: number) => Promise<void>; 

}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Fetch all users
  const fetchUsers = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/all`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
      console.log("All users fetched:", data); // ✅ log here
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  // Approve user
  const approveUser = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${id}/approve`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
      })
      if (!res.ok) throw new Error("Failed to approve user")
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: "approved" } : u))
      )
    } catch (err) {
      console.error(err)
    }
  }

  // Delete user
  const deleteUser = async (id: string) => {
    console.log("user delete runned")
    try {
      const res = await fetch(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
      })
      if (!res.ok) throw new Error("Failed to delete user")
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // Update user
  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      const res = await fetch(`${API_URL}/api/user/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update user")
      const updatedUser = await res.json()
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? updatedUser : u))
      )
    } catch (err) {
      console.error(err)
    }
  }

  // Add Remaining Ads
  const addRemainingAds = async (id: string, extra: number, luckydrawAttempt?: number) => {
    console.log("add remaining ads front end runned");

    try {
      const res = await fetch(`${API_URL}/api/user/add-remaining/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ extra, luckydrawAttempt }), // ✅ include luckydrawAttempt here
      });

      if (!res.ok) throw new Error("Failed to add ads");

      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? updatedUser : u))
      );
    } catch (err) {
      console.error("❌ Error adding remaining ads:", err);
      throw err;
    }
  };



  return (
    <UserContext.Provider 
      value={{ 
        users, 
        isLoading, 
        fetchUsers, 
        approveUser,
        deleteUser, 
        updateUser,
        addRemainingAds,
    }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook to use users context
export function useUsers() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUsers must be used within UserProvider")
  return context
}

