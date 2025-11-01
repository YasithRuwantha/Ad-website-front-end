"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import RatingModal from "@/components/products/rating-modal"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/lib/products-context"
import { useRatings } from "@/lib/rating-context"
import Popup from "@/components/luckydrawPopup" // upgraded popup

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

        setRemaining(parsedUser.remaining || 0)

        // Fetch user's ratings
        const ratings = await getUserRatings()
        setUserRatings(ratings)

        // Fetch lucky draw status
        const token = localStorage.getItem("token")
        if (token) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/luckydraw`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            if (data.luckydrawStatus === "active") {
              setShowLuckyDrawPopup(true)
            }
          }
        }

        setIsChecking(false)
      } catch (err) {
        console.error("Error initializing:", err)
        router.push("/")
      }
    }

    init()
  }, [router, getUserRatings])

  const handleRateProduct = (product: any) => {
    const userRating = userRatings.find((r) => r.productId === product._id)
    if (userRating) {
      alert("You have already rated this product.")
      return
    }
    if (remaining <= 0) {
      alert("No remaining attempts.")
      return
    }
    setSelectedProduct(product)
    setShowRatingModal(true)
  }

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
        setShowRatingModal(false)
        setSelectedProduct(null)
        alert(result.message || "❌ Failed to submit rating")
      }
    } catch (err: any) {
      setShowRatingModal(false)
      setSelectedProduct(null)
      alert(err.message || "Failed to submit rating")
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) return null

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const fill = rating - i >= 1 ? "fill-primary text-primary" :
                   rating - i > 0 ? "fill-gradient-to-r from-primary to-accent text-primary" :
                   "text-muted-foreground"
      return <Star key={i} className={`w-4 h-4 ${fill}`} />
    })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <UserSidebar />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Browse and rate products from our marketplace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Products</p>
              <p className="text-3xl font-bold text-foreground">{products.length}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Your Ratings</p>
              <p className="text-3xl font-bold text-foreground">{userRatings.length}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Remaining Attempts</p>
              <p className="text-3xl font-bold text-primary">{remaining}</p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const userRating = userRatings.find(
              (r) => r.userId === user?.id && r.productId === product._id
            )
            return (
              <Card key={product._id} className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <CardContent>
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Income per rating</p>
                    <p className="text-2xl font-bold text-green-600">${product.income || 0}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">{renderStars(Number(product.rating) || 0)}</div>
                    <span className="text-sm font-semibold text-foreground">{(Number(product.rating) || 0).toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({product.ratedCount || product.ratedBy || 0})</span>
                  </div>

                  {userRating && (
                    <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs font-semibold text-primary">
                        Your Rating: {userRating.rating}/5 ⭐
                      </p>
                      {userRating.comment && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">"{userRating.comment}"</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRateProduct(product)}
                    disabled={isLoading || remaining <= 0 || !!userRating}
                    className={`w-full ${
                      userRating
                        ? "bg-gray-400 cursor-not-allowed"
                        : remaining > 0
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? "Submitting..." : userRating ? "Already Rated ✓" : remaining > 0 ? "Rate Product" : "No Attempts Left"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedProduct && (
          <RatingModal
            open={showRatingModal}
            onOpenChange={setShowRatingModal}
            product={selectedProduct}
            onSubmit={handleSubmitRating}
          />
        )}
      </div>

      {/* Lucky Draw Popup */}
      <Popup
        open={showLuckyDrawPopup}
        onClose={() => setShowLuckyDrawPopup(false)}
        title="🎉 Lucky Draw Active!"
        navigateTo="/dashboard/payout" // pass the page dynamically

      >
        <p>Try your luck now and win exciting rewards!</p>
      </Popup>
    </div>
  )
}
