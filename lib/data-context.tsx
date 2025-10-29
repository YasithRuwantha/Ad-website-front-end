"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  rating: number
  reviews: number
  seller: string
}

export interface Ad {
  id: string
  title: string
  description: string
  image: string
  userId: string
  userName: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  views: number
}

export interface Rating {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  type: "payment" | "referral" | "ad_revenue"
  amount: number
  description: string
  status: "completed" | "pending"
  createdAt: string
}

export interface SupportTicket {
  id: string
  userId: string
  subject: string
  message: string
  status: "open" | "in-progress" | "resolved"
  createdAt: string
  replies: Array<{ id: string; message: string; createdAt: string; isAdmin: boolean }>
}

interface DataContextType {
  products: Product[]
  ads: Ad[]
  ratings: Rating[]
  transactions: Transaction[]
  tickets: SupportTicket[]
  addProduct: (product: Product) => void
  addAd: (ad: Ad) => void
  updateAd: (id: string, updates: Partial<Ad>) => void
  addRating: (rating: Rating) => void
  addTransaction: (transaction: Transaction) => void
  addTicket: (ticket: SupportTicket) => void
  replyToTicket: (ticketId: string, message: string, isAdmin: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Laptop",
    description: "High-performance laptop for professionals",
    price: 1200,
    image: "/modern-laptop-workspace.png",
    rating: 4.5,
    reviews: 128,
    seller: "TechStore",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones",
    price: 299,
    image: "/diverse-people-listening-headphones.png",
    rating: 4.8,
    reviews: 256,
    seller: "AudioPro",
  },
  {
    id: "3",
    name: "Smart Watch",
    description: "Advanced fitness tracking smartwatch",
    price: 399,
    image: "/modern-smartwatch.png",
    rating: 4.3,
    reviews: 89,
    seller: "WearTech",
  },
  {
    id: "4",
    name: "USB-C Cable",
    description: "Durable fast-charging USB-C cable",
    price: 29,
    image: "/usb-cable.jpg",
    rating: 4.6,
    reviews: 512,
    seller: "CablePro",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [ads, setAds] = useState<Ad[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("app-data")
    if (stored) {
      const data = JSON.parse(stored)
      setAds(data.ads || [])
      setRatings(data.ratings || [])
      setTransactions(data.transactions || [])
      setTickets(data.tickets || [])
    }
  }, [])

  const saveData = (
    newAds: Ad[],
    newRatings: Rating[],
    newTransactions: Transaction[],
    newTickets: SupportTicket[],
  ) => {
    localStorage.setItem(
      "app-data",
      JSON.stringify({ ads: newAds, ratings: newRatings, transactions: newTransactions, tickets: newTickets }),
    )
  }

  const addProduct = (product: Product) => {
    setProducts([...products, product])
  }

  const addAd = (ad: Ad) => {
    const newAds = [...ads, ad]
    setAds(newAds)
    saveData(newAds, ratings, transactions, tickets)
  }

  const updateAd = (id: string, updates: Partial<Ad>) => {
    const newAds = ads.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad))
    setAds(newAds)
    saveData(newAds, ratings, transactions, tickets)
  }

  const addRating = (rating: Rating) => {
    const newRatings = [...ratings, rating]
    setRatings(newRatings)
    saveData(ads, newRatings, transactions, tickets)
  }

  const addTransaction = (transaction: Transaction) => {
    const newTransactions = [...transactions, transaction]
    setTransactions(newTransactions)
    saveData(ads, ratings, newTransactions, tickets)
  }

  const addTicket = (ticket: SupportTicket) => {
    const newTickets = [...tickets, ticket]
    setTickets(newTickets)
    saveData(ads, ratings, transactions, newTickets)
  }

  const replyToTicket = (ticketId: string, message: string, isAdmin: boolean) => {
    const newTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            replies: [
              ...ticket.replies,
              {
                id: Math.random().toString(36).substr(2, 9),
                message,
                createdAt: new Date().toISOString(),
                isAdmin,
              },
            ],
          }
        : ticket,
    )
    setTickets(newTickets)
    saveData(ads, ratings, transactions, newTickets)
  }

  return (
    <DataContext.Provider
      value={{
        products,
        ads,
        ratings,
        transactions,
        tickets,
        addProduct,
        addAd,
        updateAd,
        addRating,
        addTransaction,
        addTicket,
        replyToTicket,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
