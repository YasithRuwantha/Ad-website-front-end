"use client"

import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function AdminSupportPage() {
  const { tickets, replyToTicket } = useData()
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in-progress")

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return
    replyToTicket(ticketId, replyText, true)
    setReplyText("")
    setSelectedTicket(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground">Manage customer support requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
            <p className="text-3xl font-bold text-primary">{openTickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-foreground">{tickets.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {openTickets.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">No open tickets</p>
            </CardContent>
          </Card>
        ) : (
          openTickets.map((ticket) => (
            <Card key={ticket.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{ticket.subject}</CardTitle>
                    <CardDescription>
                      From {ticket.username || ticket.userId}{ticket.useremail ? ` (${ticket.useremail})` : ""} •
                      {" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-semibold text-foreground mb-1">Customer</p>
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
                        {reply.isAdmin ? "You (Admin)" : "Customer"}
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
          ))
        )}
      </div>
    </div>
  )
}
