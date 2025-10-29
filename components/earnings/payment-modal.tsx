"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (amount: number, walletAddress: string, proofImage: string) => void
}

export default function PaymentModal({ open, onOpenChange, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [proofImage, setProofImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !walletAddress) return

    setIsLoading(true)
    try {
      onSubmit(Number.parseFloat(amount), walletAddress, proofImage)
      setAmount("")
      setWalletAddress("")
      setProofImage("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary">Add Funds via USDT</DialogTitle>
          <DialogDescription>Transfer USDT to add funds to your account</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info Box */}
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-1">USDT Wallet Address:</p>
              <p className="font-mono text-xs bg-background p-2 rounded border border-primary/20 break-all">
                0x1234567890abcdef1234567890abcdef12345678
              </p>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Amount (USDT)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              required
              className="border-primary/30"
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Your Wallet Address</label>
            <Input
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
              className="border-primary/30"
            />
          </div>

          {/* Proof Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Proof of Transfer (URL)</label>
            <Input
              type="url"
              placeholder="https://example.com/proof.jpg"
              value={proofImage}
              onChange={(e) => setProofImage(e.target.value)}
              className="border-primary/30"
            />
            <p className="text-xs text-muted-foreground mt-1">Screenshot or transaction hash URL</p>
          </div>

          {/* Actions */}
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
              disabled={isLoading || !amount || !walletAddress}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
