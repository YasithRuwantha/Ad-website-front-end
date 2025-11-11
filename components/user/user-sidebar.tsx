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
  Receipt,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function UserSidebar() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  const [showTermsSubmenu, setShowTermsSubmenu] = useState(false)

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    // { label: "Ads", href: "/ads", icon: FileText },
    { label: "Products", href: "/products", icon: ShoppingBag },
    { label: "Earnings", href: "/earnings", icon: TrendingUp },
    // { label: "Referrals", href: "/referrals", icon: Users },
    { label: "Support", href: "/support", icon: MessageSquare },
    { label: "Plans", href: "/dashboard/plans", icon: CreditCard },
    { label: "Add Funds", href: "/dashboard/add-funds", icon: DollarSign },
    { label: "Add Funds History", href: "/dashboard/add-funds-history", icon: Receipt },
    { label: "Payout", href: "/dashboard/payout", icon: Send },
    { label: "Payout History", href: "/dashboard/payout-history", icon: History },
    // { label: "Fund Transfer", href: "/dashboard/fund-transfer", icon: Send },
    // { label: "test", href: "/test", icon: Send },
  ]

  const helpCenterItems = [
    { label: "About us", href: "/help/about-us" },
    { label: "Privacy and data protection", href: "/help/privacy" },
    { label: "Agreement", href: "/help/agreement" },
    { label: "VIP Level", href: "/help/vip-level" },
    // { label: "Use Policy", href: "/help/terms-conditions" },
    // { label: "FAQ", href: "/help/faq" },
  ]

  const termsSubmenu = [
    { label: "About pending and On-hold orders", href: "/help/terms/pending-orders" },
    { label: "About Payout", href: "/help/terms/payout" },
    { label: "About add funds", href: "/help/terms/add-funds" },
    { label: "About Lucky products", href: "/help/terms/lucky-products" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-900"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar - Collapsed on desktop with hover-to-expand */}
      <aside
        className={`group/sidebar fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300 z-50 overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        w-64 md:w-18 md:hover:w-64`}
      >
        {/* Mobile Header with Logo and Profile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => {
              router.push('/dashboard/profile')
              setIsOpen(false)
            }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">Dashboard</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">{item.label}</span>
                </Button>
              </Link>
            )
          })}

          {/* Help Center Section */}
          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={() => setShowHelpCenter(!showHelpCenter)}
              className="w-full justify-start gap-3 text-gray-700 hover:bg-green-50 hover:text-green-600"
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity flex-1 text-left">
                Help Center
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform md:opacity-0 md:group-hover/sidebar:opacity-100 ${
                  showHelpCenter ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Help Center Sub-items */}
            {showHelpCenter && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-200 pl-2">
                {helpCenterItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-sm ${
                          isActive
                            ? "bg-green-50 text-green-600 font-semibold"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                        }`}
                      >
                        <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">
                          {item.label}
                        </span>
                      </Button>
                    </Link>
                  )
                })}

                {/* Use Policy with Sub-submenu */}
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowTermsSubmenu(!showTermsSubmenu)}
                    className="w-full justify-start text-sm text-gray-600 hover:bg-green-50 hover:text-green-600"
                  >
                    <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity flex-1 text-left">
                      Use Policy
                    </span>
                    <ChevronRight
                      className={`w-3 h-3 flex-shrink-0 transition-transform md:opacity-0 md:group-hover/sidebar:opacity-100 ${
                        showTermsSubmenu ? "rotate-90" : ""
                      }`}
                    />
                  </Button>

                  {/* Terms Sub-submenu */}
                  {showTermsSubmenu && (
                    <div className="ml-3 mt-1 space-y-1 border-l-2 border-green-100 pl-2">
                      {termsSubmenu.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start text-xs ${
                                isActive
                                  ? "bg-green-50 text-green-600 font-semibold"
                                  : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                              }`}
                            >
                              <span className="whitespace-nowrap md:opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity">
                                {item.label}
                              </span>
                            </Button>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
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
