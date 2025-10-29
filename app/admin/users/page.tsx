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
  const { users, isLoading, fetchUsers, updateUser, deleteUser } = useUsers()

  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

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
    })
    setIsModalOpen(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedUser) return
    await updateUser(selectedUser._id, editData)
    setIsModalOpen(false)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and monitor all platform users
        </p>
      </div>

      {/* Referral Link */}
      <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-primary text-lg sm:text-xl">Share Your Referral Link</CardTitle>
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
              className="flex-1 px-4 py-2 bg-background border border-primary/30 rounded-lg text-foreground text-sm font-mono"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
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

      {/* User List */}
      <Card className="border-primary/20">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">Users</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View and manage user accounts
            </CardDescription>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm w-full sm:w-64"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading users...</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2 ${
                    u.status === "inactive" ? "bg-red-50" : "bg-background/50"
                  }`}
                >
                  <div className="text-sm sm:text-base">
                    <p className="font-semibold break-all">
                      {u.fullName} ({u.email})
                    </p>
                    <p className="text-muted-foreground">
                      Status: <span className="font-semibold">{u.status}</span>
                    </p>
                    <p className="text-muted-foreground">Phone: {u.phone}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal(u)}
                      className="w-full sm:w-auto"
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(u._id)}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transparent Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-90 p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-center">Edit User</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={editData.fullName || ""}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={editData.email || ""}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Phone"
              value={editData.phone || ""}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
            <select
              value={editData.status || ""}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} className="w-full sm:w-auto">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
