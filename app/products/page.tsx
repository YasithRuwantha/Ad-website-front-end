"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import RatingModal from "@/components/products/rating-modal"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useProducts } from "@/lib/products-context"
import type { Product } from "@/lib/data-context"

export default function ProductsPage() {
  const { user } = useAuth()
  const { ratings, addRating } = useData()
  const { products } = useProducts()
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)
  const [remaining, setRemaining] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)

  // ✅ Get user + remaining attempts from localStorage safely
  useEffect(() => {
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
      setIsChecking(false)
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

  // Ratings made by this user
  const userRatings = ratings.filter((r) => r.userId === user?.id)

  const handleRateProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowRatingModal(true)
  }

const handleSubmitRating = (rating: number, comment: string) => {
  if (!selectedProduct || !user) return

  // Check if user already rated this product
  const existingRating = ratings.find(
    (r) => r.productId === selectedProduct._id && r.userId === user.id
  )

  if (existingRating) {
    // Update the existing rating
    existingRating.rating = rating
    existingRating.comment = comment
    existingRating.createdAt = new Date().toISOString()
  } else {
    // Add a new rating
    addRating({
      id: Math.random().toString(36).substr(2, 9),
      productId: selectedProduct._id,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    })
  }

  setShowRatingModal(false)
  setSelectedProduct(null)
}


  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <UserSidebar />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Browse and rate products from our marketplace
          </p>
        </div>

        {/* Stats */}
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

        {/* Products */}
        <div className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const userRating = userRatings.find(
              (r) => r.userId === user?.id && r.productId === product._id
            )

            return (
              <Card
                key={product._id}
                className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => (e.currentTarget.src = "/diverse-products-still-life.png")}
                  />
                </div>

                <CardContent className="">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                  </div>

                  {/* Rating (direct from backend) */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* User Rating */}
                  {userRating && (
                    <div className="mb-3 p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs font-semibold text-primary">
                        Your Rating: {userRating.rating}/5
                      </p>
                    </div>
                  )}

                  {/* Rate Button */}
                  <Button
                    onClick={() => handleRateProduct(product)}
                    className={`w-full ${
                      userRating
                        ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {userRating ? "Update Rating" : "Rate Product"}
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
          />
        )}
      </div>
    </div>
  )
}
