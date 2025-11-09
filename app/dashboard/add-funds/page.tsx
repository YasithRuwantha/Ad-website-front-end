"use client"

import { useEffect, useState } from "react"
// @ts-ignore
import { openFloatingSupportChat } from "@/components/support/FloatingSupportChat"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useFundPayments } from "@/lib/fundPayment-context"

import Image from "next/image"

export default function AddFundsPage() {
  const [selectedPayment, setSelectedPayment] = useState("usdt")
  const [selectedCurrency, setSelectedCurrency] = useState("USDT")
  const [amount, setAmount] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showContactSupport, setShowContactSupport] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [fullName, setFullName] = useState("")
  const [note, setNote] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [userId, setUserId] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankBranch, setBankBranch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [successPaymentId, setSuccessPaymentId] = useState<string>("")


  const currencies = ["USDT", "LKR"]

  const paymentMethods = [
    {
      id: "usdt",
      title: "Deposit USDT(TRC 20)",
      description: "Deposit USDT via TRC-20 for fast, low-cost transactions on the Tron network.",
      icon: "💳",
    },
    {
      id: "bank",
      title: "Bank Deposit",
      description: "Bank Transfer - Secure &amp; Easy",
      icon: "🏦",
    },
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    if (e.target.value) {
      setShowPreview(false)
      setTimeout(() => setShowPreview(true), 300)
    } else {
      setShowPreview(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMakePayment = () => {
    setShowContactSupport(true)
    if (typeof window !== "undefined" && openFloatingSupportChat) {
      openFloatingSupportChat()
    }
    setTimeout(() => setShowContactSupport(false), 4000)
    setShowPaymentForm(true)
  }

       const { addFundPayment } = useFundPayments()

  const handleConfirmPayment = async () => {
  try {
    setIsSubmitting(true)
    const userString = localStorage.getItem("user")
    let userIdFromStorage = ""
    if (userString) {
      const user = JSON.parse(userString)
      userIdFromStorage = user.id
    }

    const paymentPayload = {
      userID: userIdFromStorage,
      amount: amount,
      method: selectedPayment === "usdt" ? "USDT-TRC20" : "Bank",
      imgFile: proofFile,
      requestedDate: new Date().toISOString(),
      note,
      bankBranch,
      fullName,
    }

    console.log("Submitting Payment:", paymentPayload)
    

    const newPayment = await addFundPayment(paymentPayload)
    setSuccessPaymentId(newPayment._id)
    setPaymentSuccess(true)
  } catch (err: any) {
    alert("Failed to submit payment: " + err.message)
  } finally {
    setIsSubmitting(false)
  }
}

if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="border-2 border-green-500 shadow-xl max-w-md text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
            <p className="text-gray-700 mb-4">
              Your payment has been successfully submitted.
            </p>
            <p className="text-gray-900 font-semibold mb-6">Payment</p>
            <Button
              onClick={() => {
                setPaymentSuccess(false)
                setShowPaymentForm(false)
                setAmount("")
                setFullName("")
                setNote("")
                setDepositAmount("")
                setBankName("")
                setProofFile(null)
                setPreviewUrl("")
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg w-full"
            >
              Make Another Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }






  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Add Fund</h1>
        </div>

        {!showPaymentForm ? (
          <>
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Payment Selection */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedPayment === method.id
                      ? "border-2 border-green-500 bg-green-50/50"
                      : "border border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{method.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedPayment === method.id
                              ? "border-green-600 bg-green-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Amount Input & Preview */}
          <div>
            {/* Currency Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Currency</label>
              <div className="grid grid-cols-4 gap-2">
                {currencies.map((currency) => (
                  <button
                    key={currency}
                    onClick={() => setSelectedCurrency(currency)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      selectedCurrency === currency
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">{selectedCurrency}</label>
              <Input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 text-lg border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
              />
              {amount && (
                <p className="mt-3 text-sm text-green-600 font-medium">
                  Amount : {amount} {selectedCurrency}
                </p>
              )}
            </div>

            {/* Preview Section */}
            <div
              className={`transition-all duration-500 ${
                showPreview ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {amount && (
                <Card className="border-2 border-green-500 shadow-lg">
                  <CardContent className="p-5">
                    {/* Amount Display with Checkmark */}
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 mb-4 relative">
                      <Input
                        type="text"
                        value={amount}
                        readOnly
                        className="text-xl font-bold text-gray-900 border-none bg-transparent focus:ring-0 p-0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium mb-4">
                      Amount : {amount} {selectedCurrency}
                    </p>

                    {/* Deposit Summary */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Deposit Summary</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">Amount In {selectedCurrency}</span>
                          <span className="text-gray-900 font-semibold text-sm">{amount} {selectedCurrency}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">Charge</span>
                          <span className="text-red-600 font-semibold text-sm">0 {selectedCurrency}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 text-sm">Payable Amount</span>
                          <span className="text-gray-900 font-semibold text-sm">{amount} {selectedCurrency}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-700 text-sm">In Base Currency</span>
                          <span className="text-gray-900 font-semibold text-sm">{amount}.00 USD</span>
                        </div>
                      </div>
                    </div>

                    {/* Make Payment Button */}
                    <Button 
                      onClick={handleMakePayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-base transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                      Make Payment
                    </Button>
                    {showContactSupport && (
                      <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow animate-fade-in">
                        Please contact customer support for assistance with your payment.
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        </>
        ) : (
          /* Payment Confirmation Form */
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-green-500 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Pay With Deposit {selectedPayment === "usdt" ? "USDT(TRC 20)" : "Bank Transfer"}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-600 cursor-pointer hover:underline">Home</span>
                    <span>›</span>
                    <span>Pay With Deposit {selectedPayment === "usdt" ? "USDT(TRC 20)" : "USD"}</span>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Please follow the instruction below
                  </h3>
                  <div className="text-center mb-4">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 border-2 border-yellow-500 shadow-lg animate-pulse">
                        <svg className="w-7 h-7 text-yellow-700 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <span className="font-extrabold text-lg text-yellow-900 drop-shadow">
                          You have requested to deposit <span className="font-bold text-gray-900">{amount} {selectedCurrency}</span>. Please contact <span className="underline decoration-yellow-700 underline-offset-4">customer service</span> to pay <span className="font-bold text-gray-900">{amount} {selectedCurrency}</span> for successful payment.
                        </span>
                      </div>
                    </div>
                    {selectedPayment === "usdt" ? (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">USDT ADDRESS:</p>
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          onClick={() => window.location.href = '/support'}
                          type="button"
                        >
                          Contact Customer Service
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="flex flex-col items-center my-4">
                          <p className="text-2xl font-bold text-center text-yellow-900 mb-2">
                            Please contact Customer Support for any assistance.
                          </p>
                          <button
                            className="text-sm px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            onClick={() => window.location.href = '/support'}
                            type="button"
                          >
                            Go to Support
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {selectedPayment === "usdt" ? (
                    // USDT Payment Form
                    <>
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full name <span className="text-red-600">*</span>
                        </label>
                        <Input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        />
                      </div>

                      {/* note Address */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          note address <span className="text-red-600">*</span>
                        </label>
                        <Input
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Enter your note"
                          className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        />
                      </div>

                      {/* Upload Proof of Payment */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload proof of payment(PDF/IMAGE) <span className="text-red-600">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="proof-upload"
                          />
                          <label
                            htmlFor="proof-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            {previewUrl ? (
                              <div className="w-full">
                                <img
                                  src={previewUrl}
                                  alt="Proof preview"
                                  className="max-h-64 mx-auto rounded-lg"
                                />
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                  {proofFile?.name}
                                </p>
                              </div>
                            ) : (
                              <div className="py-12">
                                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <p className="text-gray-600">Click to upload image or PDF</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Bank Deposit USD Form
                    <>
  {/* Full Name */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Full Name <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="Enter your full name"
      className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
    />
  </div>

  {/* Note */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Note <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Enter your note"
      className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
    />
  </div>

  {/* Amount */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Amount <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={depositAmount || amount}
      onChange={(e) => setDepositAmount(e.target.value)}
      placeholder="Enter amount"
      className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
    />
  </div>

  {/* Your Bank Name */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Your Bank Name <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      placeholder="Enter your bank name"
      className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
    />
  </div>

  {/* Your Bank Branch */}
  {/* <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Your Bank Branch <span className="text-red-600">*</span>
    </label>
    <Input
      type="text"
      value={bankBranch}
      onChange={(e) => setBankBranch(e.target.value)}
      placeholder="Enter your bank branch"
      className="w-full px-4 py-3 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200"
    />
  </div> */}

  {/* 🔹 Upload Proof of Payment */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Upload proof of payment (PDF/IMAGE) <span className="text-red-600">*</span>
    </label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
        id="proof-upload-bank"
      />
      <label
        htmlFor="proof-upload-bank"
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        {previewUrl ? (
          <div className="w-full">
            <img
              src={previewUrl}
              alt="Proof preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            <p className="mt-2 text-sm text-green-600 font-medium">
              {proofFile?.name}
            </p>
          </div>
        ) : (
          <div className="py-12">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Click to upload image or PDF</p>
          </div>
        )}
      </label>
    </div>
  </div>
</>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => setShowPaymentForm(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Confirm Now"}
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
