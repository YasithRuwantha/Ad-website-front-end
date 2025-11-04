"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import type { Product } from "@/lib/data-context"

interface RatingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  onSubmit: (rating: number, comment: string) => void
  isLoading: boolean   // Add this
}

export default function RatingModal({ 
  open, 
  onOpenChange, 
  product, 
  onSubmit, 
  isLoading   // <-- use this instead
}: RatingModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Don't set loading here — parent controls it
    onSubmit(rating, comment)
    // Reset after submit (optional, parent may close modal)
    setRating(5)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-2 border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-xl">Rate Product</DialogTitle>
          <DialogDescription className="text-gray-600">{product.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">Your Rating</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  disabled={isLoading}   // Disable stars while submitting
                >
                  <Star
                    className={`w-10 h-10 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}   // Disable cancel too
              className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
