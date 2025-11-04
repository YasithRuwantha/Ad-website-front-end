"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, DollarSign, User, Search, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useFundPayments } from "@/lib/fundPayment-context"

interface FundRequest {
  id: string
  userId: string
  userName: string
  email: string
  amount: number
  currency: string
  paymentMethod: "usdt" | "bank"
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  // USDT specific
  fullName?: string
  proofImage?: string
  // Bank specific
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

  const { fetchFundPayments, fundPayments } = useFundPayments()

  // Fetch fund payments on mount
  useEffect(() => {
    const loadFundPayments = async () => {
      try {
        await fetchFundPayments()
      } catch (err) {
        console.error("Error fetching fund payments:", err)
      }
    }
    loadFundPayments()
  }, []) // empty array ensures it only runs once

  // Map fundPayments from context to component state
  useEffect(() => {
    if (fundPayments.length > 0) {
      const mappedRequests: FundRequest[] = fundPayments.map((p) => ({
        id: p._id,
        userId: p.userID,
        userName: p.userID, // replace with actual name if available
        email: p.userID.email, // replace with actual email if available
        amount: Number(p.amount),
        currency: p.method === "USDT-TRC20" ? "USDT" : "USD",
        paymentMethod: p.method === "USDT-TRC20" ? "usdt" : "bank",
        status: p.status,
        submittedAt: p.requestedDate || p.createdAt || new Date().toISOString(),
        fullName: "", // replace if available
        proofImage: p.imgUrl || "",
        bankName: "", // replace if available
        depositAmount: "", // replace if available
      }))

      setRequests(mappedRequests)
      setFilteredRequests(mappedRequests)
      console.log("Fetched Fund Requests:", mappedRequests)
    }
  }, [fundPayments])

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, filterStatus, requests])

  const handleApprove = async (requestId: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req))
      )
      setIsLoading(false)
      setShowDetailModal(false)
      alert("Fund request approved successfully!")
    }, 1000)
  }

  const handleReject = async (requestId: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" as const } : req))
      )
      setIsLoading(false)
      setShowDetailModal(false)
      alert("Fund request rejected!")
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length
  const totalAmount = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fund Approvals</h1>
        <p className="text-gray-600">Review and approve customer fund deposit requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-yellow-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-600" />
          </CardContent>
        </Card>
        <Card className="border-2 border-blue-200">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Approved</p>
              <p className="text-3xl font-bold text-gray-900">${totalAmount}</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-600" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-green-200">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterStatus("all")}
              className={`${filterStatus === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </Button>
            <Button
              onClick={() => setFilterStatus("pending")}
              className={`${filterStatus === "pending" ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilterStatus("approved")}
              className={`${filterStatus === "approved" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Approved
            </Button>
            <Button
              onClick={() => setFilterStatus("rejected")}
              className={`${filterStatus === "rejected" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Rejected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Fund Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No fund requests found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-50 p-2 rounded-lg">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {/* <h3 className="font-bold text-gray-900">{request.userName}</h3> */}
                            {/* {getStatusBadge(request.status)} */}
                          </div>
                          {/* <p className="text-sm text-gray-600">{request.email}</p> */}
                          <p className="text-xs text-gray-500">
                            {/* Request ID: {request.id} | User ID: {request.userId} */}
                          </p>
                        </div>
                      </div>
                      <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Amount</p>
                          <p className="font-semibold text-gray-900">
                            ${request.amount} {request.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Method</p>
                          <p className="font-semibold text-gray-900">
                            {request.paymentMethod === "usdt" ? "USDT (TRC20)" : "Bank Transfer"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Submitted</p>
                          <p className="font-semibold text-gray-900">{formatDate(request.submittedAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p className="font-semibold text-gray-900 capitalize">{request.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 ml-11 md:ml-0">
                      <Button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetailModal(true)
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleApprove(request.id)}
                            disabled={isLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
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
              {/* <DialogDescription className="text-gray-600">Request ID: {selectedRequest.id}</DialogDescription> */}
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
                {/* {getStatusBadge(selectedRequest.status)} */}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    {/* <p className="font-semibold text-gray-900">{selectedRequest.userName}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    {/* <p className="font-semibold text-gray-900">{selectedRequest.userId}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted At</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedRequest.submittedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-2xl text-green-600">
                      ${selectedRequest.amount} {selectedRequest.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.paymentMethod === "usdt" ? "USDT (TRC20)" : "Bank Transfer USD"}
                    </p>
                  </div>
                  {selectedRequest.paymentMethod === "bank" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold text-gray-900">{selectedRequest.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deposit Amount</p>
                        <p className="font-semibold text-gray-900">${selectedRequest.depositAmount}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedRequest.paymentMethod === "usdt" && selectedRequest.proofImage && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof of Payment</h3>
                  <div className="bg-white p-2 rounded-lg border-2 border-gray-300">
                    <img
                      src={selectedRequest.proofImage}
                      alt="Payment Proof"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    {isLoading ? "Processing..." : "Reject Request"}
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {isLoading ? "Processing..." : "Approve Request"}
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
