"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  TrendingUp,
  Users,
  MessageSquare,
  LogOut,
  CreditCard,
  DollarSign,
  Send,
  History,
  Menu,
  X,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UserSidebar() {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Ads", href: "/ads", icon: FileText },
    { label: "Products", href: "/products", icon: ShoppingBag },
    { label: "Earnings", href: "/earnings", icon: TrendingUp },
    { label: "Referrals", href: "/referrals", icon: Users },
    { label: "Support", href: "/support", icon: MessageSquare },
    { label: "Plans", href: "/dashboard/plans", icon: CreditCard },
    { label: "Payout", href: "/dashboard/payout", icon: DollarSign },
    { label: "Payout History", href: "/dashboard/payout-history", icon: History },
    { label: "Fund Transfer", href: "/dashboard/fund-transfer", icon: Send },
    { label: "test", href: "/test", icon: Send },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar">
        <h1 className="text-xl font-bold text-sidebar-foreground">Dashboard</h1>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar - Collapsed on desktop with hover-to-expand */}
      <aside
        className={`group/sidebar fixed md:static top-0 left-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col transform transition-all duration-300 z-50 overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        w-64 md:w-18 md:hover:w-64`}
      >
        <div className="p-6 border-b border-sidebar-border hidden md:block">
          <h1 className="text-2xl font-bold text-sidebar-foreground whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Background Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
