"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, DollarSign, User, Search, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFundPayments } from "@/lib/fundPayment-context"

interface FundRequest {
  id: string
  userId: string
  tempId: number | null          // ← NEW
  userName: string
  email: string
  amount: number
  currency: string
  paymentMethod: "usdt" | "bank"
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  fullName?: string
  proofImage?: string
  bankName?: string
  depositAmount?: string
}

export default function FundApprovalsPage() {
  const [requests, setRequests] = useState<FundRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<FundRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [isLoading, setIsLoading] = useState(false)

  const { fetchFundPayments, fundPayments, updateFundPaymentStatus } = useFundPayments()

  // ──────────────────────────────────────────────────────
  // 1. Fetch once
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchFundPayments().catch(console.error)
  }, [])

  // ──────────────────────────────────────────────────────
  // 2. Map backend → UI (add tempId)
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!fundPayments.length) return

    const mapped: FundRequest[] = fundPayments.map(p => ({
      id: p._id,
      userId: p.userID,
      tempId: p.tempId ?? null,                     // ← NEW
      userName: p.username ?? p.userID,
      email: p.email ?? "",
      amount: Number(p.amount),
      currency: p.method === "USDT-TRC20" ? "USDT" : "USD",
      paymentMethod: p.method === "USDT-TRC20" ? "usdt" : "bank",
      status: p.status,
      submittedAt: p.requestedDate || p.createdAt || new Date().toISOString(),
      fullName: p.fullName ?? "",
      proofImage: p.imgUrl ?? "",
      bankName: p.branchName ?? "",
      depositAmount: p.depositAmount ?? "",
    }))

    setRequests(mapped)
    setFilteredRequests(mapped)
  }, [fundPayments])

  // ──────────────────────────────────────────────────────
  // 3. Search + filter (tempId included)
  // ──────────────────────────────────────────────────────
  useEffect(() => {
    let list = requests

    if (searchTerm) {
      const term = searchTerm.trim().toLowerCase()
      list = list.filter(r =>
        (typeof r.userName === 'string' && r.userName.toLowerCase().includes(term)) ||
        (typeof r.email === 'string' && r.email.toLowerCase().includes(term)) ||
        (typeof r.id === 'string' && r.id.toLowerCase().includes(term)) ||
        (typeof r.userId === 'string' && r.userId.toLowerCase().includes(term)) ||
        (r.tempId !== null && typeof r.tempId !== 'undefined' && String(r.tempId).includes(term))
      )
    }

    if (filterStatus !== "all") {
      list = list.filter(r => r.status === filterStatus)
    }

    setFilteredRequests(list)
  }, [searchTerm, filterStatus, requests])

  // ──────────────────────────────────────────────────────
  // Approve / Reject
  // ──────────────────────────────────────────────────────
  const handleApprove = async (id: string) => {
    setIsLoading(true)
    try {
      await updateFundPaymentStatus(id, "approved")
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: "approved" } : r)))
      alert("Approved!")
    } catch (e) { alert("Failed") } finally { setIsLoading(false) }
  }

  const handleReject = async (id: string) => {
    setIsLoading(true)
    try {
      await updateFundPaymentStatus(id, "rejected")
      setRequests(prev => prev.map(r => (r.id === id ? { ...r, status: "rejected" } : r)))
      alert("Rejected!")
    } catch (e) { alert("Failed") } finally { setIsLoading(false) }
  }

  // ──────────────────────────────────────────────────────
  // UI helpers
  // ──────────────────────────────────────────────────────
  const getStatusBadge = (s: string) => {
    const map: Record<string, JSX.Element> = {
      approved: <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1"/>Approved</Badge>,
      pending:  <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1"/>Pending</Badge>,
      rejected: <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1"/>Rejected</Badge>,
    }
    return map[s] ?? <Badge>{s}</Badge>
  }

  const formatDate = (d: string) => new Date(d).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  })

  const pendingCount   = requests.filter(r => r.status === "pending").length
  const approvedCount  = requests.filter(r => r.status === "approved").length
  const rejectedCount  = requests.filter(r => r.status === "rejected").length
  const totalApproved  = requests.filter(r => r.status === "approved").reduce((s, r) => s + r.amount, 0)

  // ──────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fund Approvals</h1>
        <p className="text-gray-600">Review and approve customer fund deposit requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-yellow-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Pending</p><p className="text-3xl font-bold">{pendingCount}</p></div><Clock className="w-6 h-6 text-yellow-600"/></CardContent></Card>
        <Card className="border-2 border-green-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Approved</p><p className="text-3xl font-bold">{approvedCount}</p></div><CheckCircle className="w-6 h-6 text-green-600"/></CardContent></Card>
        <Card className="border-2 border-red-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Rejected</p><p className="text-3xl font-bold">{rejectedCount}</p></div><XCircle className="w-6 h-6 text-red-600"/></CardContent></Card>
        <Card className="border-2 border-blue-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Total Approved</p><p className="text-3xl font-bold">${totalApproved}</p></div><DollarSign className="w-6 h-6 text-blue-600"/></CardContent></Card>
      </div>

      {/* Search + Filters */}
      <Card className="border-2 border-green-200">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <Input
              placeholder="Search by name, email, ID, or tempId..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all","pending","approved","rejected"] as const).map(v => (
              <Button key={v}
                onClick={() => setFilterStatus(v)}
                className={filterStatus===v ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              >{v.charAt(0).toUpperCase()+v.slice(1)}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border-2 border-green-200">
        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600"/>Fund Requests ({filteredRequests.length})</CardTitle></CardHeader>
        <CardContent>
          {filteredRequests.length===0 ? (
            <div className="text-center py-12"><DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4"/><p className="text-gray-500 text-lg">No requests found</p></div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(r => (
                <div key={r.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-50 p-2 rounded-lg"><User className="w-5 h-5 text-green-600"/></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{r.userName || "—"}</h3>
                            {getStatusBadge(r.status)}
                          </div>
                          <p className="text-sm text-gray-600">{r.email}</p>
                          <p className="text-xs text-gray-500">
                            Temp ID: <span className="font-mono">{r.tempId ?? "—"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div><p className="text-gray-500 text-xs">Amount</p><p className="font-semibold">${r.amount} {r.currency}</p></div>
                        <div><p className="text-gray-500 text-xs">Method</p><p className="font-semibold">{r.paymentMethod==="usdt"?"USDT (TRC20)":"Bank Transfer"}</p></div>
                        <div><p className="text-gray-500 text-xs">Submitted</p><p className="font-semibold">{formatDate(r.submittedAt)}</p></div>
                        <div><p className="text-gray-500 text-xs">Status</p><p className="font-semibold capitalize">{r.status}</p></div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 ml-11 md:ml-0">
                      <Button onClick={()=>{setSelectedRequest(r);setShowDetailModal(true)}} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Eye className="w-4 h-4 mr-2"/>View
                      </Button>
                      {r.status==="pending" && (
                        <>
                          <Button onClick={()=>handleApprove(r.id)} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2"/>Approve
                          </Button>
                          <Button onClick={()=>handleReject(r.id)} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                            <XCircle className="w-4 h-4 mr-2"/>Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl border-2 border-green-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-700">Fund Request Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Current Status</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Full Name</p><p className="font-semibold">{selectedRequest.fullName || "—"}</p></div>
                  <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{selectedRequest.email}</p></div>
                  {/* <div><p className="text-sm text-gray-600">User ID</p><p className="font-semibold font-mono">{selectedRequest.userId}</p></div> */}
                  <div><p className="text-sm text-gray-600">Temp ID</p><p className="font-semibold font-mono">{selectedRequest.tempId ?? "—"}</p></div>
                  <div><p className="text-sm text-gray-600">Submitted At</p><p className="font-semibold">{formatDate(selectedRequest.submittedAt)}</p></div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Amount</p><p className="font-bold text-2xl text-green-600">${selectedRequest.amount} {selectedRequest.currency}</p></div>
                  <div><p className="text-sm text-gray-600">Method</p><p className="font-semibold">{selectedRequest.paymentMethod==="usdt"?"USDT (TRC20)":"Bank Transfer USD"}</p></div>
                  {selectedRequest.paymentMethod==="bank" && (
                    <>
                      <div><p className="text-sm text-gray-600">Bank Name</p><p className="font-semibold">{selectedRequest.bankName||"-"}</p></div>
                      <div><p className="text-sm text-gray-600">Deposit Amount</p><p className="font-semibold">${selectedRequest.depositAmount||"-"}</p></div>
                    </>
                  )}
                </div>
              </div>

              {selectedRequest.paymentMethod==="usdt" && selectedRequest.proofImage && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Proof of Payment</h3>
                  <div className="bg-white p-2 rounded-lg border-2 border-gray-300">
                    <img src={selectedRequest.proofImage} alt="Proof" className="w-full h-auto object-contain rounded-lg"/>
                  </div>
                </div>
              )}

              {selectedRequest.status==="pending" && (
                <div className="flex gap-4 pt-4">
                  <Button onClick={()=>handleReject(selectedRequest.id)} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-lg">
                    <XCircle className="w-5 h-5 mr-2"/>{isLoading?"Processing...":"Reject"}
                  </Button>
                  <Button onClick={()=>handleApprove(selectedRequest.id)} disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                    <CheckCircle className="w-5 h-5 mr-2"/>{isLoading?"Processing...":"Approve"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}