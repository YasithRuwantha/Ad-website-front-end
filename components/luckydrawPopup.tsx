"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface PopupProps {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
  navigateTo?: string
  imageURL?: string
  planName?: string
  luckorder?: string
  topgradeorder?: string
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

/* --------------------------------------------------------------
   Helper – fire confetti + start star animation when popup opens
   -------------------------------------------------------------- */
function useCelebration(open: boolean) {
  useEffect(() => {
    if (!open) return

    // 1. Confetti burst
    const end = Date.now() + 800
    const colors = ["#FFD700", "#FF4500", "#32CD32", "#00CED1"]
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval)

      confetti({
        particleCount: 6,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0.6 },
        colors,
        scalar: 1.2
      })
    }, 120)

    // 2. Trigger star animation (CSS class added to body)
    document.body.classList.add("celebrate-stars")
    return () => {
      document.body.classList.remove("celebrate-stars")
      clearInterval(interval)
    }
  }, [open])
}

/* --------------------------------------------------------------
   Main Popup
   -------------------------------------------------------------- */
export default function Popup({
  open,
  onClose,
  title,
  children,
  navigateTo,
  imageURL,
  planName,
  luckorder,
  topgradeorder
}: PopupProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [depositNeeded, setDepositNeeded] = useState<number | null>(null)
  const [displayText, setDisplayText] = useState<string>("")
  const [displayHeader, setDisplayHeader] = useState<string>("")

  // Celebration hook
  useCelebration(open)

  /* --------------------------------------------------------------
     Load user + compute deposit + decide copy
     -------------------------------------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      const balance = u.balance ?? 0
      const curPlan = u.plan ?? "Starter"
      const cur = plans.find(p => p.name === curPlan)
      const target = plans.find(p => p.name === planName)

      if (target && cur) {
        const needed = target.price - balance
        setDepositNeeded(needed > 0 ? needed : 0)
      }

      setUser({ ...u, balance })
    }

    // ----- Header / Body copy -------------------------------------------------
    if (luckorder === "active" && topgradeorder !== "active") {
      setDisplayHeader("Congratulations! You Won a Lucky Order")
      setDisplayText(
        "You received a Lucky Order! Please contact customer service to claim your prize."
      )
    } else if (topgradeorder === "active" && luckorder !== "active") {
      setDisplayHeader("Congratulations! You Won a Top-Grade Order")
      setDisplayText(
        "You received a Top-Grade Order! Contact support to get your reward."
      )
    } else if (luckorder === "active" && topgradeorder === "active") {
      setDisplayHeader("Double Win! Lucky + Top-Grade Orders")
      setDisplayText(
        "Both orders are active! Reach out to customer service right now!"
      )
    } else {
      setDisplayHeader("No active orders")
      setDisplayText("Check back later for new offers.")
    }
  }, [planName, luckorder, topgradeorder])

  const handleClaim = () => {
    onClose()
    if (navigateTo) router.push(navigateTo)
  }

  if (!open) return null

  return (
    <>
      {/* ----------------- GLOBAL STARS (bottom → top) ----------------- */}
      <style jsx global>{`
        @keyframes starRise {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        .celebrate-stars::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: transparent;
          z-index: 48;
        }
        .celebrate-stars::after {
          content: "";
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 200px;
          background: linear-gradient(
            to top,
            transparent,
            rgba(255, 215, 0, 0.15)
          );
          pointer-events: none;
          z-index: 48;
        }
        .star {
          position: fixed;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, #ffd700, #ff8c00);
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
          animation: starRise linear infinite;
          pointer-events: none;
          z-index: 49;
        }
        .celebrate-stars .star:nth-child(1) { left: 12%; animation-duration: 2.2s; animation-delay: 0s; }
        .celebrate-stars .star:nth-child(2) { left: 28%; animation-duration: 2.6s; animation-delay: 0.3s; }
        .celebrate-stars .star:nth-child(3) { left: 44%; animation-duration: 2.1s; animation-delay: 0.6s; }
        .celebrate-stars .star:nth-child(4) { left: 58%; animation-duration: 2.8s; animation-delay: 0.9s; }
        .celebrate-stars .star:nth-child(5) { left: 72%; animation-duration: 2.4s; animation-delay: 1.2s; }
        .celebrate-stars .star:nth-child(6) { left: 86%; animation-duration: 2.5s; animation-delay: 1.5s; }
      `}</style>

      {/* ----------------- STARS (generated in JSX) ----------------- */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="star" />
      ))}

      {/* ----------------- POPUP ----------------- */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-2xl ring-4 ring-amber-300/50"
        >
          {/* Pulsating shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer" />

          {/* Image */}
          {imageURL && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={imageURL}
                alt="Reward"
                className="h-48 w-full object-cover"
              />
            </motion.div>
          )}

          {/* Header – animated text */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-center text-2xl font-bold text-transparent md:text-3xl"
          >
            {displayHeader}
          </motion.h2>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 text-center text-sm text-gray-700 md:text-base"
          >
            {displayText}
          </motion.p>

          {/* Optional children (e.g. deposit info) */}
          {children && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-center text-sm text-gray-600"
            >
              {children}
            </motion.div>
          )}

          {/* Claim button – bounce + glow */}
          <motion.div
            className="mt-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleClaim}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-bold text-white shadow-lg transition-all hover:shadow-2xl"
            >
              <span className="relative z-10">Claim Now!</span>
              <span className="absolute inset-0 bg-white/30 animate-ping" />
            </button>
          </motion.div>

          {/* Close X (optional) */}
          {/* <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-500 transition hover:bg-gray-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> */}
        </motion.div>
      </div>
    </>
  )
}

/* --------------------------------------------------------------
   Tailwind animation utilities (add to globals.css if needed)
   -------------------------------------------------------------- */