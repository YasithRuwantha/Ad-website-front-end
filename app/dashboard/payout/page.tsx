"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Wallet, TrendingUp, AlertCircle, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { useRatings } from "@/lib/rating-context"

export default function PayoutPage() {
  const { user, updateUser } = useAuth()
  const [totalEarnings, setTotalEarnings] = useState("")
  const { getUserEarningsRatings } = useRatings() 

  useEffect(() => {
    getUserEarningsRatings().then((data) => {
      // ✅ Calculate total earning immediately
      const total = data.reduce((sum, item) => sum + (item.earning || 0), 0);
      console.log("earnings :",total)
      setTotalEarnings(total);
    });
  }, [])

  // --- Provide dummy values if undefined ---
  const safeUser = {
    balance: user?.balance ?? 120,          // dummy balance
    totalEarnings: user?.totalEarnings, // dummy total earnings
    totalPayouts: user?.totalPayouts ?? 300,   // dummy total payouts
    payoutMethod: user?.payoutMethod ?? "usdt",
    usdtCurrency: user?.usdtCurrency ?? "USDT",
    usdtName: user?.usdtName ?? "",
    usdtAddress: user?.usdtAddress ?? "",
    bankCurrency: user?.bankCurrency ?? "USDT",
    bankAccountNumber: user?.bankAccountNumber ?? "",
    bankAccountHolder: user?.bankAccountHolder ?? "",
    bankName: user?.bankName ?? "",
    bankBranch: user?.bankBranch ?? "",
  }

  const [payoutMethod, setPayoutMethod] = useState(safeUser.payoutMethod)
  // USDT Withdraw fields
  const [usdtCurrency] = useState("USDT")
  const [usdtName, setUsdtName] = useState(safeUser.usdtName)
  const [usdtAddress, setUsdtAddress] = useState(safeUser.usdtAddress)
  // Bank Withdraw fields
  const [bankCurrency, setBankCurrency] = useState("LKR")
  const [bankAccountNumber, setBankAccountNumber] = useState(safeUser.bankAccountNumber)
  const [bankAccountHolder, setBankAccountHolder] = useState(safeUser.bankAccountHolder)
  const [bankName, setBankName] = useState(safeUser.bankName)
  const [bankBranch, setBankBranch] = useState(safeUser.bankBranch)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPayoutInstruction, setShowPayoutInstruction] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minimumPayout = 50
  const canPayout = safeUser.balance >= minimumPayout

  const handleSavePayoutMethod = () => {
    setError(null);
    if (payoutMethod === "usdt") {
      if (!usdtName.trim() || !usdtAddress.trim()) {
        setError("Please fill in all USDT payout fields.");
        return;
      }
      updateUser({
        payoutMethod: "usdt",
        usdtCurrency,
        usdtName,
        usdtAddress,
      })
    } else if (payoutMethod === "bank") {
      if (!bankCurrency.trim() || !bankAccountNumber.trim() || !bankAccountHolder.trim() || !bankName.trim() || !bankBranch.trim()) {
        setError("Please fill in all Bank payout fields.");
        return;
      }
      updateUser({
        payoutMethod: "bank",
        bankCurrency,
        bankAccountNumber,
        bankAccountHolder,
        bankName,
        bankBranch,
      })
    }
    setShowSuccess(false)
    setShowPayoutInstruction(true)
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

  if (showPayoutInstruction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="border-2 border-green-500 shadow-xl max-w-md text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Payout Request Submitted!</h2>
            <p className="text-gray-700 mb-4">
              Your payout request has been submitted. Please follow the instructions below to complete your payout process.
            </p>
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Next Steps</h3>
              <ul className="text-left text-gray-800 space-y-2">
                <li>1. Our team will review your payout request.</li>
                <li>2. You will be contacted by customer support if any additional information is needed.</li>
                <li>3. Payouts are processed within 3-5 business days.</li>
                <li>4. For urgent queries, please contact <span className="text-green-700 font-semibold underline cursor-pointer" onClick={() => window.location.href = '/support'}>customer support</span>.</li>
              </ul>
            </div>
            <Button
              onClick={() => setShowPayoutInstruction(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full"
            >
              Back to Payout
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
                <p className="text-3xl font-bold text-gray-900">
                  ${(totalEarnings || 0).toFixed(2)}
                </p>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* USDT Withdraw Option */}
            <div
              className={`flex items-center border rounded-xl p-6 cursor-pointer transition-all min-h-[100px] w-full
                ${payoutMethod === "usdt" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:bg-gray-50"}
              `}
              onClick={() => setPayoutMethod("usdt")}
            >
              <div className="flex-shrink-0 mr-5">
                <CreditCard className="w-10 h-10 text-[#2dd36f]" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-900 mb-1">Deposit USDT(TRC 20)</div>
                <div className="text-gray-600 text-base">Deposit USDT via TRC-20 for fast, low-cost transactions on the Tron network.</div>
              </div>
              <div className="ml-5 flex items-center justify-center">
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${payoutMethod === "usdt" ? "border-green-500" : "border-gray-300"}`}>
                  {payoutMethod === "usdt" ? (
                    <span className="block w-5 h-5 rounded-full border-4 border-green-500 bg-white" style={{boxShadow: '0 0 0 4px #2dd36f'}} />
                  ) : (
                    <span className="block w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </span>
              </div>
            </div>
            {/* Bank Withdraw Option */}
            <div
              className={`flex items-center border rounded-xl p-6 cursor-pointer transition-all min-h-[100px] w-full
                ${payoutMethod === "bank" ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:bg-gray-50"}
              `}
              onClick={() => setPayoutMethod("bank")}
            >
              <div className="flex-shrink-0 mr-5">
                {/* Bank SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6366f1" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V8.25c0-.414.336-.75.75-.75h16.5c.414 0 .75.336.75.75v2.25M4.5 19.5h15M4.5 19.5v-6.75m0 6.75H3.75A.75.75 0 0 1 3 18.75v-6.75m1.5 6.75V12m0 7.5h15m0 0v-6.75m0 6.75h.75a.75.75 0 0 0 .75-.75v-6.75m-1.5 6.75V12m-12 0h12" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-900 mb-1">Bank Deposit</div>
                <div className="text-gray-600 text-base">Bank Transfer – Secure &amp; Easy</div>
              </div>
              <div className="ml-5 flex items-center justify-center">
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${payoutMethod === "bank" ? "border-green-500" : "border-gray-300"}`}>
                  {payoutMethod === "bank" ? (
                    <span className="block w-5 h-5 rounded-full border-4 border-green-500 bg-white" style={{boxShadow: '0 0 0 4px #2dd36f'}} />
                  ) : (
                    <span className="block w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* {payoutMethod === "usdt" && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">USDT Wallet Address</label>
              <input
                type="text"
                placeholder="Enter your USDT (Tether) wallet address"
                value={usdtAddress}
                onChange={(e) => setUsdtAddress(e.target.value)}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )} */}

          {payoutMethod === "usdt" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Select Currency</label>
                <input
                  type="text"
                  value={usdtCurrency}
                  disabled
                  className="w-full px-4 py-2 border border-green-200 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={usdtName}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setUsdtName(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">TRC 20 USDT Address</label>
                <input
                  type="text"
                  placeholder="Enter your TRC 20 USDT address"
                  value={usdtAddress}
                  onChange={(e) => {
                    // Allow only alphanumeric and -_ (common for wallet addresses)
                    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
                    setUsdtAddress(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          )}

          {payoutMethod === "bank" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Select Currency</label>
                <input
                  type="text"
                  value={usdtCurrency}
                  disabled
                  className="w-full px-4 py-2 border border-green-200 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Account Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter your account number"
                  value={bankAccountNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setBankAccountNumber(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  value={bankAccountHolder}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setBankAccountHolder(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Bank Name</label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setBankName(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Branch Name</label>
                <input
                  type="text"
                  placeholder="Enter branch name"
                  value={bankBranch}
                  onChange={(e) => {
                    // Only allow letters and spaces
                    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                    setBankBranch(value);
                  }}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          )}


          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
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
      {/* <Card className={`border-2 ${canPayout ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
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
      </Card> */}
    </div>
  )
}
