"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage platform configuration</p>
      </div>

      <div className="space-y-4">
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Platform-wide configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Platform Name</label>
              <input
                type="text"
                placeholder="E-Commerce Platform"
                className="w-full mt-2 px-3 py-2 border-2 border-green-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
            <CardDescription>Configure platform commission rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900">Commission Rate (%)</label>
              <input
                type="number"
                placeholder="10"
                className="w-full mt-2 px-3 py-2 border-2 border-green-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
