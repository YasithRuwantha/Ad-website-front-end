"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Mail, User, Calendar, Reply as ReplyIcon, Search } from "lucide-react"

export default function AdminSupportPage() {
  const { tickets, replyToTicket } = useData()
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
            <Card key={ticket.id} className="border-2 border-green-200 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-foreground text-2xl font-bold leading-tight">{ticket.subject}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted border text-foreground">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">{ticket.username || ticket.userId}</span>
                      </div>
                      {ticket.useremail && (
                        <a
                          href={`mailto:${ticket.useremail}`}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted border text-foreground hover:bg-muted/80"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-medium">{ticket.useremail}</span>
                        </a>
                      )}
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted border text-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSelectedTicket(ticket.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ReplyIcon className="w-4 h-4 mr-2" /> Reply
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Customer</p>
                    <p className="text-sm text-gray-700">{ticket.message}</p>
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
                      className={`p-2 rounded-lg text-sm ${
                        reply.isAdmin ? "bg-secondary/10 border border-secondary/30" : "bg-muted"
                      }`}
                    >
                      <p className="font-semibold text-foreground mb-0.5">
                        {reply.isAdmin ? "You (Admin)" : "Customer"}
                      </p>
                      <p className="text-foreground">{reply.message}</p>
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

                {selectedTicket === ticket.id && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-green-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="bg-green-600 hover:bg-green-700 text-white"
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
                      >
                        Cancel
                      </Button>
                    </div>
                    {replyImage && (
                      <div className="text-xs text-gray-700">Selected: {replyImage.name}</div>
                    )}
                    {uploadError && (
                      <div className="text-xs text-red-600">{uploadError}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
