"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CheckCircle, XCircle, Clock, User, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const mockPayoutRequests = [
  {
    id: "1",
    user: "john_doe",
    email: "john@example.com",
    amount: 120.0,
    method: "USDT",
    address: "TQ2...9XyZ",
    status: "pending",
    date: "2025-11-08T10:00:00Z",
  },
  {
    id: "2",
    user: "jane_smith",
    email: "jane@example.com",
    amount: 300.0,
    method: "Bank",
    bank: "Bank of Example",
    account: "1234567890",
    status: "approved",
    date: "2025-11-07T14:30:00Z",
  },
  {
    id: "3",
    user: "alice",
    email: "alice@example.com",
    amount: 75.5,
    method: "USDT",
    address: "TP1...7AbC",
    status: "rejected",
    date: "2025-11-06T09:15:00Z",
  },
];

type Status = "pending" | "approved" | "rejected";

export default function AdminPayoutRequestsPage() {
  const [requests] = useState(mockPayoutRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockPayoutRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockPayoutRequests[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all");

  // Filter requests based on search and status
  const filterRequests = () => {
    let filtered = requests;
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((req) => req.status === filterStatus);
    }
    setFilteredRequests(filtered);
  };

  // Run filter on search/filter change
  React.useEffect(() => {
    filterRequests();
    // eslint-disable-next-line
  }, [searchTerm, filterStatus, requests]);

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" /> Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const totalAmount = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Requests</h1>
        <p className="text-gray-600">Review and manage user payout requests</p>
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
            Payout Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No payout requests found</p>
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
                            <span className="font-bold text-gray-900">{request.user}</span>
                            {getStatusBadge(request.status as Status)}
                          </div>
                          <p className="text-sm text-gray-600">{request.email}</p>
                          <p className="text-xs text-gray-500">Request ID: {request.id}</p>
                        </div>
                      </div>
                      <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Amount</p>
                          <p className="font-semibold text-gray-900">
                            ${request.amount} {request.method === "USDT" ? "USDT" : "USD"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Method</p>
                          <p className="font-semibold text-gray-900">
                            {request.method === "USDT" ? "USDT (TRC20)" : "Bank Transfer"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Submitted</p>
                          <p className="font-semibold text-gray-900">{formatDate(request.date)}</p>
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
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
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
              <DialogTitle className="text-2xl text-green-700">Payout Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
                {getStatusBadge(selectedRequest.status as Status)}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">User Name</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request ID</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted At</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedRequest.date)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-2xl text-green-600">
                      ${selectedRequest.amount} {selectedRequest.method === "USDT" ? "USDT" : "USD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Method</p>
                    <p className="font-semibold text-gray-900">
                      {selectedRequest.method === "USDT" ? "USDT (TRC20)" : "Bank Transfer"}
                    </p>
                  </div>
                  {selectedRequest.method === "Bank" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold text-gray-900">{selectedRequest.bank}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-semibold text-gray-900">{selectedRequest.account}</p>
                      </div>
                    </>
                  )}
                  {selectedRequest.method === "USDT" && (
                    <div>
                      <p className="text-sm text-gray-600">USDT Address</p>
                      <p className="font-semibold text-gray-900">{selectedRequest.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
