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
      <DialogContent className="max-w-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary">Rate Product</DialogTitle>
          <DialogDescription>{product.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  disabled={isLoading}   // Disable stars while submitting
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}   // Disable cancel too
              className="flex-1 border-primary/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
