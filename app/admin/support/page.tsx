"use client"


import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User } from "lucide-react"
import { getTickets, getTicketById, TicketDTO } from "@/lib/support"

export default function AdminSupportPage() {
  // Only fetch ticket list (not full chat) for sidebar
  const [userList, setUserList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [ticketDetail, setTicketDetail] = useState<TicketDTO | null>(null)
  const [loadingChat, setLoadingChat] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch only ticket list (not replies)
  useEffect(() => {
    getTickets().then(tickets => {
      // Group by userId or useremail, only keep latest ticket per user
      const userMap = new Map()
      tickets.forEach(ticket => {
        if (ticket.status === "open" || ticket.status === "in-progress") {
          const key = ticket.userId || ticket.useremail
          if (!userMap.has(key)) {
            userMap.set(key, {
              username: ticket.username,
              useremail: ticket.useremail,
              userId: ticket.userId,
              ticketId: ticket.id,
              subject: ticket.subject,
              latestMessage: ticket.message,
              isSeen: ticket.replies && ticket.replies.some(r => r.isAdmin),
            })
          }
        }
      })
      setUserList(Array.from(userMap.values()))
    })
  }, [])

  // Fetch chat only when a user is selected
  useEffect(() => {
    if (selectedTicket) {
      setLoadingChat(true)
      getTicketById(selectedTicket)
        .then(ticket => setTicketDetail(ticket))
        .finally(() => setLoadingChat(false))
    } else {
      setTicketDetail(null)
    }
  }, [selectedTicket])


  // Handle admin reply to ticket
  const handleReply = async () => {
    if (!selectedTicket || (!replyText.trim() && !replyImage)) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      // Use addReply API from lib/support
      // isAdmin: true for admin reply
      await import("@/lib/support").then(({ addReply }) =>
        addReply(selectedTicket, { message: replyText, isAdmin: true, image: replyImage || undefined })
      );
      setReplyText("");
      setReplyImage(null);
      // Refresh chat after reply
      setLoadingChat(true);
      getTicketById(selectedTicket)
        .then(ticket => setTicketDetail(ticket))
        .finally(() => setLoadingChat(false));
    } catch (e: any) {
      setUploadError(e.message || "Failed to send reply");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>
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

      {/* User list with latest message */}
      <div className="space-y-4">
        {userList.length === 0 ? (
          <Card className="border-2 border-green-200">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500">No matching open chats</p>
            </CardContent>
          </Card>
        ) : (
          userList
            .filter(user =>
              user.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.useremail?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(user => (
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
          {loadingChat ? (
            <div className="flex items-center justify-center min-h-[200px]">Loading chat...</div>
          ) : ticketDetail ? (
            <div className="flex flex-col max-h-[70vh]">
              <div className="flex-1 overflow-y-auto mb-2">
                <div key={ticketDetail.id}>
                  <div className="mb-2">
                    <span className="block text-xl font-bold text-[#008060]">{ticketDetail.subject}</span>
                    <span className="block text-sm text-gray-500">{ticketDetail.useremail}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-900 max-w-[70%]">
                        {ticketDetail.message}
                        {ticketDetail.imageUrl && (
                          <img src={ticketDetail.imageUrl} alt="attachment" className="mt-2 max-h-32 rounded" />
                        )}
                      </div>
                    </div>
                    {ticketDetail.replies.map((reply) => (
                      <div key={reply.id} className={`flex w-full ${reply.isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${reply.isAdmin ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2 max-w-[70%]`}>
                          {reply.message}
                          {reply.imageUrl && (
                            <img src={reply.imageUrl} alt="attachment" className="mt-2 max-h-32 rounded" />
                          )}
                          <div className="text-xs text-gray-500 mt-1">{new Date(reply.createdAt).toLocaleString()}</div>
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
                        onClick={handleReply}
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
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
