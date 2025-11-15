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
  topup: string
}

interface UserContextType {
  users: User[]
  isLoading: boolean
  fetchUsers: () => Promise<void>
  approveUser: (id: string) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  updateUser: (id: string, data: Partial<User>) => Promise<void>
  addRemainingAds: (id: string, extra: number, luckydrawAttempt?: number) => Promise<void>; 
  addToptup: (id: string, extra: number) => Promise<void>;
  fetchRemainingAttempts: () => Promise<void> // ✅ add this
  getUser: () => Promise<User | null> // ✅ add this
  refreshLocalStorage: (id: string) => Promise<void>

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


    // Add Remaining Ads
  const addToptup = async (id: string, extra: number) => {
    console.log("add remaining ads front end runned", extra);

    try {
      const res = await fetch(`${API_URL}/api/user/add-topup/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ extra }), // ✅ include luckydrawAttempt here
      });

      if (!res.ok) throw new Error("Failed to add topup");

      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? updatedUser : u))
      );
    } catch (err) {
      console.error("❌ Error adding topup:", err);
      throw err;
    }
  };


  // Fetch user's remaining attempts
const fetchRemainingAttempts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/api/user/remaining`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch remaining attempts");
    const data = await res.json();

    // keep localStorage in sync
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.remaining = data.remaining;
      localStorage.setItem("user", JSON.stringify(user));
    }

    // also update user state if available in the current list
    setUsers((prev) =>
      prev.map((u) =>
        u._id === u._id ? { ...u, remaining: data.remaining } : u
      )
    );
  } catch (err) {
    console.error("Error fetching remaining attempts:", err);
  }
};


  // ✅ Fetch Lucky Draw Status
  // const fetchLuckyDrawStatus = async () => {
  //   try {
  //     const token = localStorage.getItem("token")
  //     if (!token) return

  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/luckydraw`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     if (res.ok) {
  //       const data = await res.json()
  //       if (data.luckydrawStatus === "active") {
  //       } else {
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error checking lucky draw:", err)
  //   }
  // }

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("❌ Failed to fetch user:", await res.text());
        return null;
      }

      const data = await res.json();
      console.log("🎯 User data fetched:", data);
      return data; // ✅ return user data instead of setting state
    } catch (err) {
      console.error("⚠️ Error fetching user:", err);
      return null;
    }
  };

  // Refresh local storage user data
  const refreshLocalStorage = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/refreshLocalStorage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("refresh local storage : ", res.json)

      if (!res.ok) {
        console.error("❌ Failed to refresh local storage:", await res.text());
        return;
      }

      const data = await res.json();

      // 🟢 Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.status = data.status;
        user.remaining = data.remaining;
        user.balance = data.balance;
        user.plan = data.plan;
        localStorage.setItem("user", JSON.stringify(user));
      }

      // 🟢 Update React state (if user exists in list)
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
                ...u,
                status: data.status,
                remaining: data.remaining,
                balance: data.balance,
                plan: data.plan,
              }
            : u
        )
      );

      console.log("🔄 Local storage refreshed:", data);
    } catch (err) {
      console.error("⚠️ Error refreshing local storage:", err);
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
        addToptup,
        fetchRemainingAttempts,
        getUser,
        refreshLocalStorage
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

