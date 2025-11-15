"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, User, Calendar, Reply as ReplyIcon, Search } from "lucide-react"

export default function AdminSupportPage() {
  const { tickets, replyToTicket } = useData()
  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      window.dispatchEvent(new Event("refresh-support-tickets"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const openTickets = tickets.filter(
    (t) =>
      (t.status === "open" || t.status === "in-progress") &&
      (t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.useremail?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Group tickets by user (userId or useremail)
  const userMap = new Map()
  openTickets.forEach(ticket => {
    const key = ticket.userId || ticket.useremail
    const isSeen = ticket.replies && ticket.replies.some(r => r.isAdmin)
    if (!userMap.has(key)) {
      userMap.set(key, { ...ticket, latestMessage: ticket.message, ticketId: ticket.id, isSeen })
    } else {
      
    }
  })
  const userList = Array.from(userMap.values())



  const handleReply = async (ticketId: string) => {
    if (!replyText.trim() && !replyImage) return
    setIsUploading(true)
    setUploadError(null)
    await replyToTicket(ticketId, replyText, true, replyImage || undefined)
    setReplyText("")
    setReplyImage(null)
    setIsUploading(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 border-2 border-green-200 rounded-lg px-3 py-2 w-full md:w-72 bg-white focus-within:border-green-500">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search Chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Open chats</p>
            <p className="text-3xl font-bold text-green-600">{openTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total chats</p>
            <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* User list with latest message */}
      <div className="space-y-4">
        {userList.length === 0 ? (
          <Card className="border-2 border-green-200">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500">No matching open chats</p>
            </CardContent>
          </Card>
        ) : (
          userList.map((user) => (
            <div
              key={user.ticketId}
              className={`rounded-2xl border-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl p-6 flex items-center gap-6 ${user.isSeen ? 'border-green-200 bg-white' : 'border-yellow-400 bg-yellow-50 animate-pulse'}`}
              onClick={() => { setSelectedTicket(user.ticketId); setShowChatModal(true); }}
            >
              <div className="flex-shrink-0">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="font-bold text-xl text-gray-900 truncate">{user.username || user.userId}</div>
                  <div className="text-sm text-gray-500 truncate">{user.useremail}</div>
                </div>
                <div className="mt-2 text-base text-gray-700 line-clamp-1 font-medium">{user.latestMessage}</div>
              </div>
              <span className={`ml-4 text-xs font-semibold px-3 py-1 rounded-full shadow-sm tracking-wide ${user.isSeen ? 'bg-green-100 text-green-700' : 'bg-yellow-400 text-white'}`}>
                {user.isSeen ? 'Seen' : 'Unseen'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Chat Modal */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Support Chat</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="flex flex-col max-h-[70vh]">
              <div className="flex-1 overflow-y-auto mb-2">
                {openTickets.filter(t => t.id === selectedTicket).map(ticket => (
                  <div key={ticket.id}>
                    <div className="mb-2">
                      <span className="block text-xl font-bold text-[#008060]">{ticket.username || ticket.userId}</span>
                      <span className="block text-sm text-gray-500">{ticket.useremail}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Customer message bubble */}
                      <div className="flex w-full justify-start">
                        <div className="flex flex-col items-start w-fit max-w-[75vw] md:max-w-md">
                          <div className="bg-[#e3f1eb] text-[#212326] rounded-2xl rounded-bl-sm px-3 md:px-4 py-1.5 md:py-2 shadow mb-1 w-fit">
                            <div className="text-xs md:text-sm font-semibold mb-0.5 md:mb-1 text-[#008060]">Customer</div>
                            {ticket.message && (
                              <div className="text-xs md:text-sm break-words">{ticket.message}</div>
                            )}
                            {ticket.imageUrl && (
                              <div className="mt-1 md:mt-2 flex flex-col items-start">
                                <a href={ticket.imageUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={ticket.imageUrl}
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
                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`flex w-full ${reply.isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex flex-col ${reply.isAdmin ? "items-end" : "items-start"} w-fit max-w-[75vw] md:max-w-md`}>
                            <div
                              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-2xl shadow mb-1 w-fit break-words ${
                                reply.isAdmin
                                  ? "bg-[#008060] text-white rounded-br-sm"
                                  : "bg-[#e3f1eb] text-[#212326] rounded-bl-sm"
                              }`}
                            >
                              <div className={`text-xs md:text-sm font-semibold mb-0.5 md:mb-1 ${reply.isAdmin ? "text-white text-right" : "text-[#008060] text-left"}`}>
                                {reply.isAdmin ? "You (Admin)" : "Customer"}
                              </div>
                              {reply.message && (
                                <div className="text-xs md:text-sm">{reply.message}</div>
                              )}
                              {reply.imageUrl && (
                                <div className={`mt-1 md:mt-2 flex flex-col ${reply.isAdmin ? "items-end" : "items-start"}`}>
                                  <a href={reply.imageUrl} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={reply.imageUrl}
                                      alt="Reply attachment"
                                      className="max-h-40 md:max-h-64 rounded-lg border border-[#36c160] cursor-pointer hover:opacity-90 transition"
                                    />
                                  </a>
                                  <span className={`mt-0.5 md:mt-1 text-[9px] md:text-[10px] ${reply.isAdmin ? 'text-[#b6e2d8]' : 'text-[#008060]'}`}>Image Attachment</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                        id={`file-upload-admin-modal-${selectedTicket}`}
                        type="file"
                        accept="image/*"
                        onChange={e => setReplyImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer z-10"
                        tabIndex={-1}
                      />
                      <button
                        type="button"
                        aria-label="Attach photo"
                        onClick={() => document.getElementById(`file-upload-admin-modal-${selectedTicket}`)?.click()}
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
                        onClick={() => handleReply(selectedTicket)}
                        disabled={isUploading || (!replyText.trim() && !replyImage)}
                        className="bg-[#008060] hover:bg-[#36c160] text-white px-4 py-2 min-w-[60px] rounded-full shadow-none"
                      >
                        {isUploading ? "Sending..." : "Send"}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedTicket(null)
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
