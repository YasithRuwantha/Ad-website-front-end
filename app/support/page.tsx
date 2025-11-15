"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CreateTicketModal from "@/components/support/create-ticket-modal"
import { MessageSquare, Plus, User, ChevronDown, LogOut, Settings, MessageCircle } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useRouter } from "next/navigation"

export default function SupportPage({ isFloatingChat = false, hideTitle = false }: { isFloatingChat?: boolean, hideTitle?: boolean } = {}) {
  const { user } = useAuth()
  const { tickets, addTicket, replyToTicket } = useData()
  // Polling for real-time chat updates
  useEffect(() => {
    const interval = setInterval(() => {
      // This will trigger the useEffect in data-context to reload tickets
      window.dispatchEvent(new Event("refresh-support-tickets"));
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);
  const [replyText, setReplyText] = useState("")
  const [firstMessage, setFirstMessage] = useState("")
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [unread, setUnread] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const [showChatModal, setShowChatModal] = useState(false)

  // There is only one support chat per user
  const supportTicket = tickets.find((t) => t.userId === user?.id)


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
      } catch (err) {
        console.error("Error reading user data:", err)
        router.push("/")
      }
    }, [router])

    // Unread logic: if the latest reply is from admin and not seen, show unread
    useEffect(() => {
      if (!supportTicket) return;
      const lastReply = supportTicket.replies[supportTicket.replies.length - 1];
      if (lastReply && lastReply.isAdmin) {
        setUnread(true);
      } else {
        setUnread(false);
      }
    }, [supportTicket]);

    // Mark as read when user scrolls to bottom or opens chat
    useEffect(() => {
      if (unread && chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
        setUnread(false);
      }
    }, [unread]);

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


  const handleReply = async (ticketId: string) => {
    if (!replyText.trim() && !replyImage) return
    setIsUploading(true)
    setUploadError(null)
    // Always pass isAdmin: false for user replies
    await replyToTicket(ticketId, replyText, false, replyImage || undefined)
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
    <div className={isFloatingChat ? "flex flex-col h-full bg-background" : "flex flex-col md:flex-row h-screen bg-background"}>
      {/* Sidebar — fixed on mobile, static on desktop */}
      {!isFloatingChat && <UserSidebar />}

      <div className={isFloatingChat ? "flex-1 flex flex-col overflow-hidden" : "flex-1 flex flex-col overflow-hidden"}>
        {/* Top Header with Profile */}
        {!isFloatingChat && (
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
        )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">

      {!hideTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Support 💬</h1>
            {unread && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse"></span>
            )}
          </div>
          {/* No create ticket button since only one chat */}
        </div>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
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
      </div> */}

      {/* Only show chat modal if not floating, otherwise always show chat content */}
      {isFloatingChat ? (
        <div className="flex flex-col h-[80vh] w-[380px] sm:w-[420px] bg-white rounded-3xl overflow-hidden">
          <div className="px-6 pt-6 pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Customer Support Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
            {supportTicket ? (
              <div className="flex flex-col gap-2 pb-2" style={{ minHeight: 0 }}>
                {/* Customer message bubble */}
                <div className="flex w-full justify-end">
                  <div className="bg-[#008060] text-white rounded-2xl rounded-br-sm px-3 md:px-4 py-1.5 md:py-2 shadow mb-1 w-fit max-w-[75vw] md:max-w-md">
                    <div className="text-xs md:text-sm font-semibold mb-0.5 md:mb-1 text-right">You</div>
                    {supportTicket.message && (
                      <div className="text-xs md:text-sm break-words">{supportTicket.message}</div>
                    )}
                    {supportTicket.imageUrl && (
                      <div className="mt-1 md:mt-2 flex flex-col items-end">
                        <a href={supportTicket.imageUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={supportTicket.imageUrl}
                            alt="Ticket attachment"
                            className="max-h-40 md:max-h-64 rounded-lg border border-[#36c160] cursor-pointer hover:opacity-90 transition"
                          />
                        </a>
                        <span className="mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-[#008060]">Image Attachment</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Replies as chat bubbles */}
                {supportTicket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`flex w-full ${reply.isAdmin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-2xl shadow mb-1 w-fit break-words max-w-[75vw] md:max-w-md ${
                        reply.isAdmin
                          ? "bg-white border-blue-200 text-blue-700 border" // Remove border if you want no border at all
                          : "bg-[#008060] text-white"
                      } ${reply.isAdmin ? "rounded-br-sm" : "rounded-br-sm"}`}
                    >
                      <div className={`text-xs md:text-sm font-semibold mb-0.5 md:mb-1 ${reply.isAdmin ? "text-blue-700 text-left" : "text-white text-right"}`}>
                        {reply.isAdmin ? "Support Team" : "You"}
                      </div>
                      {reply.message && (
                        <div className="text-xs md:text-sm">{reply.message}</div>
                      )}
                      {reply.imageUrl && (
                        <div className={`mt-1 md:mt-2 flex flex-col ${reply.isAdmin ? "items-start" : "items-end"}`}>
                          <a href={reply.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={reply.imageUrl}
                              alt="Reply attachment"
                              className="max-h-40 md:max-h-64 rounded-lg border border-[#36c160] cursor-pointer hover:opacity-90 transition"
                            />
                          </a>
                          <span className={`mt-0.5 md:mt-1 text-[9px] md:text-[10px] ${reply.isAdmin ? 'text-blue-400' : 'text-green-100'}`}>Image Attachment</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <MessageCircle className="w-12 h-12 text-green-600/60 mb-4" />
                <p className="text-base md:text-lg text-gray-700 mb-4">Start a conversation with our support team</p>
                <input
                  type="text"
                  placeholder="Type your message to start..."
                  value={firstMessage}
                  onChange={e => setFirstMessage(e.target.value)}
                  className="w-full max-w-xs px-3 py-2 mb-4 border border-gray-300 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008060] bg-white"
                />
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold shadow-md"
                  onClick={() => {
                    if (!firstMessage.trim()) return;
                    addTicket({
                      id: Math.random().toString(36).substr(2, 9),
                      userId: user?.id || "",
                      subject: "Customer Support",
                      message: firstMessage,
                      status: "open",
                      createdAt: new Date().toISOString(),
                      replies: [],
                    });
                    setFirstMessage("");
                  }}
                  disabled={!firstMessage.trim()}
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                </Button>
              </div>
            )}
            {/* Reply input for chatable modal, always at bottom */}
            <div className="w-full px-2 md:px-4 pb-2 bg-[#f6f7f8] border-t border-[#e1e3e4] mt-2 sticky bottom-0">
              <div className="flex flex-col gap-2 w-full pt-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 text-sm border border-[#e1e3e4] rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008060] bg-white"
                />
                <div className="flex flex-row gap-2 w-full items-stretch">
                  <div className="relative flex items-center justify-center">
                    <input
                      id={`file-upload-user-modal-${supportTicket?.id || 'new'}`}
                      type="file"
                      accept="image/*"
                      onChange={e => setReplyImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer z-10"
                      tabIndex={-1}
                    />
                    <button
                      type="button"
                      aria-label="Attach photo"
                      onClick={() => document.getElementById(`file-upload-user-modal-${supportTicket?.id || 'new'}`)?.click()}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-[#008060] text-[#008060] hover:bg-[#e3f1eb] active:bg-[#d1ede3] shadow transition focus:outline-none focus:ring-2 focus:ring-[#008060]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M21 19l-5.5-7-4.5 6-3-4L3 19" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    </button>
                  </div>
                  {replyImage && (
                    <span className="text-xs text-gray-700 truncate max-w-[100px] self-center">{replyImage.name}</span>
                  )}
                  <div className="flex flex-1 flex-row justify-end items-end gap-2">
                    <Button
                      onClick={() => handleReply(supportTicket?.id || '')}
                      disabled={isUploading || (!replyText.trim() && !replyImage)}
                      className="bg-[#008060] hover:bg-[#36c160] text-white px-4 py-2 min-w-[60px] rounded-full shadow-none"
                    >
                      {isUploading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
              {replyImage && (
                <div className="text-xs text-gray-700 pt-1">Selected: {replyImage.name}</div>
              )}
              {uploadError && (
                <div className="text-xs text-red-600 pt-1">{uploadError}</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center min-h-[80vh] w-full">
            <div
              className="w-full max-w-4xl min-h-[400px] cursor-pointer border-4 border-[#008060] bg-[#f6f7f8] rounded-3xl shadow-2xl p-16 flex flex-col items-center justify-center hover:shadow-3xl transition-all duration-200"
              onClick={() => setShowChatModal(true)}
            >
              <MessageCircle className="w-24 h-24 text-green-600 mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
                {supportTicket ? "Open Support Chat" : "Start Support Chat"}
              </h2>
              <p className="text-2xl text-gray-700 mb-4 text-center max-w-2xl">
                {supportTicket ? "Continue your conversation with our support team." : "Start a new conversation with our support team."}
              </p>
              <span className="text-xl font-semibold text-[#008060] mt-4">Click to chat</span>
            </div>
          </div>
          <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
            <DialogContent className="max-w-4xl w-full min-h-[600px]">
              <DialogHeader>
                <DialogTitle>Customer Support Chat</DialogTitle>
              </DialogHeader>
              {supportTicket ? (
                <div className="flex flex-col max-h-[70vh]">
                  <div className="flex-1 overflow-y-auto mb-2">
                    <div>
                      <div className="flex flex-col gap-2">
                        {/* Customer message bubble */}
                        <div className="flex w-full justify-end">
                          <div className="flex flex-col items-end w-fit max-w-[75vw] md:max-w-md">
                            <div className="bg-[#008060] text-white rounded-2xl rounded-br-sm px-3 md:px-4 py-1.5 md:py-2 shadow mb-1 w-fit">
                              <div className="text-xs md:text-sm font-semibold mb-0.5 md:mb-1 text-right">You</div>
                              {supportTicket.message && (
                                <div className="text-xs md:text-sm break-words">{supportTicket.message}</div>
                              )}
                              {supportTicket.imageUrl && (
                                <div className="mt-1 md:mt-2 flex flex-col items-end">
                                  <a href={supportTicket.imageUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={supportTicket.imageUrl}
                                      alt="Ticket attachment"
                                      className="max-h-40 md:max-h-64 rounded-lg border border-[#36c160] cursor-pointer hover:opacity-90 transition"
                                    />
                                  </a>
                                  <span className="mt-0.5 md:mt-1 text-[9px] md:text-[10px] text-[#008060]">Image Attachment</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Replies as chat bubbles */}
                        {supportTicket.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`flex w-full ${reply.isAdmin ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`flex flex-col ${reply.isAdmin ? "items-start" : "items-end"} w-fit max-w-[75vw] md:max-w-md`}>
                              <div
                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-2xl shadow mb-1 w-fit break-words ${
                                  reply.isAdmin
                                    ? "bg-white border border-blue-200 text-gray-900 rounded-br-sm"
                                    : "bg-[#008060] text-white rounded-br-sm"
                                }`}
                              >
                                <div className={`text-xs md:text-sm font-semibold mb-0.5 md:mb-1 ${reply.isAdmin ? "text-blue-700 text-left" : "text-white text-right"}`}>
                                  {reply.isAdmin ? "Support Team" : "You"}
                                </div>
                                {reply.message && (
                                  <div className="text-xs md:text-sm">{reply.message}</div>
                                )}
                                {reply.imageUrl && (
                                  <div className={`mt-1 md:mt-2 flex flex-col ${reply.isAdmin ? "items-start" : "items-end"}`}>
                                    <a href={reply.imageUrl} target="_blank" rel="noopener noreferrer">
                                      <img
                                        src={reply.imageUrl}
                                        alt="Reply attachment"
                                        className="max-h-40 md:max-h-64 rounded-lg border border-[#36c160] cursor-pointer hover:opacity-90 transition"
                                      />
                                    </a>
                                    <span className={`mt-0.5 md:mt-1 text-[9px] md:text-[10px] ${reply.isAdmin ? 'text-blue-400' : 'text-green-100'}`}>Image Attachment</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Reply input for chatable modal */}
                  <div className="w-full px-2 md:px-4 pb-2 bg-[#f6f7f8] rounded-b-2xl border-t border-[#e1e3e4]">
                    <div className="flex flex-col gap-2 w-full pt-2">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full min-w-0 px-3 py-2 text-sm border border-[#e1e3e4] rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008060] bg-white"
                      />
                      <div className="flex flex-row gap-2 w-full items-stretch">
                        <div className="relative flex items-center justify-center">
                          <input
                            id={`file-upload-user-modal-${supportTicket.id}`}
                            type="file"
                            accept="image/*"
                            onChange={e => setReplyImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                            className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer z-10"
                            tabIndex={-1}
                          />
                          <button
                            type="button"
                            aria-label="Attach photo"
                            onClick={() => document.getElementById(`file-upload-user-modal-${supportTicket.id}`)?.click()}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-[#008060] text-[#008060] hover:bg-[#e3f1eb] active:bg-[#d1ede3] shadow transition focus:outline-none focus:ring-2 focus:ring-[#008060]"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                              <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                              <path d="M21 19l-5.5-7-4.5 6-3-4L3 19" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                          </button>
                        </div>
                        {replyImage && (
                          <span className="text-xs text-gray-700 truncate max-w-[100px] self-center">{replyImage.name}</span>
                        )}
                        <div className="flex flex-1 flex-row justify-end items-end gap-2">
                          <Button
                            onClick={() => handleReply(supportTicket.id)}
                            disabled={isUploading || (!replyText.trim() && !replyImage)}
                            className="bg-[#008060] hover:bg-[#36c160] text-white px-4 py-2 min-w-[60px] rounded-full shadow-none"
                          >
                            {isUploading ? "Sending..." : "Send"}
                          </Button>
                          <Button
                            onClick={() => {
                              setReplyText("")
                              setReplyImage(null)
                              setShowChatModal(false)
                            }}
                            variant="outline"
                            className="rounded-full border border-[#e1e3e4] px-4 py-2 min-w-[60px]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                    {replyImage && (
                      <div className="text-xs text-gray-700 pt-1">Selected: {replyImage.name}</div>
                    )}
                    {uploadError && (
                      <div className="text-xs text-red-600 pt-1">{uploadError}</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <MessageCircle className="w-12 h-12 text-green-600/60 mb-4" />
                  <p className="text-base md:text-lg text-gray-700 mb-4">Start a conversation with our support team</p>
                  <input
                    type="text"
                    placeholder="Type your message to start..."
                    value={firstMessage}
                    onChange={e => setFirstMessage(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 mb-4 border border-gray-300 rounded-full text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008060] bg-white"
                  />
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3 rounded-full text-base font-semibold shadow-md"
                    onClick={() => {
                      if (!firstMessage.trim()) return;
                      addTicket({
                        id: Math.random().toString(36).substr(2, 9),
                        userId: user?.id || "",
                        subject: "Customer Support",
                        message: firstMessage,
                        status: "open",
                        createdAt: new Date().toISOString(),
                        replies: [],
                      });
                      setFirstMessage("");
                      setShowChatModal(false);
                    }}
                    disabled={!firstMessage.trim()}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start Chat
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
      </div>
      </div>
    </div>
  )
}
