"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, DollarSign, User, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { useRatings } from "@/lib/rating-context"
import { useUsers } from "@/lib/user-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const { ads, transactions, ratings } = useData()
  const router = useRouter()
  const { getUserEarningsRatings } = useRatings()
  const { getUser } = useUsers()

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
  const balanceColor = displayedBalance < 0 ? "text-red-600" : "text-gray-900"

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
            <p className={`text-xl sm:text-2xl font-bold ${balanceColor}`}>
              ${Math.abs(displayedBalance).toFixed(2)}
              {displayedBalance < 0 && <span className="text-sm ml-1">(Overdue)</span>}
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

      {/* Recent Transactions */}
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
      </Card>
    </div>
  )
}