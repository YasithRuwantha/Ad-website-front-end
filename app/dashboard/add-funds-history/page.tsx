"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Calendar, DollarSign, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react"

export default function AddFundsHistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTransactions = [
        {
          id: "TXN001",
          amount: 500,
          currency: "USDT",
          paymentMethod: "USDT(TRC 20)",
          status: "completed",
          date: "2025-11-01T10:30:00",
          transactionId: "0x1234...5678",
          fullName: "John Doe",
          email: "john@example.com",
        },
        {
          id: "TXN002",
          amount: 300,
          currency: "USD",
          paymentMethod: "Bank Deposit",
          status: "pending",
          date: "2025-11-02T14:20:00",
          transactionId: "BANK001",
          fullName: "John Doe",
          email: "john@example.com",
          bankName: "ABC Bank",
        },
        {
          id: "TXN003",
          amount: 1000,
          currency: "USDT",
          paymentMethod: "USDT(TRC 20)",
          status: "completed",
          date: "2025-10-28T09:15:00",
          transactionId: "0xabcd...ef12",
          fullName: "John Doe",
          email: "john@example.com",
        },
        {
          id: "TXN004",
          amount: 200,
          currency: "USD",
          paymentMethod: "Bank Deposit",
          status: "failed",
          date: "2025-10-25T16:45:00",
          transactionId: "BANK002",
          fullName: "John Doe",
          email: "john@example.com",
          bankName: "XYZ Bank",
        },
      ]
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 500)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalDeposited = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Funds History</h1>
        <p className="text-gray-600">View all your deposit transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deposited</p>
                <p className="text-3xl font-bold text-gray-900">${totalDeposited}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">${pendingAmount}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-2">Your deposit history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-50 p-2 rounded-lg">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{transaction.paymentMethod}</h3>
                          <p className="text-sm text-gray-600">Transaction ID: {transaction.id}</p>
                        </div>
                      </div>
                      <div className="ml-11 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(transaction.date)}
                        </div>
                        {transaction.bankName && (
                          <p className="text-sm text-gray-600">Bank: {transaction.bankName}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${transaction.amount}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.currency}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
