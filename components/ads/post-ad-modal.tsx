"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Ad } from "@/lib/data-context"

interface PostAdModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (ad: Ad) => void
}

export default function PostAdModal({ open, onOpenChange, onSubmit }: PostAdModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return

    setIsLoading(true)
    try {
      const newAd: Ad = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        image: image || "/generic-advertisement.png",
        userId: user?.id || "",
        userName: user?.name || "",
        status: "pending",
        createdAt: new Date().toISOString(),
        views: 0,
      }

      onSubmit(newAd)
      setTitle("")
      setDescription("")
      setImage("")
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary">Post New Ad</DialogTitle>
          <DialogDescription>Share your product or service with our community</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ad Title</label>
            <Input
              placeholder="Enter ad title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              placeholder="Describe your product or service"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 border border-primary/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Image URL (Optional)</label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border-primary/30"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-primary/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || !description}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Posting..." : "Post Ad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
