"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"

// Mock payout history data
const MOCK_PAYOUT_HISTORY = [
  { id: "1", amount: 500, method: "bank", status: "completed", date: "2024-10-20", reference: "PAY-2024-10-001" },
  { id: "2", amount: 750, method: "paypal", status: "completed", date: "2024-10-15", reference: "PAY-2024-10-002" },
  { id: "3", amount: 300, method: "bank", status: "pending", date: "2024-10-25", reference: "PAY-2024-10-003" },
  { id: "4", amount: 1200, method: "stripe", status: "completed", date: "2024-10-10", reference: "PAY-2024-10-004" },
  { id: "5", amount: 450, method: "bank", status: "failed", date: "2024-10-05", reference: "PAY-2024-10-005" },
  { id: "6", amount: 600, method: "paypal", status: "completed", date: "2024-09-28", reference: "PAY-2024-09-001" },
]

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
    default: return method
  }
}

export default function PayoutHistoryPage() {
  const { user } = useAuth()

  // Safe dummy values if user or fields are undefined
  const safeUser = {
    totalPayouts: user?.totalPayouts ?? 0,
    balance: user?.balance ?? 0,
    totalEarnings: user?.totalEarnings ?? 0,
  }

  const stats = [
    { label: "Total Payouts", value: `$${safeUser.totalPayouts.toFixed(2)}`, icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Completed", value: MOCK_PAYOUT_HISTORY.filter((p) => p.status === "completed").length, icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Pending", value: MOCK_PAYOUT_HISTORY.filter((p) => p.status === "pending").length, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Payout History</h1>
        <p className="text-muted-foreground">Track all your payouts and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
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
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Payout Transactions</CardTitle>
          <CardDescription>Complete history of all your payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Reference</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYOUT_HISTORY.map((payout) => (
                  <tr key={payout.id} className="border-b hover:bg-primary/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{new Date(payout.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-muted-foreground">{payout.reference}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-foreground">${(payout.amount ?? 0).toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-foreground">{getMethodLabel(payout.method)}</span>
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

      {/* Download Statement */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Export Statement</CardTitle>
          <CardDescription>Download your payout history as a CSV file</CardDescription>
        </CardHeader>
        <CardContent>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Download CSV
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
