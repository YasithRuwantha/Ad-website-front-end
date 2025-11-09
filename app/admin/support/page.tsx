"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
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



  const handleReply = async (ticketId: string) => {
    if (!replyText.trim() && !replyImage) return
    setIsUploading(true)
    setUploadError(null)
    await replyToTicket(ticketId, replyText, true, replyImage || undefined)
    setReplyText("")
    setReplyImage(null)
    setSelectedTicket(null)
    setIsUploading(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 border-2 border-green-200 rounded-lg px-3 py-2 w-full md:w-72 bg-white focus-within:border-green-500">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tickets..."
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
            <p className="text-sm text-gray-600 mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-green-600">{openTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket list */}
      <div className="space-y-4">
        {openTickets.length === 0 ? (
          <Card className="border-2 border-green-200">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-gray-500">No matching open tickets</p>
            </CardContent>
          </Card>
        ) : (
          openTickets.map((ticket) => (
            <Card key={ticket.id} className="border-4 border-[#008060] bg-[#f6f7f8] rounded-2xl max-w-full md:max-w-4xl mx-auto w-full p-2 md:p-6 shadow-2xl flex flex-col">
              <div className="rounded-t-2xl bg-[#008060] px-4 py-2 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {/* Customer details big and bold */}
                  <div className="mb-2">
                    <span className="block text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                      {ticket.username || ticket.userId}
                    </span>
                    {ticket.useremail && (
                      <span className="block text-lg md:text-xl font-semibold text-[#b6e2d8] break-all">
                        {ticket.useremail}
                      </span>
                    )}
                  </div>
                  <span className="text-white font-semibold text-sm md:text-base line-clamp-1">{ticket.subject}</span>
                  <span className="block text-xs text-[#b6e2d8]">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3f1eb] text-[#008060] text-xs font-medium">
                      <User className="w-3.5 h-3.5" />
                      {ticket.username || ticket.userId}
                    </span>
                    {ticket.useremail && (
                      <a
                        href={`mailto:${ticket.useremail}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3f1eb] text-[#008060] text-xs font-medium hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {ticket.useremail}
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3f1eb] text-[#008060] text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    ticket.status === "open" ? "bg-[#36c160] text-white" : "bg-yellow-400/80 text-white"
                  }`}
                >
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
                {/* Reply button: visible in header on desktop, hidden on mobile */}
                <span className="hidden sm:inline-flex">
                  <Button
                    onClick={() => setSelectedTicket(ticket.id)}
                    size="sm"
                    className="ml-2 bg-[#008060] hover:bg-[#36c160] text-white px-3 py-1 rounded-full"
                  >
                    <ReplyIcon className="w-4 h-4 mr-1" /> Reply
                  </Button>
                </span>
              </div>
              {/* Card content and chat area */}
              <div className="flex flex-col justify-between h-[350px] md:h-[420px] flex-1">
                {/* ...existing code... */}
              </div>
              {/* Reply button: visible at bottom on mobile only */}
              <div className="sm:hidden flex px-0 pb-2 pt-2 mt-auto">
                <Button
                  onClick={() => setSelectedTicket(ticket.id)}
                  size="sm"
                  className="bg-[#008060] hover:bg-[#36c160] text-white px-0 py-2 rounded-full w-full max-w-[200px] mx-auto shadow-none"
                  style={{minWidth:0, justifyContent:'center'}}>
                  <ReplyIcon className="w-4 h-4 mr-1" /> Reply
                </Button>
              </div>

              <div className="flex flex-col justify-between h-[350px] md:h-[420px]">
                <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 bg-white rounded-b-2xl space-y-1.5 md:space-y-3 border-b border-[#e1e3e4]">
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

                {selectedTicket === ticket.id && (
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
                            id={`file-upload-admin-${ticket.id}`}
                            type="file"
                            accept="image/*"
                            onChange={e => setReplyImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                            className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer z-10"
                            tabIndex={-1}
                          />
                          <button
                            type="button"
                            aria-label="Attach photo"
                            onClick={() => document.getElementById(`file-upload-admin-${ticket.id}`)?.click()}
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
                            onClick={() => handleReply(ticket.id)}
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
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
