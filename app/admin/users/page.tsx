"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useState, useEffect } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUsers } from "@/lib/user-context"
import { useProducts } from "@/lib/products-context"


// Helper function to parse phone number and extract country info
const parsePhoneNumber = (phone: string) => {
  if (!phone) return { countryCode: "", number: "", country: "" }

interface Product {
  _id: string;
  name: string;
  description: string;
  rating: number;
  imageUrl: string;
  income: number;
  plan: string;
  isLuckyOrderProduct: boolean;
}
  
  const countryCodes = [
    { code: "+93", country: "Afghanistan" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Algeria" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaijan" },
    { code: "+973", country: "Bahrain" },
    { code: "+880", country: "Bangladesh" },
    { code: "+375", country: "Belarus" },
    { code: "+32", country: "Belgium" },
    { code: "+501", country: "Belize" },
    { code: "+229", country: "Benin" },
    { code: "+975", country: "Bhutan" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia" },
    { code: "+267", country: "Botswana" },
    { code: "+55", country: "Brazil" },
    { code: "+673", country: "Brunei" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Cambodia" },
    { code: "+237", country: "Cameroon" },
    { code: "+1", country: "Canada/USA" },
    { code: "+238", country: "Cape Verde" },
    { code: "+236", country: "CAR" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoros" },
    { code: "+506", country: "Costa Rica" },
    { code: "+385", country: "Croatia" },
    { code: "+53", country: "Cuba" },
    { code: "+357", country: "Cyprus" },
    { code: "+420", country: "Czech Rep" },
    { code: "+243", country: "DR Congo" },
    { code: "+45", country: "Denmark" },
    { code: "+253", country: "Djibouti" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egypt" },
    { code: "+503", country: "El Salvador" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Ethiopia" },
    { code: "+679", country: "Fiji" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Germany" },
    { code: "+233", country: "Ghana" },
    { code: "+30", country: "Greece" },
    { code: "+299", country: "Greenland" },
    { code: "+502", country: "Guatemala" },
    { code: "+224", country: "Guinea" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haiti" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungary" },
    { code: "+354", country: "Iceland" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Iran" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Ireland" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italy" },
    { code: "+225", country: "Ivory Coast" },
    { code: "+1876", country: "Jamaica" },
    { code: "+81", country: "Japan" },
    { code: "+962", country: "Jordan" },
    { code: "+7", country: "Kazakhstan/Russia" },
    { code: "+254", country: "Kenya" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kyrgyzstan" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Latvia" },
    { code: "+961", country: "Lebanon" },
    { code: "+266", country: "Lesotho" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libya" },
    { code: "+370", country: "Lithuania" },
    { code: "+352", country: "Luxembourg" },
    { code: "+853", country: "Macau" },
    { code: "+389", country: "Macedonia" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malawi" },
    { code: "+60", country: "Malaysia" },
    { code: "+960", country: "Maldives" },
    { code: "+223", country: "Mali" },
    { code: "+356", country: "Malta" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauritius" },
    { code: "+52", country: "Mexico" },
    { code: "+373", country: "Moldova" },
    { code: "+377", country: "Monaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+212", country: "Morocco" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Niger" },
    { code: "+234", country: "Nigeria" },
    { code: "+47", country: "Norway" },
    { code: "+968", country: "Oman" },
    { code: "+92", country: "Pakistan" },
    { code: "+970", country: "Palestine" },
    { code: "+507", country: "Panama" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Peru" },
    { code: "+63", country: "Philippines" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+974", country: "Qatar" },
    { code: "+242", country: "Rep. Congo" },
    { code: "+40", country: "Romania" },
    { code: "+250", country: "Rwanda" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+65", country: "Singapore" },
    { code: "+421", country: "Slovakia" },
    { code: "+386", country: "Slovenia" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "South Africa" },
    { code: "+82", country: "South Korea" },
    { code: "+211", country: "South Sudan" },
    { code: "+34", country: "Spain" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudan" },
    { code: "+597", country: "Suriname" },
    { code: "+268", country: "Swaziland" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+963", country: "Syria" },
    { code: "+886", country: "Taiwan" },
    { code: "+992", country: "Tajikistan" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Thailand" },
    { code: "+228", country: "Togo" },
    { code: "+216", country: "Tunisia" },
    { code: "+90", country: "Turkey" },
    { code: "+993", country: "Turkmenistan" },
    { code: "+971", country: "UAE" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ukraine" },
    { code: "+44", country: "UK" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistan" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabwe" },
  ]
  
  // Find matching country code (check longest codes first)
  const sortedCodes = countryCodes.sort((a, b) => b.code.length - a.code.length)
  for (const { code, country } of sortedCodes) {
    if (phone.startsWith(code)) {
      return {
        countryCode: code,
        number: phone.substring(code.length),
        country: country
      }
    }
  }
  
  return { countryCode: "", number: phone, country: "" }
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { transactions } = useData()
  const [copied, setCopied] = useState(false)
  const { users, isLoading, fetchUsers, updateUser, deleteUser, addRemainingAds, addToptup } = useUsers()
  const [adsAdjust, setAdsAdjust] = useState<number>(0)
  const [topup, setTopup] = useState<number>(0)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [luckyProducts, setLuckyProducts] = useState<Product[]>([]);
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false)
  const [selectedLuckyProduct, setSelectedLuckyProduct] = useState<Product | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  })

  const [editData, setEditData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    adsPerDay: "",
    luckydrawStatus: "",
    luckydrawAttempt: "",
    plan: "",
    luckyOrderId: "",
    topgradeStatus: ""
  })

  const openLuckyModal = () => {
  if (selectedUser && selectedUser.luckyOrderId) {
    const preSelected = luckyProducts.find(p => p._id === selectedUser.luckyOrderId)
    setSelectedLuckyProduct(preSelected || null)
  } else {
    setSelectedLuckyProduct(null)
  }
  setIsLuckyModalOpen(true)
}



  const { fetchLuckyOrderProducts } = useProducts()

  useEffect(() => {
    fetchLuckyOrderProducts().then((data) => {
      console.log("Fetched lucky products:", data) // log here
      setLuckyProducts(data)
    })
  }, [])


  useEffect(() => {
    console.log("topup change :", topup, adsAdjust)
  }, [topup, adsAdjust])

  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all") // <-- role filter

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users
    .filter(u => {
      const searchLower = search.toLowerCase();
      return (
        u.fullName?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        (u.tempId && u.tempId.toString().includes(search))
      );
    })
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
  
  // Initialize edit data
  setEditData({
    fullName: user.fullName,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    adsPerDay: user.adsPerDay,
    luckydrawStatus: user.luckydrawStatus,
    luckydrawAttempt: user.luckydrawAttempt,
    plan: user.plan,
    topup: user.topup,
    luckyOrderId: user.luckyOrderId,
    topgradeStatus: user.topgradeStatus
  })

  // ✅ Preselect Lucky Product if user has one
  if (user.luckyOrderId && luckyProducts.length > 0) {
    const preSelected = luckyProducts.find(p => p._id === user.luckyOrderId)
    setSelectedLuckyProduct(preSelected || null)
  } else {
    setSelectedLuckyProduct(null)
  }

  setAdsAdjust(0)
  setIsModalOpen(true)
  setMessage({ type: "", text: "" })
}


  const handleSaveChanges = async () => {
    if (!selectedUser) return
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      console.log("bofore send :", editData)
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


  const adjustTopup = async (amount: number) => {
    if (!selectedUser) return
    if (!topup || topup <= 0) {
      setMessage({ type: "error", text: "Enter a valid number" })
      return
    }
    
    try {
      await addToptup(
        selectedUser._id,
        amount > 0 ? topup : -topup,
      )

      setSelectedUser({
        ...selectedUser,
        balance: Math.max((selectedUser.balance || 0) + amount, 0),
      })
      setMessage({ type: "success", text: amount > 0 ? `✅ Added ${topup} topup!` : `✅ Removed ${topup} topup!` })
      setTopup(0)
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

      {/* Referral Link - only for Admins
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
      )} */}

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
          <div className="hidden sm:grid grid-cols-7 gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
            <div>Name (Email)</div>
            <div>Username</div>
            <div>Status</div>
            <div>Phone</div>
            <div>Ads/Day</div>
            <div>Promo Code</div>
            <div>Actions</div>
          </div>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground">No users found.</p>
          ) : (
            filteredUsers.map(u => (
              <div key={u._id} className="sm:grid sm:grid-cols-7 gap-4 items-center border-b py-2">
                <div>
                  <span className="font-semibold break-all">{u.fullName} ({u.email})</span>
                </div>
                <div>{u.username || '-'}</div>
                <div>{u.status}</div>
                <div>{(() => {
                  const { countryCode, number, country } = parsePhoneNumber(u.phone)
                  return country 
                    ? <span><span className="font-semibold text-green-600">{countryCode}</span> {number} <span className="text-xs text-gray-500">({country})</span></span>
                    : u.phone
                })()}</div>
                <div>{u.adsPerDay || 0}</div>
                <div>{u.promoCode || '-'}</div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <Button size="sm" variant="outline" onClick={() => openModal(u)} className="w-full sm:w-auto">Update</Button>
                  <Button size="sm" variant="destructive" onClick={() => { if (window.confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) { deleteUser(u._id) } }} className="w-full sm:w-auto">Delete</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white p-1 sm:p-6 rounded-xl w-full max-w-xs sm:max-w-xl space-y-2 sm:space-y-6 shadow-2xl border border-green-200 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto max-h-[90vh] sm:max-h-[98vh] min-h-[60vh] sm:min-h-0">
            <h2 className="text-base sm:text-2xl font-bold text-center text-green-700 mb-1 sm:mb-4 tracking-tight">Edit User</h2>
            <form className="space-y-2 sm:space-y-4 text-xs sm:text-sm">
              {/* Personal Info Section */}
              <div className="mb-2 p-2 sm:p-3 rounded-lg bg-gray-50 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="sm:col-span-2 flex flex-row items-center gap-2 sm:gap-3">
                  <label className="block text-xs font-semibold text-gray-600 min-w-[80px] sm:min-w-[100px] text-right">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="flex-1 max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5 self-start">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5 self-start">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5 self-start">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="w-full max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5 self-start">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label className="block text-xs font-semibold text-gray-600 mb-0.5 self-start">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full max-w-xs px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="mt-4 sm:mt-6 mb-2 p-2 sm:p-4 rounded-xl bg-green-50 border border-green-200 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Account Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Account Plan</label>
                  <select
                    value={editData.plan}
                    onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
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
                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Luckydraw Status</label>
                  <select
                    value={editData.luckydrawStatus}
                    onChange={(e) => setEditData({ ...editData, luckydrawStatus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">top grade Status</label>
                  <select
                    value={editData.topgradeStatus}
                    onChange={(e) => setEditData({ ...editData, topgradeStatus: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Lucky Draw Trigger</label>
                  <input
                    type="number"
                    min={1}
                    value={editData.luckydrawAttempt || ""}
                    onChange={(e) => setEditData({ ...editData, luckydrawAttempt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                    placeholder="Enter attempts needed"
                  />
                </div>


                <div>
                  <label className="block text-xs font-semibold text-green-700 mb-1">Lucky Order Product</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsLuckyModalOpen(true)}
                    >
                      Select Lucky Product
                    </Button>
                    <span className="text-sm text-gray-700">
                      {selectedLuckyProduct ? selectedLuckyProduct.name : "None selected"}
                    </span>
                  </div>
                </div>




                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-green-700 mb-1">Attempts per day</label>
                  <select
                    value={editData.adsPerDay}
                    onChange={(e) => setEditData({ ...editData, adsPerDay: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  >
                    <option value={0}>0 Ads / Day</option>
                    <option value={30}>30 Ads / Day</option>
                    <option value={50}>50 Ads / Day</option>
                    <option value={100}>100 Ads / Day</option>
                  </select>
                </div>
              </div>

              {/* Remaining Ads */}
              <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Manage Remaining Ads</label>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Current Remaining Ads:</span>
                  <span className="font-bold text-green-700 text-base">{selectedUser.remaining || 0}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="number"
                    min={1}
                    placeholder="Enter number"
                    value={adsAdjust || ""}
                    onChange={(e) => setAdsAdjust(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to add ${adsAdjust} ads to this user?`)) {
                        adjustAds(adsAdjust)
                      }
                    }}
                  >
                    ➕ Add
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${adsAdjust} ads from this user?`)) {
                        adjustAds(-adsAdjust)
                      }
                    }}
                  >
                    ➖ Remove
                  </Button>
                </div>
              </div>

              {/* Topup customser Account */}
              <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Topup Customer Account</label>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Current Acoount balance:</span>
                  <span className="font-bold text-green-700 text-base">{selectedUser.balance || 0}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="number"
                    min={1}
                    placeholder="Enter topup number"
                    value={topup || ""}
                    onChange={(e) => setTopup(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-200"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to add ${topup} to this user's topup?`)) {
                        adjustTopup(topup)
                      }
                    }}
                  >
                    ➕ Add
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${topup} from this user's topup?`)) {
                        adjustTopup(-topup)
                      }
                    }}
                  >
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
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-3 sm:mt-4 w-full">
                <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto min-w-[100px] sm:min-w-[120px] bg-green-600 hover:bg-green-700 text-white">
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="w-full sm:w-auto min-w-[100px] sm:min-w-[120px]">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

     {isLuckyModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-4 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
      <h3 className="text-lg font-bold text-green-700 text-center mb-2">Select Lucky Product</h3>
      
      {/* Scrollable product list */}
      <div className="overflow-y-auto max-h-[60vh] space-y-3">
        {luckyProducts.map((product) => (
          <div
            key={product._id}
            className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer ${
              selectedLuckyProduct?._id === product._id ? "bg-green-100 border-green-400" : "bg-white border-gray-200"
            }`}
            onClick={() => setSelectedLuckyProduct(product)}
          >
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">{product.name}</p>
              <p className="text-gray-500">Plan: {product.plan}</p>
              <p className="text-gray-500">Income: ${product.income}</p>
            </div>
            {selectedLuckyProduct?._id === product._id && (
              <Check className="text-green-600" />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-2">
        <Button type="button" variant="secondary" onClick={() => setIsLuckyModalOpen(false)}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="green"
          onClick={() => {
            if (selectedLuckyProduct) {
              setEditData({ ...editData, luckyOrderId: selectedLuckyProduct._id })
              setIsLuckyModalOpen(false)
            }
          }}
        >
          Select
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
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-2 mt-2 ${
      user.status === "inactive" ? "bg-red-50" : "bg-background/50"
    }`}
  >
    <div className="text-sm sm:text-base space-y-1">
      <p className="font-semibold break-all">{user.fullName} ({user.email})</p>
      {(user.firstName || user.lastName) && (
        <p className="text-muted-foreground text-xs">
          Name: <span className="font-semibold">{user.firstName} {user.lastName}</span>
        </p>
      )}
      {user.username && (
        <p className="text-muted-foreground text-xs">
          Username: <span className="font-semibold">{user.username}</span>
        </p>
      )}
      {user.promoCode && (
        <p className="text-muted-foreground text-xs">
          Promo Code: <span className="font-semibold">{user.promoCode}</span>
        </p>
      )}
      <p className="text-muted-foreground">
        Status: <span className="font-semibold">{user.status}</span>
      </p>
      <p className="text-muted-foreground">
        Phone: {(() => {
          const { countryCode, number, country } = parsePhoneNumber(user.phone)
          return country 
            ? <span><span className="font-semibold text-green-600">{countryCode}</span> {number} <span className="text-xs text-gray-500">({country})</span></span>
            : user.phone
        })()}
      </p>
      <p className="text-muted-foreground">
        Ads per day: <span className="font-semibold">{user.adsPerDay || 0}</span>
      </p>
    </div>
    <div className="flex gap-2 flex-wrap sm:flex-nowrap mt-2 sm:mt-0">
      <Button size="sm" variant="outline" onClick={() => openModal(user)} className="w-full sm:w-auto">
        Update
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete this user? This action cannot be undone.`)) {
            deleteUser(user._id)
          }
        }}
        className="w-full sm:w-auto"
      >
        Delete
      </Button>
    </div>
  </div>
)
