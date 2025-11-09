"use client"

import FloatingSupportChat from "@/components/support/FloatingSupportChat"
import { usePathname } from "next/navigation"

export default function ClientFloatingSupportChatWrapper() {
  const pathname = usePathname()
  // Hide on /support and all /admin pages
  if (pathname.startsWith("/support") || pathname.startsWith("/admin")) return null
  return <FloatingSupportChat />
}
