"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { TicketDTO } from "./support"
import * as SupportAPI from "./support"

export interface Product {
  imageUrl: string
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
  rating?: number
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
  username?: string
  useremail?: string
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
  addTicket: (ticket: SupportTicket) => Promise<void>
  replyToTicket: (ticketId: string, message: string, isAdmin: boolean) => Promise<void>
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

const MOCK_ADS: Ad[] = [
  {
    id: "ad-1",
    title: "Premium Laptop Sale - 30% Off",
    description: "High-performance laptop with latest Intel processor, 16GB RAM, 512GB SSD. Perfect for professionals and students.",
    image: "/modern-laptop-workspace.png",
    userId: "seller-1",
    userName: "TechStore",
    status: "approved",
    createdAt: new Date(2024, 9, 15).toISOString(),
    views: 1245,
  },
  {
    id: "ad-2",
    title: "Wireless Noise-Cancelling Headphones",
    description: "Experience crystal clear sound with active noise cancellation. 30-hour battery life and superior comfort.",
    image: "/diverse-people-listening-headphones.png",
    userId: "seller-2",
    userName: "AudioPro",
    status: "approved",
    createdAt: new Date(2024, 9, 16).toISOString(),
    views: 892,
  },
  {
    id: "ad-3",
    title: "Smart Fitness Watch",
    description: "Track your fitness goals with advanced heart rate monitoring, GPS, and water-resistant design up to 50m.",
    image: "/modern-smartwatch.png",
    userId: "seller-3",
    userName: "WearTech",
    status: "approved",
    createdAt: new Date(2024, 9, 17).toISOString(),
    views: 673,
  },
  {
    id: "ad-4",
    title: "Fast Charging USB-C Cable Bundle",
    description: "Durable cables with lifetime warranty. Compatible with all USB-C devices. Pack of 3 cables (3ft, 6ft, 10ft).",
    image: "/usb-cable.jpg",
    userId: "seller-4",
    userName: "CablePro",
    status: "approved",
    createdAt: new Date(2024, 9, 18).toISOString(),
    views: 1534,
  },
  {
    id: "ad-5",
    title: "Mechanical Gaming Keyboard RGB",
    description: "Professional-grade mechanical keyboard with customizable RGB lighting and Cherry MX switches.",
    image: "/placeholder.svg",
    userId: "seller-5",
    userName: "GameGear",
    status: "approved",
    createdAt: new Date(2024, 9, 19).toISOString(),
    views: 945,
  },
  {
    id: "ad-6",
    title: "4K Ultra HD Webcam",
    description: "Crystal clear 4K video for streaming and conferencing. Auto-focus, built-in dual microphones.",
    image: "/placeholder.svg",
    userId: "seller-6",
    userName: "StreamPro",
    status: "approved",
    createdAt: new Date(2024, 9, 20).toISOString(),
    views: 567,
  },
  {
    id: "ad-7",
    title: "Portable SSD 1TB",
    description: "Lightning-fast external storage with USB 3.2 Gen 2. Compact, rugged design. Read speeds up to 1050MB/s.",
    image: "/placeholder.svg",
    userId: "seller-7",
    userName: "DataVault",
    status: "approved",
    createdAt: new Date(2024, 9, 21).toISOString(),
    views: 723,
  },
  {
    id: "ad-8",
    title: "7-in-1 USB-C Hub",
    description: "Expand your connectivity with HDMI, USB 3.0, SD/TF card readers, and 100W power delivery.",
    image: "/placeholder.svg",
    userId: "seller-8",
    userName: "ConnectHub",
    status: "approved",
    createdAt: new Date(2024, 9, 22).toISOString(),
    views: 834,
  },
  {
    id: "ad-9",
    title: "Ergonomic Office Chair",
    description: "Premium mesh office chair with lumbar support, adjustable armrests, and 360° swivel.",
    image: "/placeholder.svg",
    userId: "seller-9",
    userName: "OfficeComfort",
    status: "approved",
    createdAt: new Date(2024, 9, 23).toISOString(),
    views: 1123,
  },
  {
    id: "ad-10",
    title: "Wireless Gaming Mouse",
    description: "Precision gaming mouse with 16000 DPI, programmable buttons, and RGB lighting. 70-hour battery life.",
    image: "/placeholder.svg",
    userId: "seller-10",
    userName: "ClickMaster",
    status: "approved",
    createdAt: new Date(2024, 9, 24).toISOString(),
    views: 645,
  },
  {
    id: "ad-11",
    title: "LED Monitor 27\" 4K",
    description: "Stunning 4K UHD display with HDR10, 99% sRGB color gamut. Perfect for content creators and gamers.",
    image: "/placeholder.svg",
    userId: "seller-11",
    userName: "DisplayMax",
    status: "approved",
    createdAt: new Date(2024, 9, 25).toISOString(),
    views: 1876,
  },
  {
    id: "ad-12",
    title: "Bluetooth Speaker Waterproof",
    description: "Portable speaker with 360° sound, 24-hour playtime, and IP67 waterproof rating.",
    image: "/placeholder.svg",
    userId: "seller-12",
    userName: "SoundWave",
    status: "approved",
    createdAt: new Date(2024, 9, 26).toISOString(),
    views: 456,
  },
  {
    id: "ad-13",
    title: "Standing Desk Converter",
    description: "Adjustable standing desk with gas spring lift. Fits dual monitors. Transform any desk instantly.",
    image: "/placeholder.svg",
    userId: "seller-13",
    userName: "DeskRise",
    status: "approved",
    createdAt: new Date(2024, 9, 27).toISOString(),
    views: 789,
  },
  {
    id: "ad-14",
    title: "Wireless Charging Pad 3-in-1",
    description: "Charge your phone, watch, and earbuds simultaneously. Fast 15W charging for compatible devices.",
    image: "/placeholder.svg",
    userId: "seller-14",
    userName: "ChargeFast",
    status: "approved",
    createdAt: new Date(2024, 9, 28).toISOString(),
    views: 923,
  },
  {
    id: "ad-15",
    title: "Professional Microphone USB",
    description: "Studio-quality USB condenser microphone with pop filter. Perfect for podcasting and streaming.",
    image: "/placeholder.svg",
    userId: "seller-15",
    userName: "VoiceStudio",
    status: "approved",
    createdAt: new Date(2024, 9, 29).toISOString(),
    views: 534,
  },
  {
    id: "ad-16",
    title: "Laptop Cooling Pad RGB",
    description: "5-fan cooling system with adjustable height. Reduces laptop temperature by up to 30°C.",
    image: "/placeholder.svg",
    userId: "seller-16",
    userName: "CoolTech",
    status: "approved",
    createdAt: new Date(2024, 10, 1).toISOString(),
    views: 678,
  },
  {
    id: "ad-17",
    title: "Graphics Tablet for Digital Art",
    description: "Professional drawing tablet with 8192 pressure levels and battery-free stylus. 10x6 inch active area.",
    image: "/placeholder.svg",
    userId: "seller-17",
    userName: "ArtSpace",
    status: "approved",
    createdAt: new Date(2024, 10, 2).toISOString(),
    views: 445,
  },
  {
    id: "ad-18",
    title: "Smart Home Security Camera",
    description: "1080p HD camera with night vision, motion detection, and two-way audio. Cloud storage included.",
    image: "/placeholder.svg",
    userId: "seller-18",
    userName: "SecureHome",
    status: "approved",
    createdAt: new Date(2024, 10, 3).toISOString(),
    views: 1234,
  },
  {
    id: "ad-19",
    title: "Mechanical Numpad Wireless",
    description: "Compact wireless numpad with mechanical switches. Perfect for accountants and data entry.",
    image: "/placeholder.svg",
    userId: "seller-19",
    userName: "KeyPro",
    status: "approved",
    createdAt: new Date(2024, 10, 4).toISOString(),
    views: 312,
  },
  {
    id: "ad-20",
    title: "Phone Tripod with Remote",
    description: "Extendable tripod up to 50 inches with Bluetooth remote. 360° rotation and phone holder.",
    image: "/placeholder.svg",
    userId: "seller-20",
    userName: "PhotoGear",
    status: "approved",
    createdAt: new Date(2024, 10, 5).toISOString(),
    views: 567,
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("app-data")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Only override ads if localStorage has ads, otherwise keep MOCK_ADS
        if (data.ads && data.ads.length > 0) {
          setAds(data.ads)
        }
        if (data.ratings) setRatings(data.ratings)
        if (data.transactions) setTransactions(data.transactions)
        if (data.tickets) setTickets(data.tickets)
      } catch (e) {
        console.error("Error loading from localStorage", e)
      }
    } else {
      // If no localStorage data exists, save the mock ads to localStorage
      saveData(MOCK_ADS, [], [], [])
    }
  }, [])

  // Map backend TicketDTO -> frontend SupportTicket type
  const mapTicket = (t: TicketDTO): SupportTicket => ({
    id: t.id,
    userId: t.userId,
    username: t.username || "",
    useremail: t.useremail || "",
    subject: t.subject,
    message: t.message,
    status: t.status,
    createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date(t.createdAt).toISOString(),
    replies: (t.replies || []).map((r) => ({
      id: r.id,
      message: r.message,
      createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date(r.createdAt).toISOString(),
      isAdmin: !!r.isAdmin,
    })),
  })

  // Load tickets from backend whenever user changes (after auth ready)
  useEffect(() => {
    let cancelled = false
    async function loadTickets() {
      try {
        // Admins get all tickets; users get only their own
        const list = await SupportAPI.getTickets(
          user && user.role !== "admin" ? { userId: user.id } : undefined,
        )
        if (!cancelled) {
          const mapped = list.map(mapTicket)
          setTickets(mapped)
          // keep other local data as-is; save tickets snapshot
          saveData(ads, ratings, transactions, mapped)
        }
      } catch (err) {
        console.error("Failed to load tickets", err)
      }
    }
    if (user) loadTickets()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

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

  const addTicket = async (ticket: SupportTicket) => {
    // Persist to backend, then update local state with server's copy
    try {
      const created = await SupportAPI.createTicket({
        userId: ticket.userId,
        username: user?.fullName || "",
        useremail: user?.email || "",
        subject: ticket.subject,
        message: ticket.message,
      })
      const createdMapped = mapTicket(created)
      const newTickets = [createdMapped, ...tickets]
      setTickets(newTickets)
      saveData(ads, ratings, transactions, newTickets)
    } catch (err) {
      console.error("Failed to create ticket", err)
      // Fallback: optimistic local add
      const newTickets = [
        {
          ...ticket,
          username: user?.fullName || ticket.username || "",
          useremail: user?.email || ticket.useremail || "",
        },
        ...tickets,
      ]
      setTickets(newTickets)
      saveData(ads, ratings, transactions, newTickets)
    }
  }

  const replyToTicket = async (ticketId: string, message: string, isAdmin: boolean) => {
    try {
      const updated = await SupportAPI.addReply(ticketId, { message, isAdmin })
      const mapped = mapTicket(updated)
      const newTickets = tickets.map((t) => (t.id === ticketId ? mapped : t))
      setTickets(newTickets)
      saveData(ads, ratings, transactions, newTickets)
    } catch (err) {
      console.error("Failed to add reply", err)
      // Fallback: optimistic local update
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
