"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  User,
} from "lucide-react"
import Link from "next/link"

export default function AdminSidebar() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  // Profile info
  const userName = user?.fullName || "Admin"
  const userEmail = user?.email || ""

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Ads", href: "/admin/ads", icon: FileText },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Fund Approvals", href: "/admin/fund-approvals", icon: DollarSign },
    { label: "Support", href: "/admin/support", icon: MessageSquare },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          {/* <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-6" /> */}
          <span className="text-lg font-bold text-gray-900">Admin panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-900"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Profile View Section */}
        <div className="p-4 border-b border-gray-200 flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mb-1">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-green-600 text-white hover:bg-green-700 my-1"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                  onClick={() => setIsOpen(false)} // Close on mobile click
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
