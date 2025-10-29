"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Users, TrendingUp } from "lucide-react"
import { useState } from "react"
import UserSidebar from "@/components/user/user-sidebar"

export default function ReferralsPage() {
  const { user } = useAuth()
  const { transactions } = useData()
  const [copied, setCopied] = useState(false)

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
                <div className="flex h-screen bg-background">
                  <UserSidebar />
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referral Program</h1>
        <p className="text-muted-foreground">Earn money by inviting friends to join EarningHub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Referral Earnings</p>
                <p className="text-3xl font-bold text-primary">${totalReferralEarnings.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-foreground">{referralTransactions.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
              <p className="text-2xl font-bold text-primary font-mono">{user?.referralCode}</p>
            </div>
          </CardContent>
        </Card>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Simple steps to start earning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Share Your Link",
                description: "Copy and share your unique referral link with friends",
              },
              {
                step: 2,
                title: "Friend Signs Up",
                description: "Your friend creates an account using your referral link",
              },
              {
                step: 3,
                title: "Earn Rewards",
                description: "You earn $10 and your friend gets $5 bonus credit",
              },
              {
                step: 4,
                title: "Withdraw Anytime",
                description: "Withdraw your earnings to your wallet whenever you want",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {referralTransactions.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Your recent referral earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralTransactions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10"
                  >
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-green-600">+${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  )
}
