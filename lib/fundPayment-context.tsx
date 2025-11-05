"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface FundPayment {
  _id: string
  userID: string
  amount: string
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
  addFundPayment: (payment: {
    userID: string
    amount: number
    method: "USDT-TRC20" | "Bank" | "Card" | "Other"
    imgFile?: File
    requestedDate?: string
    branchName: string
    note: string
    name: string
  }) => Promise<FundPayment>
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
      const res = await fetch(`${API_URL}/api/fund-payments`, {
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

    // fundPayment-context.tsx
    const fetchUserFundPayments = async (userID: string) => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/fund-payments/user/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user's fund payments");
        return data as FundPayment[];
    } catch (err: any) {
        setError(err.message);
        return [];
    } finally {
        setLoading(false);
    }
    };


  // 🟡 Add new payment (Customer)
const addFundPayment = async (payment: {
  userID: string
  amount: number
  name: string
  note: string
  method: "USDT-TRC20" | "Bank" | "Card" | "Other"
  imgFile?: File
  requestedDate?: string
  branchName: string
}) => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    console.log("test", payment.userID, payment.amount, payment.method)
    formData.append("userID", payment.userID);
    formData.append("amount", payment.amount.toString());
    formData.append("note", payment.note)
    formData.append("method", payment.method);
    formData.append("branchName", payment.branchName)
    if (payment.requestedDate) formData.append("requestedDate", payment.requestedDate);
    if (payment.imgFile) formData.append("imgUrl", payment.imgFile);

    const res = await fetch(`${API_URL}/api/fund-payments/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // do NOT set Content-Type for FormData
      },
      body: formData,
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
      const res = await fetch(`${API_URL}/api/fund-payments/update/${id}`, {
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
      const res = await fetch(`${API_URL}/api/fund-payments/${id}`, {
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

    const getCurrentBalance = async (id: string) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${API_URL}/api/user/get-current-balance/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, // fixed typo: 'Authorizatio' → 'Authorization'
            "Content-Type": "application/json",
        },
        });

        if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch balance");
        }

        const data = await res.json();
        const balance = data.balance;

        // Update local storage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.balance = balance;
        localStorage.setItem("user", JSON.stringify(user));

        return balance; // also return for immediate use
    } catch (err: any) {
        console.error(err);
        return null;
    }
};


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
        fetchUserFundPayments,
        getCurrentBalance
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
