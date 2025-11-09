"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, User as UserIcon, Calendar, FileText, Users } from "lucide-react"
import { useState, useEffect } from "react"

interface UserProfile {
  _id: string
  fullName: string
  firstName?: string
  lastName?: string
  username?: string
  email: string
  role: string
  phone: string
  status: string
  referrals: string
  adsPerDay: number
  remaining: number
  referrelBy?: string
  createdAt: string
  tempId?: number
}

export default function UserProfilePage() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // Fetch user profile from backend
  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/user`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await res.json()
      setProfile(data)
      setFormData({
        fullName: data.fullName || "",
        phone: data.phone || "",
      })
    } catch (err) {
      console.error("Failed to load profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!profile) return

    try {
      setIsSaving(true)
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/user/${profile._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      const updated = await res.json()
      setProfile(updated)
      setIsEditing(false)

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      storedUser.fullName = updated.fullName
      localStorage.setItem("user", JSON.stringify(storedUser))
    } catch (err) {
      console.error("Failed to update profile:", err)
      alert("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-primary/20">
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">{profile.fullName || "Not set"}</p>
                </div>
              )}
            </div>

            {/* Temp ID (read-only, always visible) */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium">{profile.tempId || "-"}</p>
              </div>
            </div>

            {(profile.firstName || profile.lastName) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <p className="font-medium">{profile.firstName || "Not set"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <p className="font-medium">{profile.lastName || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {profile.username && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">@{profile.username}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Contact Information</h4>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <p className="text-foreground">{profile.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mt-1">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <p className="text-foreground">{profile.phone || "Not set"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-primary/20">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Referrals</p>
              </div>
              <p className="text-2xl font-bold text-primary">{profile.referrals || "0"}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-green-600" />
                <p className="text-sm text-muted-foreground">Remaining Ads</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{profile.remaining || 0}</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-muted-foreground">Ads Per Day</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{profile.adsPerDay || 0}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="pt-4 border-t border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Account Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                profile.status === "active"
                  ? "bg-green-100 text-green-700"
                  : profile.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {profile.status?.charAt(0).toUpperCase() + profile.status?.slice(1) || "Pending"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
