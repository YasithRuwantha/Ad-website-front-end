"use client"
import { useData } from "@/lib/data-context"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"


export default function AdminUsersPage() {
  const [copied, setCopied] = useState(false)
  const { transactions } = useData()
  const { user } = useAuth()
  

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${user?.referralCode}`
  const referralTransactions = transactions.filter(
    (t) => t.userId === user?.id && t.type === "referral" && t.status === "completed",
  )
  const totalReferralEarnings = referralTransactions.reduce((sum, t) => sum + t.amount, 0)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage and monitor all platform users</p>
      </div>
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Share Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn $10 for each successful signup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground text-sm font-mono"
            />
            <Button onClick={handleCopyLink} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Referral Bonus</p>
              <p className="text-2xl font-bold text-primary">$10</p>
              <p className="text-xs text-muted-foreground mt-1">Per successful signup</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Friend Bonus</p>
              <p className="text-2xl font-bold text-primary">$5</p>
              <p className="text-xs text-muted-foreground mt-1">Your friend gets</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Unlimited</p>
              <p className="text-2xl font-bold text-primary">∞</p>
              <p className="text-xs text-muted-foreground mt-1">No referral limit</p>
            </div>
          </div> */}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">User management interface coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
