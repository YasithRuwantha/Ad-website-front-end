"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Platform performance and insights</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>View detailed platform metrics and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Analytics dashboard coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
