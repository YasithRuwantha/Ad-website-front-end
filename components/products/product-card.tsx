"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { Product, Rating } from "@/lib/data-context"

interface ProductCardProps {
  product: Product
  productRatings: Rating[]
  userRating?: Rating
  onRate: () => void
}

export default function ProductCard({ product, productRatings, userRating, onRate }: ProductCardProps) {
  const avgRating =
    productRatings.length > 0 ? productRatings.reduce((sum, r) => sum + r.rating, 0) / productRatings.length : 0

  return (
    <Card className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          onError={(e) => {
            e.currentTarget.src = "/diverse-products-still-life.png"
          }}
        />
      </div>

      <CardContent className="pt-4">
        {/* Product Info */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-primary">${product.price}</p>
          <p className="text-xs text-muted-foreground">by {product.seller}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({productRatings.length})</span>
        </div>

        {/* User Rating Badge */}
        {userRating && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg">
            <p className="text-xs font-semibold text-primary">Your Rating: {userRating.rating}/5</p>
          </div>
        )}

        {/* Rate Button */}
        <Button
          onClick={onRate}
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
}
