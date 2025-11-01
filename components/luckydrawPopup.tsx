"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation" // ✅ correct import

interface PopupProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  navigateTo?: string // optional prop for navigation
}

export default function Popup({ open, onClose, title, children, navigateTo }: PopupProps) {
  if (!open) return null

  const router = useRouter() // ✅ call the hook

    const handleClaim = () => {
    onClose() // close popup
    if (navigateTo) {
        router.push(navigateTo) // use prop value
    }
    }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-2xl w-96 max-w-sm transform transition-transform duration-300 scale-95 animate-scaleIn">
        
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="text-gray-700 dark:text-gray-200 text-sm space-y-2">
          {children}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleClaim} // ✅ navigate on click
            className="w-full py-2 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Claim !
          </button>
        </div>
      </div>
    </div>
  )
}
