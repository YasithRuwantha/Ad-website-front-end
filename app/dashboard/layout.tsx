"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import UserSidebar from "@/components/user/user-sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        router.push("/")
        return
      }

      const user = JSON.parse(storedUser)

      if (user.role !== "user") {
        router.push("/")
        return
      }

      setIsChecking(false) // ✅ passed all checks
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

  // Show loader while checking localStorage
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <UserSidebar />
      <main className="flex-1 overflow-auto md:ml-0 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
