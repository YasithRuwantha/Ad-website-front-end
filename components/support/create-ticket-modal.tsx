"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (subject: string, message: string) => void
}

export default function CreateTicketModal({ open, onOpenChange, onSubmit }: CreateTicketModalProps) {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return

    setIsLoading(true)
    try {
      onSubmit(subject, message)
      setSubject("")
      setMessage("")
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-600">Create Support Ticket</DialogTitle>
          <DialogDescription>Describe your issue and we'll help you as soon as possible</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Subject</label>
            <Input
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="border-green-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Message</label>
            <textarea
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-2 border border-green-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              rows={5}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-green-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !subject || !message}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
