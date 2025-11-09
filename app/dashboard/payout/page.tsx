"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"
import { useState } from "react"

export default function PayoutPage() {
  const { user } = useAuth()

  // Form Fields
  const [payoutMethod, setPayoutMethod] = useState<"usdt" | "bank">("usdt")
  const [amount, setAmount] = useState("")
  const [usdtName, setUsdtName] = useState("")
  const [usdtAddress, setUsdtAddress] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankAccountHolder, setBankAccountHolder] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankBranch, setBankBranch] = useState("")

  // UI State
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const currentBalance = user?.balance || 0

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async () => {
    setResult(null)
    setLoading(true)

    const payoutAmount = parseFloat(amount)
    if (isNaN(payoutAmount) || payoutAmount <= 0) {
      setResult({ type: "error", message: "Enter a valid amount." })
      setLoading(false)
      return
    }
    if (payoutAmount > currentBalance) {
      setResult({ type: "error", message: `Amount exceeds balance ($${currentBalance.toFixed(2)})` })
      setLoading(false)
      return
    }

    if (payoutMethod === "usdt") {
      if (!usdtName.trim() || !usdtAddress.trim()) {
        setResult({ type: "error", message: "Fill in USDT name and address." })
        setLoading(false)
        return
      }
    } else {
      if (!bankAccountNumber.trim() || !bankAccountHolder.trim() || !bankName.trim() || !bankBranch.trim()) {
        setResult({ type: "error", message: "Fill in all bank details." })
        setLoading(false)
        return
      }
    }

    try {
      const payload = {
        amount: payoutAmount,
        method: payoutMethod,
        ...(payoutMethod === "usdt"
          ? { usdtName, usdtAddress, currency: "USDT" }
          : { bankAccountNumber, bankAccountHolder, bankName, bankBranch, currency: "LKR" }),
      }

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/api/payout/submit`, {
        method: "POST",
        headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Payout failed")

      setResult({ type: "success", message: `Payout of $${payoutAmount.toFixed(2)} submitted!` })
      setAmount("")
      // Optionally clear fields
    } catch (err: any) {
      setResult({ type: "error", message: err.message || "Something went wrong." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Request Payout</h1>
        <p className="text-gray-600">Enter amount and payout details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Amount to Send</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Available: ${currentBalance.toFixed(2)}</p>
          </div>

          {/* Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`flex items-center border rounded-xl p-5 cursor-pointer transition-all
                ${payoutMethod === "usdt" ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-50"}
              `}
              onClick={() => setPayoutMethod("usdt")}
            >
              <CreditCard className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="font-semibold">USDT (TRC-20)</div>
                <div className="text-sm text-gray-600">Crypto</div>
              </div>
            </div>

            <div
              className={`flex items-center border rounded-xl p-5 cursor-pointer transition-all
                ${payoutMethod === "bank" ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-50"}
              `}
              onClick={() => setPayoutMethod("bank")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6366f1" className="w-8 h-8 mr-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V8.25c0-.414.336-.75.75-.75h16.5c.414 0 .75.336.75.75v2.25M4.5 19.5h15M4.5 19.5v-6.75m0 6.75H3.75A.75.75 0 0 1 3 18.75v-6.75m1.5 6.75V12m0 7.5h15m0 0v-6.75m0 6.75h.75a.75.75 0 0 0 .75-.75v-6.75m-1.5 6.75V12m-12 0h12" />
              </svg>
              <div>
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-gray-600">LKR</div>
              </div>
            </div>
          </div>

          {/* USDT Fields */}
          {payoutMethod === "usdt" && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                value={usdtName}
                onChange={(e) => setUsdtName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="text"
                placeholder="TRC-20 USDT Address (starts with T)"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </>
          )}

          {/* Bank Fields */}
          {payoutMethod === "bank" && (
            <>
              <input
                type="text"
                placeholder="Account Number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={bankAccountHolder}
                onChange={(e) => setBankAccountHolder(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="text"
                placeholder="Branch Name"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </>
          )}

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg border text-center font-medium ${
                result.type === "success"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !amount}
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Payout"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}