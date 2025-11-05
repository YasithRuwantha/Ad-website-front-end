"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Platform performance and insights</p>
      </div>

      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>View detailed platform metrics and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Analytics dashboard coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
