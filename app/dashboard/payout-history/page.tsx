"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="w-5 h-5 text-green-600" />
    case "pending": return <Clock className="w-5 h-5 text-amber-600" />
    case "failed": return <XCircle className="w-5 h-5 text-red-600" />
    default: return null
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed": return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    case "pending": return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
    case "failed": return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    default: return null
  }
}

const getMethodLabel = (method: string) => {
  switch (method) {
    case "bank": return "Bank Transfer"
    case "paypal": return "PayPal"
    case "stripe": return "Stripe"
    case "usdt": return "USDT"
    default: return method
  }
}

export default function PayoutHistoryPage() {
  const { user } = useAuth()
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        if (!token) return
        const res = await fetch(`${API_URL}/api/payout/history`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch payouts")
        setPayouts(data.payouts || data) // in case backend returns array directly
      } catch (err) {
        console.error("Fetch payouts error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayouts()
  }, [API_URL, token])

  // Safe dummy values if user fields are undefined
  const safeUser = {
    totalPayouts: user?.totalPayouts ?? 0,
    balance: user?.balance ?? 0,
    totalEarnings: user?.totalEarnings ?? 0,
  }

  const stats = [
    { label: "Total Payouts", value: `$${safeUser.totalPayouts.toFixed(2)}`, icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Completed", value: payouts.filter((p) => p.status === "completed").length, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Pending", value: payouts.filter((p) => p.status === "pending").length, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
  ]

  if (loading) return <p className="text-center mt-10">Loading payout history...</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout History</h1>
        <p className="text-gray-600">Track all your payouts and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payout History Table */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle>Payout Transactions</CardTitle>
          <CardDescription>Complete history of all your payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Reference</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout._id || payout.id} className="border-b hover:bg-green-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900">{new Date(payout.requestedAt || payout.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-gray-600">{payout.reference || payout._id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">${(payout.amount ?? 0).toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{getMethodLabel(payout.method)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payout.status)}
                        {getStatusBadge(payout.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
