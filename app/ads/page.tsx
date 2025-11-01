"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import PostAdModal from "@/components/ads/post-ad-modal"
import AdRatingModal from "@/components/ads/ad-rating-modal"
import { Eye, CheckCircle, Clock, XCircle, Star } from "lucide-react"
import type { Ad } from "@/lib/data-context"
import UserSidebar from "@/components/user/user-sidebar"

export default function AdsPage() {
  const { user } = useAuth()
  const { ads, addAd, updateAd } = useData()
  const [showPostModal, setShowPostModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)

  // Debug: Log ads to see what we have
  console.log("Total ads:", ads.length)
  console.log("User ID:", user?.id)

  const userAds = ads.filter((ad) => ad.userId === user?.id)
  const allAds = ads.filter((ad) => ad.status === "approved")

  console.log("User ads:", userAds.length)
  console.log("All approved ads:", allAds.length)

  const stats = [
    { label: "Total Ads", value: userAds.length, icon: Eye },
    { label: "Approved", value: userAds.filter((a) => a.status === "approved").length, icon: CheckCircle },
    { label: "Pending", value: userAds.filter((a) => a.status === "pending").length, icon: Clock },
    { label: "Rejected", value: userAds.filter((a) => a.status === "rejected").length, icon: XCircle },
  ]

  function handleAdClick(ad: Ad) {
    setSelectedAd(ad)
    setShowRatingModal(true)
  }

  function handleSubmitRating(adId: string, rating: number) {
    updateAd(adId, { rating })
    setShowRatingModal(false)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">

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

      <Tabs defaultValue="my-ads" className="pt-4 space-y-4">
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
                <Card 
                  key={ad.id} 
                  className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleAdClick(ad)}
                >
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
                    
                    {/* ✅ Ad Rating Display */}
                    {ad.status === "approved" && (
                      <div className="mb-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-gray-700">Ad Rating</p>
                          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {ad.rating?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(ad.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {ad.views} views
                      </span>
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
                <Card 
                  key={ad.id} 
                  className="border-primary/20 hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleAdClick(ad)}
                >
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
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ad.description}</p>
                    
                    {/* ✅ Ad Average Rating & Count - PROMINENT DISPLAY */}
                    <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">Ad Rating</p>
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">
                            {ad.rating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Star Display */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(ad.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      {/* ✅ Rating Count - VISIBLE */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">Total Ratings:</p>
                        <p className="text-sm font-bold text-orange-600">
                          {ad.ratedCount || 0}
                          <span className="text-xs font-normal text-gray-500 ml-1">
                            {(ad.ratedCount || 0) === 1 ? "rating" : "ratings"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">by {ad.userName}</span>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ad.views}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PostAdModal open={showPostModal} onOpenChange={setShowPostModal} onSubmit={addAd} />
      <AdRatingModal 
        open={showRatingModal} 
        onOpenChange={setShowRatingModal} 
        ad={selectedAd}
        onSubmit={handleSubmitRating}
      />
    </div>
    </div>
  )
}
