"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageSquare, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { ads, transactions, tickets } = useData()

  const pendingAds = ads.filter((a) => a.status === "pending")
  const approvedAds = ads.filter((a) => a.status === "approved")
  const totalUsers = 1
  const totalRevenue = transactions.filter((t) => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Ads",
      value: pendingAds.length,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Support Tickets",
      value: tickets.filter((t) => t.status === "open").length,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-500 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-700">Here's an overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-2 border-green-200 hover:shadow-lg transition-shadow hover:border-green-500">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Ads */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Pending Ads for Review</CardTitle>
            <CardDescription>{pendingAds.length} ads waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAds.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending ads</p>
            ) : (
              <div className="space-y-3">
                {pendingAds.slice(0, 5).map((ad) => (
                  <div key={ad.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-medium text-gray-900 line-clamp-1">{ad.title}</p>
                    <p className="text-xs text-gray-600">by {ad.userName}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(-5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{transaction.description}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
