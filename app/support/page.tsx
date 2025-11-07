"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import CreateTicketModal from "@/components/support/create-ticket-modal"
import { MessageSquare, Plus, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useRouter } from "next/navigation"

export default function SupportPage() {
  const { user } = useAuth()
  const { tickets, addTicket, replyToTicket } = useData()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const userTickets = tickets.filter((t) => t.userId === user?.id)
  const openTickets = userTickets.filter((t) => t.status === "open" || t.status === "in-progress")
  const resolvedTickets = userTickets.filter((t) => t.status === "resolved")


  const router = useRouter();
    const [isChecking, setIsChecking] = useState(true)
  
  
    useEffect(() => {
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) {
          router.push("/")
          return
        }
  
        const user = JSON.parse(storedUser)
  
        if (user.role !== "user") {
          router.push("/")
          return
        }
  
        setUserName(user.name || "User")
        setUserEmail(user.email || "")
        setIsChecking(false) // ✅ passed all checks
      } catch (err) {
        console.error("Error reading user data:", err)
        router.push("/")
      }
    }, [router])

  const handleCreateTicket = (subject: string, message: string) => {
    addTicket({
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || "",
      subject,
      message,
      status: "open",
      createdAt: new Date().toISOString(),
      replies: [],
    })
    setShowCreateModal(false)
  }

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET") // Replace with your preset
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) return data.secure_url
      setUploadError("Image upload failed.")
      return null
    } catch (err) {
      setUploadError("Image upload failed.")
      return null
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim() && !replyImage) return
    setIsUploading(true)
    setUploadError(null)
    let imageUrl: string | undefined = undefined
    if (replyImage) {
      imageUrl = await uploadToCloudinary(replyImage) || undefined
    }
    // @ts-ignore: update replyToTicket to accept imageUrl
    await replyToTicket(ticketId, replyText, false, imageUrl)
    setReplyText("")
    setReplyImage(null)
    setIsUploading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Profile */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-4 md:px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>

          {/* Profile Section */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Support 💬</h1>
          <p className="text-sm md:text-base text-gray-600">Get help and track your support tickets</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Create Ticket</span>
          <span className="md:hidden">New</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Total Tickets</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{userTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Open Tickets</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{openTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Resolved</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{resolvedTickets.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="bg-green-50 border border-green-200">
          <TabsTrigger
            value="open"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Open Tickets ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openTickets.length === 0 ? (
            <Card className="border-green-200">
              <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12 text-center">
                <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-green-600/30 mx-auto mb-3 md:mb-4" />
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">No open tickets</p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {openTickets.map((ticket) => (
                <Card key={ticket.id} className="border-green-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 md:pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base md:text-lg text-gray-900 mb-1">{ticket.subject}</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Created {new Date(ticket.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 md:px-3 py-1 rounded-full whitespace-nowrap ${
                          ticket.status === "open" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 pt-0">
                    <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-64 overflow-y-auto">
                      <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                        <p className="text-xs md:text-sm font-semibold text-gray-900 mb-1">You</p>
                        <p className="text-xs md:text-sm text-gray-900">{ticket.message}</p>
                        {ticket.imageUrl && (
                          <div className="mt-2 flex flex-col items-center">
                            <img
                              src={ticket.imageUrl}
                              alt="Ticket attachment"
                              className="max-h-64 mx-auto rounded-lg border border-green-200"
                            />
                            <p className="mt-2 text-xs text-green-600 font-medium">Image Attachment</p>
                          </div>
                        )}
                      </div>

                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-2 md:p-3 rounded-lg ${
                            reply.isAdmin ? "bg-blue-50 border border-blue-200" : "bg-muted"
                          }`}
                        >
                          <p className="text-xs md:text-sm font-semibold text-gray-900 mb-1">
                            {reply.isAdmin ? "Support Team" : "You"}
                          </p>
                          <p className="text-xs md:text-sm text-gray-900">{reply.message}</p>
                          {reply.imageUrl && (
                            <div className="mt-2 flex flex-col items-center">
                              <img
                                src={reply.imageUrl}
                                alt="Reply attachment"
                                className="max-h-64 mx-auto rounded-lg border border-green-200"
                              />
                              <p className="mt-2 text-xs text-green-600 font-medium">Image Attachment</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedTicket === ticket.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-sm border border-green-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => setReplyImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                            className="flex-1 border border-green-300 rounded-lg p-2"
                          />
                          <Button
                            onClick={() => handleReply(ticket.id)}
                            disabled={isUploading || (!replyText.trim() && !replyImage)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4"
                          >
                            {isUploading ? "Sending..." : "Send"}
                          </Button>
                        </div>
                        {replyImage && (
                          <div className="text-xs text-gray-700">Selected: {replyImage.name}</div>
                        )}
                        {uploadError && (
                          <div className="text-xs text-red-600">{uploadError}</div>
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedTicket(ticket.id)}
                        variant="outline"
                        className="w-full border-green-300 text-green-600 hover:bg-green-50 text-sm"
                      >
                        Reply
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {resolvedTickets.length === 0 ? (
            <Card className="border-green-200">
              <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12 text-center">
                <p className="text-sm md:text-base text-gray-600">No resolved tickets</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {resolvedTickets.map((ticket) => (
                <Card key={ticket.id} className="border-green-200 opacity-75 hover:opacity-100 hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base md:text-lg text-gray-900 mb-1">{ticket.subject}</CardTitle>
                        <CardDescription className="text-xs md:text-sm">Resolved {new Date(ticket.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-2 md:px-3 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                        Resolved
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs md:text-sm text-gray-900 line-clamp-2">{ticket.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateTicketModal open={showCreateModal} onOpenChange={setShowCreateModal} onSubmit={handleCreateTicket} />
      </div>
      </div>
    </div>
  )
}
