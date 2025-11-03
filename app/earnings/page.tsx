"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import PlansModal from "@/components/earnings/plans-modal"
import PaymentModal from "@/components/earnings/payment-modal"
import { TrendingUp, Wallet, CreditCard, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useRouter } from "next/navigation"


export default function EarningsPage() {
  const { user, updateUser } = useAuth()
  const { transactions, addTransaction } = useData()
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        router.push("/")
        return
      }

      const user = JSON.parse(storedUser)

      if (user.role !== "user") {
        router.push("/")
        return
      }

      setUserName(user.name || "User")
      setUserEmail(user.email || "")
      setIsChecking(false) // ✅ passed all checks
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])


  // Safe dummy fallbacks
  const balance = user?.balance ?? 10
  const plan = user?.plan ?? "starter"

  const userTransactions = transactions?.filter((t) => t.userId === user?.id) ?? []
  const earnings = userTransactions
    .filter((t) => t.type === "referral" || t.type === "ad_revenue")
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const handleUpgradePlan = (selectedPlan: "starter" | "normal" | "premium", price: number) => {
    if (user && balance >= price) {
      const newBalance = balance - price
      updateUser({ plan: selectedPlan, balance: newBalance })

      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: "payment",
        amount: price,
        description: `Upgraded to ${selectedPlan} plan`,
        status: "completed",
        createdAt: new Date().toISOString(),
      })

      setShowPlansModal(false)
    }
  }

  const handleAddFunds = (amount: number, walletAddress: string, proofImage: string) => {
    if (user) {
      const newBalance = balance + amount
      updateUser({ balance: newBalance })

      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: "payment",
        amount: -amount,
        description: `Added ${amount} USDT from wallet ${walletAddress.slice(0, 10)}...`,
        status: "completed",
        createdAt: new Date().toISOString(),
      })

      setShowPaymentModal(false)
    }
  }

  const plans = [
    {
      name: "Starter",
      price: 0,
      features: ["Post 5 ads/month", "View products", "Basic support"],
    },
    {
      name: "Normal",
      price: 50,
      features: ["Post 20 ads/month", "Advanced analytics", "Priority support", "Higher earnings rate"],
    },
    {
      name: "Premium",
      price: 150,
      features: ["Unlimited ads", "Full analytics", "24/7 support", "Premium badge", "2x earnings"],
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Profile */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-gray-900 hidden md:block">EarningHub</span>
          </div>

          {/* Profile Section */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings & Payments</h1>
          <p className="text-muted-foreground">Manage your balance, plans, and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPlansModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            View Plans
          </Button>
          <Button
            onClick={() => setShowPaymentModal(true)}
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Add Funds
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-primary">${balance.toFixed(2)}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">${earnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-primary capitalize">{plan}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-primary/10 border border-primary/20">
          <TabsTrigger
            value="plans"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Plans
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Transaction History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {userTransactions.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No transactions yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Your payment and earning history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTransactions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-lg ${
                              transaction.type === "payment" ? "text-destructive" : "text-green-600"
                            }`}
                          >
                            {transaction.type === "payment" ? "-" : "+"}${(transaction.amount ?? 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{transaction.status ?? "pending"}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => (
              <Card
                key={p.name}
                className={`border-2 transition-all ${
                  plan === p.name.toLowerCase()
                    ? "border-primary bg-primary/5"
                    : "border-primary/20 hover:border-primary/40"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-primary">{p.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">${p.price}</span>
                    <span className="text-muted-foreground"> USDT</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {p.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleUpgradePlan(p.name.toLowerCase() as any, p.price)}
                    disabled={plan === p.name.toLowerCase() || balance < p.price}
                    className={`w-full ${
                      plan === p.name.toLowerCase()
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {plan === p.name.toLowerCase()
                      ? "Current Plan"
                      : balance < p.price
                      ? "Insufficient Balance"
                      : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
      <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} onSubmit={handleAddFunds} />
      </div>
      </div>
    </div>
  )
}
