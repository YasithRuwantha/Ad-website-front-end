"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Users, MessageSquare, LogOut, Menu, X, TrendingUp, Settings } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "ads", label: "Manage Ads", icon: FileText, href: "/admin/ads" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "support", label: "Support Tickets", icon: MessageSquare, href: "/admin/support" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, href: "/admin/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-primary/10 to-primary/5 border-r border-primary/20 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary/20">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold text-primary">Admin Panel</h1>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-primary hover:bg-primary/10"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-primary/10"
                }`}
                onClick={() => router.push(item.href)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Button>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-primary/20 space-y-3">
          {sidebarOpen && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Admin</p>
              <p className="font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-primary font-medium">ADMINISTRATOR</p>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-primary/30 text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-primary/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {menuItems.find((m) => m.id === currentPage)?.label || "Admin Dashboard"}
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
