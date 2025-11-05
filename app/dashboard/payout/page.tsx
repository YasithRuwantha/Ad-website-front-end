"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Wallet, TrendingUp, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function PayoutPage() {
  const { user, updateUser } = useAuth()

  // --- Provide dummy values if undefined ---
  const safeUser = {
    balance: user?.balance ?? 120,          // dummy balance
    totalEarnings: user?.totalEarnings ?? 500, // dummy total earnings
    totalPayouts: user?.totalPayouts ?? 300,   // dummy total payouts
    payoutMethod: user?.payoutMethod ?? "bank",
    bankAccount: user?.bankAccount ?? "",
    paypalEmail: user?.paypalEmail ?? "",
  }

  const [payoutMethod, setPayoutMethod] = useState(safeUser.payoutMethod)
  const [bankAccount, setBankAccount] = useState(safeUser.bankAccount)
  const [paypalEmail, setPaypalEmail] = useState(safeUser.paypalEmail)
  const [showSuccess, setShowSuccess] = useState(false)

  const minimumPayout = 50
  const canPayout = safeUser.balance >= minimumPayout

  const handleSavePayoutMethod = () => {
    updateUser({
      payoutMethod: payoutMethod as "bank" | "paypal" | "stripe",
      bankAccount,
      paypalEmail,
    })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleRequestPayout = () => {
    if (canPayout) {
      const newBalance = 0
      const newTotalPayouts = safeUser.totalPayouts + safeUser.balance
      updateUser({
        balance: newBalance,
        totalPayouts: newTotalPayouts,
      })
      alert(`Payout of $${safeUser.balance.toFixed(2)} requested successfully!`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Management</h1>
        <p className="text-gray-600">Manage your earnings and payout settings</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">${safeUser.balance.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">${safeUser.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payouts</p>
                <p className="text-3xl font-bold text-gray-900">${safeUser.totalPayouts.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Method Setup */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
          <CardDescription>Set up your preferred payout method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
              <input
                type="radio"
                name="payoutMethod"
                value="bank"
                checked={payoutMethod === "bank"}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct deposit to your bank account</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
              <input
                type="radio"
                name="payoutMethod"
                value="paypal"
                checked={payoutMethod === "paypal"}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-900">PayPal</p>
                <p className="text-sm text-gray-600">Receive funds via PayPal</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
              <input
                type="radio"
                name="payoutMethod"
                value="stripe"
                checked={payoutMethod === "stripe"}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-4 h-4"
              />
              <div>
                <p className="font-semibold text-gray-900">Stripe</p>
                <p className="text-sm text-gray-600">Receive funds via Stripe Connect</p>
              </div>
            </label>
          </div>

          {payoutMethod === "bank" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Bank Account</label>
              <input
                type="text"
                placeholder="Enter your bank account (e.g., ****1234)"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}

          {payoutMethod === "paypal" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">PayPal Email</label>
              <input
                type="email"
                placeholder="Enter your PayPal email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Payout method saved successfully!
            </div>
          )}

          <Button onClick={handleSavePayoutMethod} className="w-full bg-green-600 hover:bg-green-700">
            Save Payout Method
          </Button>
        </CardContent>
      </Card>

      {/* Request Payout */}
      <Card className={`border-2 ${canPayout ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Request Payout
          </CardTitle>
          <CardDescription>Withdraw your available balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canPayout && (
            <div className="flex gap-3 p-4 bg-amber-100 border border-amber-300 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Minimum payout not reached</p>
                <p className="text-sm text-amber-800">
                  You need at least ${minimumPayout} to request a payout. Current balance: ${safeUser.balance.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Payout Amount</p>
            <p className="text-2xl font-bold text-gray-900">${safeUser.balance.toFixed(2)}</p>
          </div>

          <Button
            onClick={handleRequestPayout}
            disabled={!canPayout}
            className={`w-full ${canPayout ? "bg-green-600 hover:bg-green-700" : "opacity-50 cursor-not-allowed"}`}
          >
            {canPayout ? "Request Payout Now" : "Balance Too Low"}
          </Button>

          <p className="text-xs text-gray-600 text-center">Payouts are processed within 3-5 business days</p>
        </CardContent>
      </Card>
    </div>
  )
}
