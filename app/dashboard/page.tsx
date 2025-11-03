"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, FileText, ShoppingBag, Wallet, CreditCard, DollarSign, User, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const { ads, transactions, ratings } = useData()
  const router = useRouter()

  const userAds = ads.filter((ad) => ad.userId === user?.id)
  const userTransactions = transactions.filter((t) => t.userId === user?.id)
  const userRatings = ratings.filter((r) => r.userId === user?.id)

  const stats = [
    {
      label: "Total Ads",
      value: userAds.length,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Approved Ads",
      value: userAds.filter((a) => a.status === "approved").length,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Ratings",
      value: userRatings.length,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Transactions",
      value: userTransactions.length,
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-500 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-700">
          You're on the <span className="font-semibold text-green-700 capitalize">{user?.plan}</span> plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/dashboard/plans")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Plans
            </CardTitle>
            <CardDescription>Upgrade your plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Plans</Button>
          </CardContent>
        </Card>

        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/dashboard/payout")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Payout
            </CardTitle>
            <CardDescription>Manage payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Request Payout</Button>
          </CardContent>
        </Card>

        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/dashboard/payout-history")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              History
            </CardTitle>
            <CardDescription>View payout history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View History</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/dashboard/add-funds")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-green-600" />
              Add Funds
            </CardTitle>
            <CardDescription>Deposit money to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Add Funds</Button>
          </CardContent>
        </Card>

        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/products")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Browse Products
            </CardTitle>
            <CardDescription>Discover and rate products</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Products</Button>
          </CardContent>
        </Card>

        <Card
          className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => router.push("/earnings")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              View Earnings
            </CardTitle>
            <CardDescription>Check your balance & history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Earnings</Button>
          </CardContent>
        </Card>
      </div>

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
                    <p className="text-xs text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${transaction.type === "payment" ? "text-red-600" : "text-green-600"}`}
                    >
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
