"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Send, History } from "lucide-react"
import { useState } from "react"

// Mock transfer history
const MOCK_TRANSFER_HISTORY = [
  { id: "1", recipient: "john@example.com", amount: 100, date: "2024-10-20", status: "completed" },
  { id: "2", recipient: "jane@example.com", amount: 250, date: "2024-10-18", status: "completed" },
  { id: "3", recipient: "bob@example.com", amount: 75, date: "2024-10-15", status: "pending" },
]

export default function FundTransferPage() {
  const { user, updateUser } = useAuth()
  const safeBalance = user?.balance ?? 0

  const [recipientEmail, setRecipientEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState("")

  const handleTransfer = () => {
    if (!recipientEmail || !amount) {
      setShowError("Please fill in all fields")
      return
    }

    const transferAmount = Number(amount)
    if (transferAmount <= 0) {
      setShowError("Amount must be greater than 0")
      return
    }

    if (transferAmount > safeBalance) {
      setShowError("Insufficient balance")
      return
    }

    // Simulate transfer
    const newBalance = safeBalance - transferAmount
    updateUser({ balance: newBalance })

    setShowSuccess(true)
    setRecipientEmail("")
    setAmount("")
    setShowError("")

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const totalTransferred = MOCK_TRANSFER_HISTORY.reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Fund Transfer</h1>
        <p className="text-muted-foreground">Send funds to other users on the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-foreground">${safeBalance.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Transferred</p>
            <p className="text-3xl font-bold text-foreground">${totalTransferred.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Transfer Fee</p>
            <p className="text-3xl font-bold text-foreground">Free</p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Form */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Funds
          </CardTitle>
          <CardDescription>Transfer funds to another user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Transfer completed successfully!
            </div>
          )}

          {showError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{showError}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Recipient Email</label>
            <input
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-2.5 text-muted-foreground">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setAmount(safeBalance.toFixed(2))}
                className="border-primary/20"
              >
                Max
              </Button>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Transfer Amount</span>
              <span className="font-bold text-foreground">
                ${amount ? Number(amount).toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-bold text-foreground">$0.00</span>
            </div>
            <div className="border-t border-primary/20 mt-2 pt-2 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">
                ${amount ? Number(amount).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>

          <Button onClick={handleTransfer} className="w-full bg-primary hover:bg-primary/90">
            <ArrowRight className="w-4 h-4 mr-2" />
            Send Funds
          </Button>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transfer History
          </CardTitle>
          <CardDescription>Your recent fund transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRANSFER_HISTORY.map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{transfer.recipient}</p>
                  <p className="text-xs text-muted-foreground">{new Date(transfer.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${transfer.amount.toFixed(2)}</p>
                  <p
                    className={`text-xs font-semibold ${
                      transfer.status === "completed" ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
