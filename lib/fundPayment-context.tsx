"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface FundPayment {
  _id: string
  userID: string
  amount: number
  requestedDate: string
  approvedDate?: string
  method: "USDT-TRC20" | "Bank" | "Card" | "Other"
  imgUrl: string
  status: "pending" | "approved" | "rejected"
  createdAt?: string
  updatedAt?: string
}

interface FundPaymentContextType {
  fundPayments: FundPayment[]
  loading: boolean
  error: string | null
  fetchFundPayments: () => Promise<void>
  addFundPayment: (payment: Partial<FundPayment>) => Promise<FundPayment>
  updateFundPaymentStatus: (id: string, status: "approved" | "rejected") => Promise<void>
  deleteFundPayment: (id: string) => Promise<void>
}

const FundPaymentContext = createContext<FundPaymentContextType | undefined>(undefined)

export function FundPaymentProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = useAuth()
  const [fundPayments, setFundPayments] = useState<FundPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // 🟢 Fetch all fund payments (Admin view)
  const fetchFundPayments = async () => {
    if (!currentUser) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/fundPayments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch fund payments")
      setFundPayments(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🟡 Add new payment (Customer)
  const addFundPayment = async (payment: Partial<FundPayment>): Promise<FundPayment> => {
  console.log("🟡 addFundPayment payload before sending:", payment.imgUrl); // ✅ log here
  setLoading(true);
  try {
    const token = localStorage.getItem("token");

    // If you're sending an image file, you need FormData instead of JSON
    const res = await fetch(`${API_URL}/api/fund-payments/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // only for JSON payload
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payment), // logs above show exactly what is sent
    });

    

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add fund payment");

    setFundPayments((prev) => [...prev, data]);
    return data;
  } catch (err: any) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  // 🟣 Approve / Reject (Admin)
  const updateFundPaymentStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/fundPayments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update fund payment")

      setFundPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: data.status } : p))
      )
    } catch (err: any) {
      setError(err.message)
    }
  }

  // 🔴 Delete fund payment (Admin or User)
  const deleteFundPayment = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/fundPayments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete fund payment")

      setFundPayments((prev) => prev.filter((p) => p._id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchFundPayments()
    }
  }, [currentUser])

  return (
    <FundPaymentContext.Provider
      value={{
        fundPayments,
        loading,
        error,
        fetchFundPayments,
        addFundPayment,
        updateFundPaymentStatus,
        deleteFundPayment,
      }}
    >
      {children}
    </FundPaymentContext.Provider>
  )
}

export function useFundPayments() {
  const context = useContext(FundPaymentContext)
  if (!context) throw new Error("useFundPayments must be used within FundPaymentProvider")
  return context
}
