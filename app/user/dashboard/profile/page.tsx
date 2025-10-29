"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Edit2 } from "lucide-react"
import { useState } from "react"

export default function UserProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  })

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm" className="border-primary/20">
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <img
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-2 border-primary/20"
            />
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                />
              ) : (
                <h3 className="text-2xl font-bold text-foreground">{user?.name}</h3>
              )}
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Contact Information</h4>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-1 border border-primary/20 rounded text-foreground"
                  />
                ) : (
                  <p className="text-foreground">{user?.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Address</h4>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Street Address</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-1 border border-primary/20 rounded text-foreground"
                    />
                  ) : (
                    <p className="text-foreground">{user?.address || "Not provided"}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-primary/20 rounded text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{user?.city || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-1 border border-primary/20 rounded text-foreground"
                      />
                    ) : (
                      <p className="text-foreground">{user?.country || "Not provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {user?.plan.charAt(0).toUpperCase() + user?.plan.slice(1)}
              </p>
              <p className="text-xs text-muted-foreground">Current Plan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${user?.balance.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Balance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user?.referralCode}</p>
              <p className="text-xs text-muted-foreground">Referral Code</p>
            </div>
          </div>

          {isEditing && (
            <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
