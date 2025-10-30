"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import ProductCard from "@/components/products/product-card"
import RatingModal from "@/components/products/rating-modal"
import type { Product } from "@/lib/data-context"
import UserSidebar from "@/components/user/user-sidebar"
import { useRouter } from "next/navigation"


export default function ProductsPage() {
  const { user } = useAuth()
  const { products, ratings, addRating } = useData()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)

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

      setIsChecking(false) // ✅ passed all checks
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

  

  const userRatings = ratings.filter((r) => r.userId === user?.id)

  const handleRateProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowRatingModal(true)
  }

  const handleSubmitRating = (rating: number, comment: string) => {
    if (!selectedProduct) return

    addRating({
      id: Math.random().toString(36).substr(2, 9),
      productId: selectedProduct.id,
      userId: user?.id || "",
      userName: user?.name || "",
      rating,
      comment,
      createdAt: new Date().toISOString(),
    })

    setShowRatingModal(false)
    setSelectedProduct(null)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground">Browse and rate products from our marketplace</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
            <p className="text-3xl font-bold text-primary">
              {userRatings.length > 0
                ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(1)
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const productRatings = ratings.filter((r) => r.productId === product.id)
          const userRating = userRatings.find((r) => r.productId === product.id)

          return (
            <ProductCard
              key={product.id}
              product={product}
              productRatings={productRatings}
              userRating={userRating}
              onRate={() => handleRateProduct(product)}
            />
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
    </div>
  )
}
