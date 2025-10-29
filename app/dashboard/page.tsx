"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, FileText, ShoppingBag, Wallet, CreditCard, DollarSign, User } from "lucide-react"
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
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
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Transactions",
      value: userTransactions.length,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.fullName}!</h1>
        <p className="text-muted-foreground">
          You're on the <span className="font-semibold text-primary capitalize">{user?.plan}</span> plan
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/profile")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>View your details</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">View Profile</Button>
          </CardContent>
        </Card>

        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/plans")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Plans
            </CardTitle>
            <CardDescription>Upgrade your plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">View Plans</Button>
          </CardContent>
        </Card>

        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/payout")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Payout
            </CardTitle>
            <CardDescription>Manage payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">Request Payout</Button>
          </CardContent>
        </Card>

        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/dashboard/payout-history")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              History
            </CardTitle>
            <CardDescription>View payout history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">View History</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/ads")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Post New Ad
            </CardTitle>
            <CardDescription>Share your products or services</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">Post Ad</Button>
          </CardContent>
        </Card>

        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/products")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Browse Products
            </CardTitle>
            <CardDescription>Discover and rate products</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">View Products</Button>
          </CardContent>
        </Card>

        <Card
          className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/earnings")}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              View Earnings
            </CardTitle>
            <CardDescription>Check your balance & history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary hover:bg-primary/90">View Earnings</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          {userTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {userTransactions.slice(-5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${transaction.type === "payment" ? "text-destructive" : "text-green-600"}`}
                    >
                      {transaction.type === "payment" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
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
