"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, X } from "lucide-react"
import type { Ad } from "@/lib/data-context"

interface AdRatingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ad: Ad | null
  onSubmit: (adId: string, rating: number) => void
}

export default function AdRatingModal({ open, onOpenChange, ad, onSubmit }: AdRatingModalProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    if (open && ad) {
      setRating(ad.rating || 5)
      setHoveredRating(0)
    }
  }, [open, ad])

  if (!ad) return null

  function handleSubmit() {
    if (!ad) return
    onSubmit(ad.id, rating)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Rate This Ad</DialogTitle>
          <DialogDescription>Share your feedback about this advertisement</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Ad Preview */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src={ad.image || "/placeholder.svg"}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1">{ad.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{ad.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>by {ad.userName}</span>
                <span>•</span>
                <span>{ad.views} views</span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-0.5 sm:p-1"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary sm:ml-3">{hoveredRating || rating}/5</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Current Rating Display */}
          {ad.rating && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Current rating: <span className="font-semibold text-foreground">{ad.rating}/5</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            Submit Rating
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
