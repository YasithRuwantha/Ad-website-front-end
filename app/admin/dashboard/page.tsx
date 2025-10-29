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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Ads",
      value: pendingAds.length,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Support Tickets",
      value: tickets.filter((t) => t.status === "open").length,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
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
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's an overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
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
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Pending Ads for Review</CardTitle>
            <CardDescription>{pendingAds.length} ads waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAds.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending ads</p>
            ) : (
              <div className="space-y-3">
                {pendingAds.slice(0, 5).map((ad) => (
                  <div key={ad.id} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="font-medium text-foreground line-clamp-1">{ad.title}</p>
                    <p className="text-xs text-muted-foreground">by {ad.userName}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No transactions</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(-5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-primary">${transaction.amount.toFixed(2)}</p>
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
