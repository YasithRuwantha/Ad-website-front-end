"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, DollarSign, User, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { useRatings } from "@/lib/rating-context"
import { useUsers } from "@/lib/user-context"

// For product slideshow demo
import { useProducts } from "@/lib/products-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const { ads, transactions, ratings } = useData()
  const router = useRouter()
  const { getUserEarningsRatings } = useRatings()
  const { getUser } = useUsers()

  // For product slideshow (shuffled)
  const { products } = useProducts ? useProducts() : { products: [] }
  const [slideIndex, setSlideIndex] = useState(0)
  const [shuffledProducts, setShuffledProducts] = useState<any[]>([])

  // Shuffle products when products change
  useEffect(() => {
    if (!products || products.length === 0) return
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    setShuffledProducts(shuffled.slice(0, 5))
    setSlideIndex(0)
  }, [products])

  const slideProducts = shuffledProducts

  useEffect(() => {
    if (!slideProducts.length) return
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideProducts.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [slideProducts.length])

  const userTransactions = transactions.filter((t) => t.userId === user?.id)

  const [totalEarnings, setTotalEarnings] = useState(0)
  const [tempUser, setTempUser] = useState<any>(null)
  const [luckyOrder, setLuckyOrder] = useState<any>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Total earnings
        const earningsData = await getUserEarningsRatings()
        const total = earningsData.reduce((sum, item) => sum + (item.earning || 0), 0)
        setTotalEarnings(total)

        // Current user
        const currentUser = await getUser()
        setTempUser(currentUser)

        // Lucky order
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/luckydraw`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          console.log("luck and topgrade :",data)
          setLuckyOrder(data)
          
        }
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [getUserEarningsRatings, getUser])

  // Calculate displayed balance
const displayedBalance = useMemo(() => {
  if (!tempUser) return 0

  // start with user's balance
  let balance = tempUser.balance || 0

  // only deduct if luckyOrder exists and is active
  if (
      luckyOrder?.luckydrawStatus === "active" &&
      luckyOrder?.luckyProduct?.income != null
    ) {
      balance -= luckyOrder.luckyProduct.income
    }

  // console.log("display balance", balance, luckyOrder?.luckyProduct.income)
  return balance
}, [tempUser, luckyOrder])


  // Determine balance color
  // const balanceColor = tempUser.b < 0 ? "text-red-600" : "text-gray-900"

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-500 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username ?? user?.fullName}!
        </h1>
        <p className="text-gray-700">
          You're on the <span className="font-semibold text-green-700 capitalize">{user?.plan}</span> plan
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Avatar & Buttons */}
          <div className="flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-3">
              <User className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
            </div>
            <div className="text-center space-y-2 w-full max-w-xs">
              <button
                onClick={() => router.push("/dashboard/plans")}
                className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-4 h-4" /> Plan
              </button>
              <button
                onClick={() => router.push("/dashboard/add-funds")}
                className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Wallet className="w-4 h-4" /> Deposit
              </button>
            </div>
          </div>

          {/* Main Balance */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-green-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3">
              <Wallet className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
            </div>
              <p className={tempUser?.balance < 0 ? "text-red-600 text-xl sm:text-2xl font-bold" : "text-green-600 text-xl sm:text-2xl font-bold"}>
               $ {tempUser?.balance}
              </p>
            <p className="text-sm text-gray-600">Main Balance</p>
          </div>

          {/* Today Earnings */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-green-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3">
              <PlusCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Today Earnings</p>
          </div>

          {/* Total Payout */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-green-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3">
              <DollarSign className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${0.0.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Payout</p>
          </div>

          {/* Current Plan */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-green-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <CreditCard className="w-7 sm:w-8 h-7 sm:h-8 text-green-600" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{user?.plan || "Starter"} Clicks</p>
            <p className="text-sm text-green-600 font-medium">Current Plan</p>
          </div>
        </div>

        {/* Lucky Order Deduction Alert (if active & negative impact) */}
        {luckyOrder?.luckydrawStatus === "active" && luckyOrder?.income > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            <strong>Lucky Order Active:</strong> ${luckyOrder.income} deducted from balance for "{luckyOrder.luckyProduct?.name}"
          </div>
        )}
      </div>

      {/* Recent Transactions
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          {userTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {userTransactions.slice(-5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === "payment" ? "text-red-600" : "text-green-600"}`}>
                      {transaction.type === "payment" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card> */}
      {/* Product Slideshow - Professional Large Version */}
      {slideProducts.length > 0 && (
        <div className="relative w-full max-w-5xl mx-auto mb-8">
          <div className="overflow-hidden rounded-2xl border-4 border-green-300 bg-gradient-to-br from-green-50 to-green-100 shadow-xl flex items-center justify-center h-[380px] sm:h-[420px] md:h-[480px] transition-all duration-700">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={slideProducts[slideIndex]?.imageUrl || "/placeholder.svg"}
                alt={slideProducts[slideIndex]?.name || "Product"}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-70 scale-105 blur-[1.5px]"
                style={{ zIndex: 1 }}
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 via-green-700/30 to-transparent z-10" />
              <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-6">
                <img
                  src={slideProducts[slideIndex]?.imageUrl || "/placeholder.svg"}
                  alt={slideProducts[slideIndex]?.name || "Product"}
                  className="mx-auto h-40 w-auto object-contain rounded-xl shadow-lg border-2 border-white bg-white/80 mb-4"
                  style={{ maxWidth: '260px' }}
                />
                <div className="font-bold text-2xl sm:text-3xl text-white drop-shadow mb-2 text-center">
                  {slideProducts[slideIndex]?.name}
                </div>
                <div className="text-green-100 text-base sm:text-lg text-center max-w-2xl mb-2">
                  {slideProducts[slideIndex]?.description?.slice(0, 120) || "No description."}
                </div>
                {slideProducts[slideIndex]?.price && (
                  <div className="text-lg sm:text-xl font-semibold text-yellow-200 bg-green-900/60 rounded px-4 py-1 inline-block mt-2 shadow">
                    ${slideProducts[slideIndex]?.price}
                  </div>
                )}
              </div>
              {/* Slide indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {slideProducts.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full border-2 ${slideIndex === idx ? 'bg-green-500 border-white' : 'bg-white/60 border-green-300'} transition-all`}
                    onClick={() => setSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Slide controls - large and modern */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 border-2 border-green-400 rounded-full p-3 shadow-lg transition-all duration-200 z-40"
            onClick={() => setSlideIndex((slideIndex - 1 + slideProducts.length) % slideProducts.length)}
            aria-label="Previous"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#16a34a" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 border-2 border-green-400 rounded-full p-3 shadow-lg transition-all duration-200 z-40"
            onClick={() => setSlideIndex((slideIndex + 1) % slideProducts.length)}
            aria-label="Next"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#16a34a" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}