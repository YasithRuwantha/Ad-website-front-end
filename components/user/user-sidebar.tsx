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
} from "lucide-react"
import Link from "next/link"

export default function UserSidebar() {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Ads", href: "/user/ads", icon: FileText },
    { label: "Products", href: "/user/products", icon: ShoppingBag },
    { label: "Earnings", href: "/user/earnings", icon: TrendingUp },
    { label: "Referrals", href: "/user/referrals", icon: Users },
    { label: "Support", href: "/user/support", icon: MessageSquare },
    { label: "Plans", href: "/user/dashboard/plans", icon: CreditCard },
    { label: "Payout", href: "/user/dashboard/payout", icon: DollarSign },
    { label: "Payout History", href: "/user/dashboard/payout-history", icon: History },
    { label: "Fund Transfer", href: "/user/dashboard/fund-transfer", icon: Send },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Dashboard</h1>
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
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
