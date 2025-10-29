"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import UserSidebar from "@/components/user/user-sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!isLoading && (!user || user.role !== "user")) {
  //     router.push("/")
  //   }
  // }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // if (!user || user.role !== "user") {
  //   return null
  // }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <UserSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
