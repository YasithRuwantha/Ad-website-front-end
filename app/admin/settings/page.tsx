"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration</p>
      </div>

      <div className="space-y-4">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Platform-wide configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Platform Name</label>
              <input
                type="text"
                placeholder="E-Commerce Platform"
                className="w-full mt-2 px-3 py-2 border border-primary/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
            <CardDescription>Configure platform commission rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Commission Rate (%)</label>
              <input
                type="number"
                placeholder="10"
                className="w-full mt-2 px-3 py-2 border border-primary/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
