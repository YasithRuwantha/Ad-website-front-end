"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Users, TrendingUp, User, ChevronDown, LogOut, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import UserSidebar from "@/components/user/user-sidebar"
import { useRouter } from "next/navigation"

export default function ReferralsPage() {
  const { user } = useAuth()
  const { transactions } = useData()
  const [copied, setCopied] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const router = useRouter();
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

  useEffect(() => {
    // Run only on client
    const userString = localStorage.getItem("user")
    const usertemp = userString ? JSON.parse(userString) : null
    const userEmail = usertemp?.email || ""
    setReferralLink(`http://www.adsales.com/signup?ref=${userEmail}`)
  }, [])


  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
      <div className="space-y-3 flex-1 overflow-auto md:ml-0 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600">Earn money by inviting friends to join Shopify</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Referral Earnings</p>
                {/* <p className="text-3xl font-bold text-green-600">${totalReferralEarnings.toFixed(2)}</p> */}
              </div>
              <TrendingUp className="w-8 h-8 text-green-600/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{referralLink.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
              {/* <p className="text-2xl font-bold text-green-600 font-mono">{user?.referralCode}</p> */}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-600">Share Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn $10 for each successful signup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-background border border-green-300 rounded-lg text-foreground text-sm font-mono"
            />
            <Button onClick={copyToClipboard} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-background rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Referral Bonus</p>
              <p className="text-2xl font-bold text-green-600">$10</p>
              <p className="text-xs text-gray-600 mt-1">Per successful signup</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Friend Bonus</p>
              <p className="text-2xl font-bold text-green-600">$5</p>
              <p className="text-xs text-gray-600 mt-1">Your friend gets</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Unlimited</p>
              <p className="text-2xl font-bold text-green-600">∞</p>
              <p className="text-xs text-gray-600 mt-1">No referral limit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Simple steps to start earning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Share Your Link",
                description: "Copy and share your unique referral link with friends",
              },
              {
                step: 2,
                title: "Friend Signs Up",
                description: "Your friend creates an account using your referral link",
              },
              {
                step: 3,
                title: "Earn Rewards",
                description: "You earn $10 and your friend gets $5 bonus credit",
              },
              {
                step: 4,
                title: "Withdraw Anytime",
                description: "Withdraw your earnings to your wallet whenever you want",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {referralLink.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Your recent referral earnings</CardDescription>
          </CardHeader>
          {/* <CardContent>
            <div className="space-y-3">
              {referralLink
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">+${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </CardContent> */}
        </Card>
      )}
      </div>
      </div>
    </div>
  )
}
