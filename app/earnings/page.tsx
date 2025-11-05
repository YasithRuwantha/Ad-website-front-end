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
import { useRatings } from "@/lib/rating-context"


export default function EarningsPage() {
  const { user, updateUser } = useAuth()
  const { transactions, addTransaction } = useData()
  const [showPlansModal, setShowPlansModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [cuurentBalance, setCurrentBalance] = useState("")
  const [userEarnings, setUserEarnings] = useState<{ rating: number; createdAt: string; earning: number }[]>([]);
  const [totEarning, setTotEarning] = useState<number>(0);


  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  const { getCurrentBalance } = useFundPayments()
  const { getUserEarningsRatings } = useRatings() 

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

  useEffect(() => {
    getUserEarningsRatings().then((data) => {
      setUserEarnings(data);
      // ✅ Calculate total earning immediately
      const total = data.reduce((sum, item) => sum + (item.earning || 0), 0);
      setTotEarning(total);
    });
  }, []);



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
                <p className="text-3xl font-bold text-green-600">${(totEarning || 0).toFixed(2)}</p>
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

      {/* Earnings History Table */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Earnings History</CardTitle>
          <CardDescription className="text-sm">Your earnings from product ratings</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {userEarnings.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 text-sm sm:text-base">No earnings yet. Start rating products to earn!</p>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block sm:hidden space-y-3 p-4">
                {userEarnings.map((item, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-gray-700">#{index + 1}</span>
                      <span className="font-bold text-green-600">${(item.earning || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < (item.rating || 0) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({item.rating || 0}/5)</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Earnings:</span>
                    <span className="font-bold text-xl text-green-600">${(totEarning || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEarnings.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < (item.rating || 0) ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">({item.rating || 0}/5)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-green-600">${(item.earning || 0).toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-50 border-t-2 border-green-200">
                      <td colSpan={3} className="py-3 px-4 text-right font-semibold text-gray-900">
                        Total Earnings:
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-xl text-green-600">${(totEarning || 0).toFixed(2)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
      {/* <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} onSubmit={handleAddFunds} /> */}
      </div>
      </div>
    </div>
  )
}
