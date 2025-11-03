"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import RatingModal from "@/components/products/rating-modal"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/lib/products-context"
import { useRatings } from "@/lib/rating-context"
import Popup from "@/components/luckydrawPopup"

export default function ProductsPage() {
  const { user } = useAuth()
  const { products, fetchProducts } = useProducts()
  const { submitRating, getUserRatings } = useRatings()
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)
  const [remaining, setRemaining] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [userRatings, setUserRatings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showLuckyDrawPopup, setShowLuckyDrawPopup] = useState(false)
  const [showAlreadyRatedPopup, setShowAlreadyRatedPopup] = useState(false)
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // ✅ Fetch Lucky Draw Status
  const fetchLuckyDrawStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/luckydraw`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.luckydrawStatus === "active") {
          setShowLuckyDrawPopup(true)
        } else {
          setShowLuckyDrawPopup(false)
        }
      }
    } catch (err) {
      console.error("Error checking lucky draw:", err)
    }
  }

  // ✅ Initialize Data
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          router.push("/")
          return
        }

        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role !== "user") {
          router.push("/")
          return
        }

        setUserName(parsedUser.name || "User")
        setUserEmail(parsedUser.email || "")
        setRemaining(parsedUser.remaining || 0)

        // Fetch user ratings
        const ratings = await getUserRatings()
        console.log("🔍 All user ratings received:", ratings)
        console.log("🔍 Number of ratings:", ratings.length)
        setUserRatings(ratings)

        // Fetch Lucky Draw status
        await fetchLuckyDrawStatus()

        setIsChecking(false)
      } catch (err) {
        console.error("Error initializing:", err)
        router.push("/")
      }
    }

    init()
  }, [router, getUserRatings])

  // ✅ Refetch Lucky Draw status dynamically when remaining changes
  useEffect(() => {
    if (!isChecking) {
      fetchLuckyDrawStatus()
    }
  }, [remaining]) // when remaining updates, check again

  // ⭐ Handle Rating Submission
  const handleSubmitRating = async (rating: number, comment: string) => {
    if (!selectedProduct) return
    setIsLoading(true)

    try {
      const result = await submitRating(selectedProduct._id, rating, comment)
      if (result.success) {
        if (result.remaining !== undefined) {
          setRemaining(result.remaining)
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const user = JSON.parse(storedUser)
            user.remaining = result.remaining
            localStorage.setItem("user", JSON.stringify(user))
          }
        }

        const ratings = await getUserRatings()
        setUserRatings(ratings)
        await fetchProducts()

        setShowRatingModal(false)
        setSelectedProduct(null)
        alert(result.message || "✅ Rating submitted successfully!")
      } else {
        alert(result.message || "❌ Failed to submit rating")
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit rating")
    } finally {
      setIsLoading(false)
    }
  }

  // ⭐ Handle Product Rating Modal
  const handleRateProduct = (product: any) => {
    console.log("handleRateProduct called for:", product.name)
    const userRating = userRatings.find((r) => r.productId === product._id)
    console.log("User rating found:", userRating)
    if (userRating) {
      console.log("Showing already rated alert")
      setShowAlreadyRatedPopup(true)
      return
    }
    if (remaining <= 0) {
      alert("No remaining attempts.")
      return
    }
    
    console.log("Opening rating modal")
    setSelectedProduct(product)
    setShowRatingModal(true)
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  // Click outside to close dropdown
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

  // ⭐ Dynamic Floating Stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const diff = rating - i
      let fill = "text-gray-300"
      if (diff >= 1) fill = "text-yellow-400 fill-yellow-400"
      else if (diff > 0 && diff < 1)
        fill = "text-yellow-400 fill-yellow-400 opacity-60" // half glow look
      return <Star key={i} className={`w-4 h-4 ${fill}`} />
    })
  }

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

        <div className="flex-1 overflow-auto p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Browse and rate products from our marketplace</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Ratings</p>
                  <p className="text-3xl font-bold text-gray-900">{userRatings.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-green-600 fill-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Remaining Attempts</p>
                  <p className="text-3xl font-bold text-green-600">{remaining}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Cards */}
        <div className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {           
            const userRating = userRatings.find((r) => {
              const ratingProductId = typeof r.productId === 'string' ? r.productId : r.productId?._id
              return ratingProductId === product._id
            })
            
            console.log("Product:", product.name, "ID:", product._id)
            console.log("User Rating found:", userRating)
            console.log("---")
            
            return (
              <Card key={product._id} className="border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <CardContent>
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Income per rating</p>
                    <p className="text-2xl font-bold text-green-600">${product.income || 0}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">{renderStars(Number(product.rating) || 0)}</div>
                    <span className="text-sm font-semibold text-gray-900">{(Number(product.rating) || 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-600">({product.ratedCount || product.ratedBy || 0})</span>
                  </div>

                  {userRating && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs font-semibold text-green-700">
                        Your Rating: {userRating.rating}/5 ⭐
                      </p>
                      {userRating.comment && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">"{userRating.comment}"</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRateProduct(product)}
                    disabled={isLoading || (remaining <= 0 && !userRating)}
                    className={`w-full ${
                      userRating
                        ? "bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-300"
                        : remaining > 0
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading
                      ? "Submitting..."
                      : userRating
                      ? "Already Rated "
                      : remaining > 0
                      ? "Rate Product"
                      : "No Attempts Left"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Rating Modal */}
        {selectedProduct && (
          <RatingModal
            open={showRatingModal}
            onOpenChange={setShowRatingModal}
            product={selectedProduct}
            onSubmit={handleSubmitRating}
            isLoading={isLoading}  // Pass it here
          />
        )}
        </div>
      </div>

      {/* 🎯 Lucky Draw Popup */}
      <Popup
        open={showLuckyDrawPopup}
        onClose={() => setShowLuckyDrawPopup(false)}
        title="🎉 Lucky Draw Active!"
        navigateTo="/dashboard/payout"
      >
        <p>Try your luck now and win exciting rewards!</p>
      </Popup>
   
    </div>
  )
}
