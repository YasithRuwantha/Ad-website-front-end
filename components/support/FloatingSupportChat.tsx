import { useState } from "react"
import { MessageCircle } from "lucide-react"
import SupportPage from "@/app/support/page"

export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed z-50 bottom-4 right-4 bg-[#008060] hover:bg-[#36c160] text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#008060] sm:bottom-6 sm:right-6"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
      {/* Chat box modal */}
      {open && (
        <div className="fixed z-50 bottom-20 right-2 w-[98vw] max-w-[420px] sm:bottom-24 sm:right-6 sm:w-[95vw] sm:max-w-md bg-white border-2 border-[#008060] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
          style={{maxHeight: '90vh'}}>
          <div className="flex items-center justify-between bg-[#008060] px-3 py-2 sm:px-4">
            <span className="text-white font-bold text-base sm:text-lg">Support Chat</span>
            <button
              className="text-white hover:text-[#36c160] text-2xl font-bold ml-2"
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[75vh] sm:max-h-[80vh]">
            {/* Render the support chat UI here */}
            <SupportPage isFloatingChat />
          </div>
        </div>
      )}
    </>
  )
}
