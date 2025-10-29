"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import PostAdModal from "@/components/ads/post-ad-modal"
import { Eye, CheckCircle, Clock, XCircle } from "lucide-react"

export default function AdsPage() {
  const { user } = useAuth()
  const { ads, addAd } = useData()
  const [showPostModal, setShowPostModal] = useState(false)

  const userAds = ads.filter((ad) => ad.userId === user?.id)
  const allAds = ads.filter((ad) => ad.status === "approved")

  const stats = [
    { label: "Total Ads", value: userAds.length, icon: Eye },
    { label: "Approved", value: userAds.filter((a) => a.status === "approved").length, icon: CheckCircle },
    { label: "Pending", value: userAds.filter((a) => a.status === "pending").length, icon: Clock },
    { label: "Rejected", value: userAds.filter((a) => a.status === "rejected").length, icon: XCircle },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ads Management</h1>
          <p className="text-muted-foreground">Post, review, and manage your advertisements</p>
        </div>
        <Button
          onClick={() => setShowPostModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          Post New Ad
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary/40" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="my-ads" className="space-y-4">
        <TabsList className="bg-primary/10 border border-primary/20">
          <TabsTrigger
            value="my-ads"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            My Ads
          </TabsTrigger>
          <TabsTrigger
            value="all-ads"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Ads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-ads" className="space-y-4">
          {userAds.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">No ads posted yet</p>
                <Button
                  onClick={() => setShowPostModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Post Your First Ad
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAds.map((ad) => (
                <Card key={ad.id} className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <img
                      src={ad.image || "/placeholder.svg"}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/generic-advertisement.png"
                      }}
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-2">{ad.title}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          ad.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : ad.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ad.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{ad.views} views</span>
                      <span className="text-primary font-semibold">{new Date(ad.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all-ads" className="space-y-4">
          {allAds.length === 0 ? (
            <Card className="border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">No approved ads available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAds.map((ad) => (
                <Card key={ad.id} className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <img
                      src={ad.image || "/placeholder.svg"}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/generic-advertisement.png"
                      }}
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ad.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">by {ad.userName}</span>
                      <span className="text-primary font-semibold">{ad.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PostAdModal open={showPostModal} onOpenChange={setShowPostModal} onSubmit={addAd} />
    </div>
  )
}
