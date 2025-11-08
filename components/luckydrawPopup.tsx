"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface PopupProps {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  navigateTo?: string
  imageURL?: string
  planName?: string // e.g., "Advanced"
}

interface UserData {
  fullName: string
  email: string
  phone: string
  plan: string
  balance: number
}

const plans = [
  { name: "Starter", price: 100 },
  { name: "Basic", price: 300 },
  { name: "Beginner", price: 500 },
  { name: "Advanced", price: 1000 },
  { name: "Professional", price: 1500 },
  { name: "Premium", price: 2000 }
]

export default function Popup({
  open,
  onClose,
  title,
  children,
  navigateTo,
  imageURL,
  planName
}: PopupProps) {
  if (!open) return null
  const router = useRouter()

  const [user, setUser] = useState<UserData | null>(null)
  const [depositNeeded, setDepositNeeded] = useState<number | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      const balance = userData.balance || 0
      const currentPlan = userData.plan || "Starter"
      const currentPlanObj = plans.find(p => p.name === currentPlan)
      const targetPlan = plans.find(p => p.name === planName)

      if (targetPlan && currentPlanObj) {
        const needed = targetPlan.price - balance
        setDepositNeeded(needed > 0 ? needed : 0)
      }

      setUser({ ...userData, balance })
    }
  }, [planName])

  const handleClaim = () => {
    onClose()
    if (navigateTo) router.push(navigateTo)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-2xl w-96 max-w-sm transform transition-transform duration-300 scale-95 animate-scaleIn">
        {/* Image */}
        {imageURL && (
          <div className="mb-4">
            <img
              src={imageURL}
              alt="Popup image"
              className="w-full h-40 object-cover rounded-xl shadow-md"
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {title}
          </h2>
        )}

        {/* User Info */}
        {user && (
          <div className="text-gray-700 dark:text-gray-200 text-sm mb-4 space-y-2">
            <p><strong>💰 Balance:</strong> ${user.balance}</p>
            <p><strong>📦 Current Plan:</strong> {user.plan}</p>
            {planName && (
              <p>
                <strong>🎯 Target Plan:</strong> {planName}
              </p>
            )}
            {depositNeeded !== null && planName && (
              <p>
                <strong>🪙 Additional Deposit Needed:</strong>{" "}
                {depositNeeded > 0 ? `$${depositNeeded}` : "You already qualify!"}
              </p>
            )}
          </div>
        )}

        {/* Children content */}
        <div className="text-gray-700 dark:text-gray-200 text-sm space-y-2 text-center">
          {children}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleClaim}
            className="w-full py-2 px-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Claim !
          </button>
        </div>
      </div>
    </div>
  )
}
