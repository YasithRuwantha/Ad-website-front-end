"use client"
import { useData } from "@/lib/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle } from "lucide-react"

export default function AdminAdsPage() {
  const { ads, updateAd } = useData()

  const pendingAds = ads.filter((a) => a.status === "pending")
  const approvedAds = ads.filter((a) => a.status === "approved")
  const rejectedAds = ads.filter((a) => a.status === "rejected")

  const handleApprove = (adId: string) => {
    updateAd(adId, { status: "approved" })
  }

  const handleReject = (adId: string) => {
    updateAd(adId, { status: "rejected" })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Ads</h1>
        <p className="text-muted-foreground">Review and approve user advertisements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-primary">{pendingAds.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{approvedAds.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-3xl font-bold text-destructive">{rejectedAds.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-primary/10 border border-primary/20">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pending ({pendingAds.length})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Approved ({approvedAds.length})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Rejected ({rejectedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAds.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No pending ads</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingAds.map((ad) => (
                <Card key={ad.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{ad.title}</CardTitle>
                        <CardDescription>by {ad.userName}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground">{ad.description}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(ad.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button onClick={() => handleReject(ad.id)} variant="destructive" className="flex-1 gap-2">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedAds.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No approved ads</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {approvedAds.map((ad) => (
                <Card key={ad.id} className="border-primary/20 border-green-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{ad.title}</CardTitle>
                        <CardDescription>by {ad.userName}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                        Approved
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground line-clamp-2">{ad.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedAds.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No rejected ads</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {rejectedAds.map((ad) => (
                <Card key={ad.id} className="border-primary/20 border-red-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{ad.title}</CardTitle>
                        <CardDescription>by {ad.userName}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                        Rejected
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground line-clamp-2">{ad.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
