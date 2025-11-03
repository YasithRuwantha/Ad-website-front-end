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

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return
    replyToTicket(ticketId, replyText, false)
    setReplyText("")
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
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-gray-900 hidden md:block">EarningHub</span>
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

      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Support</h1>
          <p className="text-muted-foreground">Get help and track your support tickets</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-foreground">{userTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-primary">{openTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{resolvedTickets.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="bg-primary/10 border border-primary/20">
          <TabsTrigger
            value="open"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Open Tickets ({openTickets.length})
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Resolved ({resolvedTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openTickets.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <MessageSquare className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No open tickets</p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create Your First Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {openTickets.map((ticket) => (
                <Card key={ticket.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{ticket.subject}</CardTitle>
                        <CardDescription>Created {new Date(ticket.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          ticket.status === "open" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-semibold text-foreground mb-1">You</p>
                        <p className="text-sm text-foreground">{ticket.message}</p>
                      </div>

                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-lg ${
                            reply.isAdmin ? "bg-secondary/10 border border-secondary/30" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm font-semibold text-foreground mb-1">
                            {reply.isAdmin ? "Support Team" : "You"}
                          </p>
                          <p className="text-sm text-foreground">{reply.message}</p>
                        </div>
                      ))}
                    </div>

                    {selectedTicket === ticket.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 px-3 py-2 border border-primary/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button
                          onClick={() => handleReply(ticket.id)}
                          disabled={!replyText.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Send
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedTicket(ticket.id)}
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
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
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No resolved tickets</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resolvedTickets.map((ticket) => (
                <Card key={ticket.id} className="border-primary/20 opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{ticket.subject}</CardTitle>
                        <CardDescription>Resolved {new Date(ticket.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                        Resolved
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground line-clamp-2">{ticket.message}</p>
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
