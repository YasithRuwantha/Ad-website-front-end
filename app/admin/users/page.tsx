"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/lib/user-context"

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { transactions } = useData()
  const [copied, setCopied] = useState(false)
  const { users, isLoading, fetchUsers, updateUser, deleteUser, addRemainingAds } = useUsers()

  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  })

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    adsPerDay: "",
    luckydrawStatus: "",
    luckydrawAttempt: "",
    plan: ""
  })

  const [adsAdjust, setAdsAdjust] = useState<number>(0)

  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all") // <-- role filter

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users
    .filter(u =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(u => roleFilter === "all" ? true : u.role === roleFilter) // <-- filter by role

  const userString = localStorage.getItem("user")
  const usertemp = userString ? JSON.parse(userString) : null
  const userEmail = usertemp?.email || ""
  const referralLink = `http://www.adsales.com/signup?ref=${userEmail}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openModal = (user: any) => {
    setSelectedUser(user)
    setEditData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      adsPerDay: user.adsPerDay,
      luckydrawStatus: user.luckydrawStatus,
      luckydrawAttempt: user.luckydrawAttempt,
      plan: user.plan
    })
    setAdsAdjust(0)
    setIsModalOpen(true)
    setMessage({ type: "", text: "" }) // clear previous messages
  }

  const handleSaveChanges = async () => {
    if (!selectedUser) return
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      await updateUser(selectedUser._id, editData)
      setMessage({ type: "success", text: "✅ User updated successfully!" })
      setTimeout(() => setIsModalOpen(false), 1500)
      fetchUsers()
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "❌ Failed to update user. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const adjustAds = async (amount: number) => {
    if (!selectedUser) return
    if (!adsAdjust || adsAdjust <= 0) {
      setMessage({ type: "error", text: "Enter a valid number" })
      return
    }

    try {
      await addRemainingAds(
        selectedUser._id,
        amount > 0 ? adsAdjust : -adsAdjust,
        editData.luckydrawAttempt // ✅ send this too
      )

      setSelectedUser({
        ...selectedUser,
        remaining: Math.max((selectedUser.remaining || 0) + amount, 0),
      })
      setMessage({ type: "success", text: amount > 0 ? `✅ Added ${adsAdjust} ads!` : `✅ Removed ${adsAdjust} ads!` })
      setAdsAdjust(0)
      fetchUsers()
    } catch (err) {
      console.error(err)
      setMessage({ type: "error", text: "❌ Failed to update ads." })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Manage and monitor all platform users
        </p>
      </div>

      {/* Referral Link - only for Admins */}
      {user?.role === "admin" && (
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-100 to-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 text-lg sm:text-xl">Share Your Referral Link</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Share this link with friends to earn $10 for each successful signup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-green-300 rounded-lg text-gray-900 text-sm font-mono"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Filter Buttons */}
      <div className="flex gap-2">
        <Button 
          variant={roleFilter === "all" ? "default" : "outline"} 
          onClick={() => setRoleFilter("all")}
          className={roleFilter === "all" ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-300 text-gray-700 hover:bg-green-50"}
        >
          All
        </Button>
        <Button 
          variant={roleFilter === "user" ? "default" : "outline"} 
          onClick={() => setRoleFilter("user")}
          className={roleFilter === "user" ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-300 text-gray-700 hover:bg-green-50"}
        >
          Users
        </Button>
        <Button 
          variant={roleFilter === "admin" ? "default" : "outline"} 
          onClick={() => setRoleFilter("admin")}
          className={roleFilter === "admin" ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-300 text-gray-700 hover:bg-green-50"}
        >
          Admins
        </Button>
      </div>

      {/* User List */}
      <Card className="border-2 border-green-200">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">Accounts</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View and manage user accounts
            </CardDescription>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-green-300 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground">No users found.</p>
          ) : (
            filteredUsers.map(u => (
              <UserRow key={u._id} user={u} openModal={openModal} deleteUser={deleteUser} />
            ))
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-center">Edit User</h2>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Full Name"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Phone"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />

              <div className="flex items-center">
                <div className="pl-1 w-full">Account Status</div>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="pl-1 w-full">Account Plan</div>
                <select
                  value={editData.plan}
                  onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="none">none</option>
                  <option value="Starter">Starter  ($100)</option>
                  <option value="Basic">Basic  ($300)</option>
                  <option value="Beginner">Beginner  ($500)</option>
                  <option value="Advanced">Advanced  ($1,000)</option>
                  <option value="Professional">Professional  ($1,500)</option>
                  <option value="Premium">Premium  ($2,000)</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="pl-1 w-full">Luckydraw Status</div>
                <select
                  value={editData.luckydrawStatus}
                  onChange={(e) => setEditData({ ...editData, luckydrawStatus: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center">
                <div className="pl-1 w-full">Lucky Draw Trigger</div>
                <input
                  type="number"
                  min={1}
                  value={editData.luckydrawAttempt || ""}
                  onChange={(e) => setEditData({ ...editData, luckydrawAttempt: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Enter attempts needed"
                />
              </div>


              <div className="flex items-center">
                <div className="pl-1 w-full">Attempts per day</div>
                <select
                  value={editData.adsPerDay}
                  onChange={(e) => setEditData({ ...editData, adsPerDay: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value={0}>0 Ads / Day</option>
                  <option value={30}>30 Ads / Day</option>
                  <option value={50}>50 Ads / Day</option>
                  <option value={100}>100 Ads / Day</option>
                </select>
              </div>
            </div>

            {/* Remaining Ads */}
            <div className="border-t pt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Manage Remaining Ads</label>
              <p className="text-sm text-gray-600">
                Current Remaining Ads: <span className="font-semibold">{selectedUser.remaining || 0}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Enter number"
                  value={adsAdjust || ""}
                  onChange={(e) => setAdsAdjust(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => adjustAds(adsAdjust)}>
                  ➕ Add
                </Button>
                <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={() => adjustAds(-adsAdjust)}>
                  ➖ Remove
                </Button>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <p className={`text-center text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.text}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// User Row Component
const UserRow = ({ user, openModal, deleteUser }: any) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2 ${
      user.status === "inactive" ? "bg-red-50" : "bg-background/50"
    }`}
  >
    <div className="text-sm sm:text-base space-y-1">
      <p className="font-semibold break-all">{user.fullName} ({user.email})</p>
      <p className="text-muted-foreground">
        Status: <span className="font-semibold">{user.status}</span>
      </p>
      <p className="text-muted-foreground">Phone: {user.phone}</p>
      <p className="text-muted-foreground">
        Ads per day: <span className="font-semibold">{user.adsPerDay || 0}</span>
      </p>
    </div>
    <div className="flex gap-2 flex-wrap sm:flex-nowrap mt-2 sm:mt-0">
      <Button size="sm" variant="outline" onClick={() => openModal(user)} className="w-full sm:w-auto">
        Update
      </Button>
      <Button size="sm" variant="destructive" onClick={() => deleteUser(user._id)} className="w-full sm:w-auto">
            {/* <Button size="sm" variant="destructive" onClick={() => console.log("deleting user: ", user._id)} className="w-full sm:w-auto"> */}

        Delete
      </Button>
    </div>
  </div>
)
