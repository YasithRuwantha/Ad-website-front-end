"use client"

import React, { createContext, useContext, useState } from "react"

export interface Rating {
  _id: string
  productId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  productDetails?: {
    _id: string
    name: string
    imageUrl: string
  }
}

interface RatingContextType {
  submitRating: (productId: string, rating: number, comment: string, earning:string) => Promise<{ success: boolean; remaining?: number; message?: string }>
  getUserRatings: () => Promise<Rating[]>
  checkUserRating: (productId: string) => Promise<{ rated: boolean; rating?: Rating }>
  getProductRatings: (productId: string) => Promise<Rating[]>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const RatingContext = createContext<RatingContextType | undefined>(undefined)

export function RatingProvider({ children }: { children: React.ReactNode }) {
  
  // ✅ Submit or Update Rating
  const submitRating = async (productId: string, rating: number, comment: string, earning: string) => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Please login to rate products")
      }

      console.log("Submitting rating:", { productId, rating, comment })

      const earningValue = typeof earning === "string"
        ? Number(earning.replace("$", ""))
        : earning
      
      const res = await fetch(`${API_URL}/api/ratings/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId, 
          rating, 
          comment, 
          earning: earningValue})
      })

      const data = await res.json()
      console.log("Rating response:", data)

      if (!res.ok) {
        // Return error instead of throwing to handle gracefully
        return {
          success: false,
          message: data.message || "Failed to submit rating"
        }
      }

      return { 
        success: true, 
        remaining: data.remaining,
        message: data.message 
      }
    } catch (err: any) {
      console.error("Error submitting rating:", err)
      throw err
    }
  }

  // ✅ Get User's Ratings
  const getUserRatings = async (): Promise<Rating[]> => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        console.log("No token found, returning empty ratings")
        return []
      }

      const res = await fetch(`${API_URL}/api/ratings/user`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) {
        console.error("Failed to fetch user ratings")
        return []
      }

      const data = await res.json()
      console.log("User ratings fetched:", data)
      return data
    } catch (err) {
      console.error("Error fetching user ratings:", err)
      return []
    }
  }

  // ✅ Check if User Rated a Product
  const checkUserRating = async (productId: string) => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        return { rated: false }
      }

      const res = await fetch(`${API_URL}/api/ratings/check/${productId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) {
        return { rated: false }
      }

      return await res.json()
    } catch (err) {
      console.error("Error checking rating:", err)
      return { rated: false }
    }
  }

  // ✅ Get All Ratings for a Product
  const getProductRatings = async (productId: string): Promise<Rating[]> => {
    try {
      const res = await fetch(`${API_URL}/api/ratings/product/${productId}`)

      if (!res.ok) {
        return []
      }

      return await res.json()
    } catch (err) {
      console.error("Error fetching product ratings:", err)
      return []
    }
  }

  return (
    <RatingContext.Provider value={{ 
      submitRating, 
      getUserRatings, 
      checkUserRating, 
      getProductRatings 
    }}>
      {children}
    </RatingContext.Provider>
  )
}

export function useRatings() {
  const context = useContext(RatingContext)
  if (!context) throw new Error("useRatings must be used within RatingProvider")
  return context
}
