"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function LuckyProductsPage() {
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

  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              About Lucky Products
            </h1>
            <p className="text-gray-600">Lucky products and evaluation information</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lucky Product
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Luxury items and products aren't just about style, they represent the highest level of design, high-end and uniqueness that can offer by a company. Even though most people can't afford them, Shopify is a E-store for many luxury products like the Gucci, Louis Vuitton, Glossiar, Rolex & Tiffany etc. to showcase advanced model, comfort, and brand prestige. Along with these luxury items, each piece a testament to long-lasting elegance, and masterful craftsmanship. These are made from top-quality and rare materials to ensure lifestyle essentials and elegance. While expensive, they help maintain the luxury feel of the way of lifestyle and allow new luxury brands to eventually reach more affordable items.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What is a Lucky Order Evaluation?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Lucky products are high-value items with limited availability, and each member has a chance to receive 0 to 2 of them in a single round. These are randomly generated by the system and offer 6 times the regular commission, along with lucky order bonuses.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              The evaluation of Lucky products are based on the member's current account balance, which means the required evaluation may vary. Due to the high rewards, the chances of receiving a Lucky order are low.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If selected, you must contact on duty customer service to proceed and claim your rewards.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What is a Top-grade Order Evaluation?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Top-grade products are exclusive benefits offered by the platform to reward and motivate high-level members. These products are extremely rare, with a very low chance of being assigned.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              To promote them, eligible members receive 8 times the regular commission, along with the highest bonus percentage available for products.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Only members who have reached premium level are eligible to claim these high-value products and enjoy their associated rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
