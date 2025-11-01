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
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (!storedUser || !token) {
          router.push("/")
          return
        }

        const user = JSON.parse(storedUser)

        if (user.role !== "user") {
          router.push("/")
          return
        }

        // ✅ Passed all checks, now fetch lucky draw status
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/luckydraw`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          console.error("Failed to fetch lucky draw status")
          return
        }

        const data = await res.json()
        console.log("🎲 Lucky Draw Status:", data)

        setIsChecking(false)
      } catch (err) {
        console.error("Error reading user data:", err)
        router.push("/")
      }
    }

    checkUser()
  }, [router])

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
