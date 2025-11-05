"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Crown, Star, TrendingUp, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function VipLevelPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
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
      setIsChecking(false)
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    logout()
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

  const vipLevels = [
    { level: "VIP 0", amount: "$0", products: 30, dividend: "0.5%" },
    { level: "VIP 1", amount: "$100", products: 30, dividend: "1.0%" },
    { level: "VIP 2", amount: "$300", products: 30, dividend: "1.1%" },
    { level: "VIP 3", amount: "$1000", products: 30, dividend: "1.2%" },
    { level: "VIP 4", amount: "$1500", products: 30, dividend: "1.4%" },
    { level: "VIP 5", amount: "$2500", products: 30, dividend: "1.6%" },
    { level: "VIP 6", amount: "$3000", products: 30, dividend: "1.8%" },
    { level: "VIP 7", amount: "$5000", products: 30, dividend: "2.0%" },
    { level: "VIP 8", amount: "$25000", products: 35, dividend: "2.5%" },
  ]

  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Profile */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              VIP Level 👑
            </h1>
            <p className="text-gray-600">Membership Benefits and Rewards</p>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 mb-8 border border-green-100 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  VIP Level List
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Unlock exclusive benefits and higher dividends as you progress through our VIP levels. 
                  Each level offers increased rewards and more products per round.
                </p>
              </div>
            </div>
          </div>

          {/* VIP Levels Table */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-900">VIP Level</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Amount</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Products per round</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-900">Dividend</th>
                  </tr>
                </thead>
                <tbody>
                  {vipLevels.map((vip, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Star className={`w-5 h-5 ${index === 8 ? 'text-yellow-500' : 'text-green-600'}`} />
                          <span className="font-semibold text-gray-900">{vip.level}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-medium">{vip.amount}</td>
                      <td className="py-4 px-4 text-gray-700">{vip.products}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {vip.dividend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-8 border border-blue-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              VIP Benefits
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">💰 Higher Dividends</h4>
                <p className="text-gray-600">
                  Earn more with increasing dividend percentages as you advance through VIP levels.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">📦 More Products</h4>
                <p className="text-gray-600">
                  Access more products per round, maximizing your earning potential.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">⭐ Exclusive Access</h4>
                <p className="text-gray-600">
                  Higher VIP levels unlock premium products and special opportunities.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">🎯 Priority Support</h4>
                <p className="text-gray-600">
                  Get faster response times and dedicated support for higher VIP tiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
