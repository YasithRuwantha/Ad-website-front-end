"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function TermsConditionsPage() {
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
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
                  <p className="text-sm text-gray-600">Last updated: November 2025</p>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using Promo Shopify, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">2. Use License</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Permission is granted to temporarily use Promo Shopify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">3. User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">4. Payment and Earnings</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    By participating in our program, you agree to the following:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Earnings are based on completed tasks and promotions</li>
                    <li>We share 70% of profits with users, while the platform retains 30%</li>
                    <li>Minimum withdrawal amount is $10</li>
                    <li>Payouts are processed within 3-5 business days</li>
                    <li>All transactions must comply with applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">5. Prohibited Activities</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Users are prohibited from:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Creating fake accounts or using automated systems</li>
                    <li>Engaging in fraudulent activities or money laundering</li>
                    <li>Harassing or abusing other users or staff</li>
                    <li>Attempting to hack or compromise the platform's security</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">6. Disclaimer</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The materials on Promo Shopify are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">7. Limitations</h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall Promo Shopify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">8. Revisions and Errata</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The materials appearing on Promo Shopify could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">9. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us through our Support page.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
