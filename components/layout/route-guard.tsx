"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { canAccessRoute } from "@/lib/route-protection"

interface RouteGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
}

export default function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/")
      return
    }

    // Check if user has access to this route
    const hasAccess = canAccessRoute(user, pathname)

    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const hasAccess = canAccessRoute(user, pathname)

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
