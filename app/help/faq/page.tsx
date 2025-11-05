"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, ChevronDown, User, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function FAQPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  const faqs = [
    {
      question: "How Does Promo Shopify Work?",
      answer: "Promo Shopify allows users to promote products and earn commissions. You complete simple tasks by evaluating the products, and we share 70% of the profits with you while the site keeps 30%."
    },
    {
      question: "How Do I Get Paid?",
      answer: "You can withdraw your earnings through multiple payment methods, including credit cards, cryptocurrency, and bank transfers."
    },
    {
      question: "How Much Can I Earn?",
      answer: "Your earnings depend on the projects you complete and the level of engagement. The more you promote, the more you can earn!"
    },
    {
      question: "Is My Money In Safe Hands?",
      answer: "Yes! We use your asset solely for promotions, ensuring fair and transparent opportunities for all users."
    },
    {
      question: "Do I Need Any Experience To Join?",
      answer: "No experience is needed! Our website is user-friendly, and anyone can start earning right away."
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p className="text-sm text-gray-600">Find answers to common questions</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-2 border-green-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-green-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-4 pb-4 pt-2 bg-green-50 border-t-2 border-green-200">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-sm text-gray-700">
                  If you can't find the answer you're looking for, please visit our{" "}
                  <a href="/support" className="text-green-600 hover:text-green-700 font-medium underline">
                    Support page
                  </a>{" "}
                  to create a ticket. Our team will get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
