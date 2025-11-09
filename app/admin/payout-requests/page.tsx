"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Status = "pending" | "completed" | "rejected";

interface Payout {
  _id: string;
  userId: string;
  tempId: number | null;           // ← NEW
  fullName: string;                // ← NEW
  email: string;                   // ← NEW
  username: string;                // ← NEW
  amount: number;
  method: "usdt" | "bank";
  status: Status;
  details: any;
  requestedAt: string;
  processedAt?: string;
}

export default function AdminPayoutRequestsPage() {
  const [requests, setRequests] = useState<Payout[]>([]);
  const [filtered, setFiltered] = useState<Payout[]>([]);
  const [selected, setSelected] = useState<Payout | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch payouts
  useEffect(() => {
    const fetchPayouts = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/payout/admin/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setRequests(data);
        setFiltered(data);
      } catch (err) {
        alert("Failed to load payouts");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [token]);

  // Search + Filter
  useEffect(() => {
    let list = requests;

    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(r =>
        (typeof r.fullName === 'string' && r.fullName.toLowerCase().includes(term)) ||
        (typeof r.email === 'string' && r.email.toLowerCase().includes(term)) ||
        (typeof r.username === 'string' && r.username.toLowerCase().includes(term)) ||
        (typeof r._id === 'string' && r._id.includes(term)) ||
        (r.tempId !== null && typeof r.tempId !== 'undefined' && String(r.tempId).includes(term))
      );
    }

    if (filter !== "all") {
      list = list.filter(r => r.status === filter);
    }

    setFiltered(list);
  }, [search, filter, requests]);

  // Update status
  const updateStatus = async (id: string, status: "completed" | "rejected") => {
    if (!confirm(`Mark as ${status}?`)) return;
    setUpdating(true);

    try {
      const res = await fetch(`${API_URL}/api/payout/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");

      const { payout } = await res.json();
      setRequests(prev => prev.map(p => (p._id === id ? payout : p)));
      setSelected(payout);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getBadge = (status: Status) => {
    const map = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      completed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
    };
    const { color, icon: Icon } = map[status];
    return (
      <Badge className={`${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });

  const stats = {
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "completed").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    totalApproved: requests
      .filter(r => r.status === "completed")
      .reduce((s, r) => s + r.amount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payout Requests</h1>
        <p className="text-gray-600">Review and manage user payout requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-yellow-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Pending</p><p className="text-3xl font-bold">{stats.pending}</p></div><Clock className="w-6 h-6 text-yellow-600"/></CardContent></Card>
        <Card className="border-2 border-green-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Approved</p><p className="text-3xl font-bold">{stats.approved}</p></div><CheckCircle className="w-6 h-6 text-green-600"/></CardContent></Card>
        <Card className="border-2 border-red-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Rejected</p><p className="text-3xl font-bold">{stats.rejected}</p></div><XCircle className="w-6 h-6 text-red-600"/></CardContent></Card>
        <Card className="border-2 border-blue-200"><CardContent className="pt-6 flex justify-between items-center"><div><p className="text-sm text-gray-600 mb-1">Total Paid</p><p className="text-3xl font-bold">${stats.totalApproved.toFixed(2)}</p></div><DollarSign className="w-6 h-6 text-blue-600"/></CardContent></Card>
      </div>

      {/* Search + Filters */}
      <Card className="border-2 border-green-200">
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, ID, or tempId..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "completed", "rejected"] as const).map(f => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payout Requests ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No requests found</div>
          ) : (
            <div className="space-y-4">
              {filtered.map(req => (
                <div key={req._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-50 p-2 rounded-lg"><User className="w-5 h-5 text-green-600"/></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{req.fullName || req.username}</span>
                            {getBadge(req.status)}
                          </div>
                          <p className="text-sm text-gray-600">{req.email}</p>
                          <p className="text-xs text-gray-500">
                            Temp ID: <span className="font-mono">{req.tempId ?? "—"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div><p className="text-xs text-gray-500">Amount</p><p className="font-semibold">${req.amount.toFixed(2)}</p></div>
                        <div><p className="text-xs text-gray-500">Method</p><p className="font-semibold">{req.method === "usdt" ? "USDT" : "Bank"}</p></div>
                        <div><p className="text-xs text-gray-500">Date</p><p className="font-semibold">{formatDate(req.requestedAt)}</p></div>
                        <div><p className="text-xs text-gray-500">Status</p><p className="font-semibold capitalize">{req.status}</p></div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 ml-11 md:ml-0">
                      <Button onClick={() => { setSelected(req); setModalOpen(true); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Eye className="w-4 h-4 mr-2"/>View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-700">Payout Request Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Status</h3>
                {getBadge(selected.status)}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold mb-3">User</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600">Name</p><p className="font-medium">{selected.fullName || selected.username}</p></div>
                  <div><p className="text-gray-600">Email</p><p className="font-medium">{selected.email}</p></div>
                  <div><p className="text-gray-600">Temp ID</p><p className="font-medium font-mono">{selected.tempId ?? "—"}</p></div>
                  <div><p className="text-gray-600">Request ID</p><p className="font-medium font-mono">{selected._id}</p></div>
                  <div><p className="text-gray-600">Submitted</p><p className="font-medium">{formatDate(selected.requestedAt)}</p></div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold mb-3">Payout Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-600">Amount</p><p className="text-2xl font-bold text-green-600">${selected.amount.toFixed(2)}</p></div>
                  <div><p className="text-gray-600">Method</p><p className="font-medium">{selected.method === "usdt" ? "USDT (TRC20)" : "Bank Transfer"}</p></div>

                  {selected.method === "usdt" && (
                    <>
                      <div><p className="text-gray-600">Name</p><p className="font-medium">{selected.details.usdtName}</p></div>
                      <div><p className="text-gray-600">Address</p><p className="font-medium break-all">{selected.details.usdtAddress}</p></div>
                    </>
                  )}
                  {selected.method === "bank" && (
                    <>
                      <div><p className="text-gray-600">Account Holder</p><p className="font-medium">{selected.details.bankAccountHolder}</p></div>
                      <div><p className="text-gray-600">Account #</p><p className="font-medium">{selected.details.bankAccountNumber}</p></div>
                      <div><p className="text-gray-600">Bank</p><p className="font-medium">{selected.details.bankName}</p></div>
                      <div><p className="text-gray-600">Branch</p><p className="font-medium">{selected.details.bankBranch}</p></div>
                    </>
                  )}
                </div>
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <Button onClick={() => updateStatus(selected._id, "completed")} disabled={updating} className="flex-1 bg-green-600 hover:bg-green-700">
                    {updating ? <Loader2 className="w-4 h-4 animate-spin"/> : "Approve"}
                  </Button>
                  <Button onClick={() => updateStatus(selected._id, "rejected")} disabled={updating} className="flex-1 bg-red-600 hover:bg-red-700">
                    {updating ? <Loader2 className="w-4 h-4 animate-spin"/> : "Reject"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}