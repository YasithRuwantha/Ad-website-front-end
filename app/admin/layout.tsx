"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!isLoading && (!user || user.role !== "admin")) {
  //     router.push("/")
  //   }
  // }, [user, isLoading, router])

    const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        router.push("/")
        return
      }

      const user = JSON.parse(storedUser)

      // Check role
      if (user.role !== "admin") {
        router.push("/")
        return
      }

      setIsChecking(false)
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

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

  // if (!user || user.role !== "admin") {
  //   return null
  // }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Sidebar — fixed on mobile, static on desktop */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">
        {children}
        </main>
    </div>
  )
}
