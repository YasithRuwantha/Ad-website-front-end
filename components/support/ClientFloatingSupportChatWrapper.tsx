"use client"

import FloatingSupportChat from "@/components/support/FloatingSupportChat"
import { usePathname } from "next/navigation"

export default function ClientFloatingSupportChatWrapper() {
  const pathname = usePathname()
  // Hide on /support, all /admin pages, and the login page (root path)
  if (
    pathname === "/" ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/admin")
  ) return null
  return <FloatingSupportChat />
}
