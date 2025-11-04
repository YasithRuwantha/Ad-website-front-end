"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Eye, FileCheck, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function PrivacyPage() {
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Privacy and Data Protection 🔒
            </h1>
            <p className="text-gray-600">Your privacy is our top priority</p>
          </div>

          {/* Main Privacy Statement */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 mb-8 border border-green-100 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Our Commitment to Your Privacy
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Shopify is firmly committed to protecting the privacy of your personal information and 
                  the personal information of your customers. We understand that trust is the foundation 
                  of every successful business relationship, and we take that responsibility seriously.
                </p>
              </div>
            </div>
          </div>

          {/* Key Privacy Sections */}
          <div className="grid gap-6 mb-8">
            {/* Member Personal Data */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Member Personal Data Collection
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Shopify's collection, use, disclosure, and processing of Member Personal Data is 
                    subject to these Terms, our <span className="text-green-600 font-semibold">Data Processing Addendum</span>, 
                    and our <span className="text-green-600 font-semibold">Consumer Privacy Policy</span>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✓ Transparent Collection
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      ✓ Secure Processing
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      ✓ Clear Disclosure
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Privacy */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Your Personal Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Shopify's collection, use, disclosure, and processing of your personal information 
                    is governed by our <span className="text-green-600 font-semibold">Merchant Privacy Policy</span>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Principles */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-8 border border-blue-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-600" />
              Our Privacy Principles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">🎯 Transparency First</h4>
                <p className="text-gray-600">
                  We clearly communicate what data we collect, how we use it, and who we share it with.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">🔐 Security Always</h4>
                <p className="text-gray-600">
                  Your data is protected with industry-leading encryption and security measures.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">✋ Control & Choice</h4>
                <p className="text-gray-600">
                  You have full control over your personal data and can access, modify, or delete it anytime.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-lg text-gray-900 mb-2">📋 Compliance</h4>
                <p className="text-gray-600">
                  We comply with global privacy regulations including GDPR, CCPA, and other standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
