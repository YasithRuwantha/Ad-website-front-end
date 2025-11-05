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
import { useFundPayments } from "@/lib/fundPayment-context" 


export default function EarningsPage() {
  const { user, updateUser } = useAuth()
  const { transactions, addTransaction } = useData()
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [cuurentBalance, setCurrentBalance] = useState("")

  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  const { getCurrentBalance } = useFundPayments()

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/");
        return;
      }

      const user = JSON.parse(storedUser);

      if (user.role !== "user") {
        router.push("/");
        return;
      }

      setUserName(user.fullName || "User");
      setUserEmail(user.email || "");

      // Fetch current balance from backend on refresh
      if (user.id) {
        const latestBalance = await getCurrentBalance(user.id);
        // console.log(latestBalance)
        setCurrentBalance(latestBalance);

        if (latestBalance !== null) {
          updateUser({ balance: latestBalance }); // updates context & local storage
        }
      }

      setIsChecking(false);
    } catch (err) {
      console.error("Error reading user data:", err);
      router.push("/");
    }
  };

  fetchUserData();
}, [router]);



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

  // const handleAddFunds = (amount: number, walletAddress: string, proofImage: string) => {
  //   if (user) {
  //     const newBalance = balance + amount
  //     updateUser({ balance: newBalance })

  //     addTransaction({
  //       id: Math.random().toString(36).substr(2, 9),
  //       userId: user.id,
  //       type: "payment",
  //       amount: -amount,
  //       description: `Added ${amount} USDT from wallet ${walletAddress.slice(0, 10)}...`,
  //       status: "completed",
  //       createdAt: new Date().toISOString(),
  //     })

  //     setShowPaymentModal(false)
  //   }
  // }

  // const plans = [
  //   {
  //     name: "Starter",
  //     price: 0,
  //     features: ["Post 5 ads/month", "View products", "Basic support"],
  //   },
  //   {
  //     name: "Normal",
  //     price: 50,
  //     features: ["Post 20 ads/month", "Advanced analytics", "Priority support", "Higher earnings rate"],
  //   },
  //   {
  //     name: "Premium",
  //     price: 150,
  //     features: ["Unlimited ads", "Full analytics", "24/7 support", "Premium badge", "2x earnings"],
  //   },
  // ]

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
        <header className="hidden md:flex bg-white border-b border-gray-200 px-4 md:px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
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
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
          <p className="text-gray-600">Manage your balance, plans, and transactions</p>
        </div>
        <div className="flex gap-2">
          {/* <Button
            onClick={() => setShowPlansModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            View Plans
          </Button> */}
          {/* <Button
            onClick={() => setShowPaymentModal(true)}
            variant="outline"
            className="border-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            Add Funds
          </Button> */}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-green-700">${cuurentBalance}</p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">${earnings.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-green-600 capitalize">{plan}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
      {/* <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} onSubmit={handleAddFunds} /> */}
      </div>
      </div>
    </div>
  )
}
