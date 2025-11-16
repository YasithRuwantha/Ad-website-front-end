import { useState, useRef, useEffect } from "react"
import { Headset } from "lucide-react"
import SupportPage from "@/app/support/page"

let openChatFn: (() => void) | null = null;

export function openFloatingSupportChat() {
  if (openChatFn) openChatFn();
}


export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  openChatFn = () => setOpen(true);

  // Listen for sidebar-toggle event (mobile sidebar open/close)
  useEffect(() => {
    function handleSidebarToggle(e: any) {
      setSidebarOpen(!!(e.detail && e.detail.isOpen))
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle)
    return () => window.removeEventListener('sidebar-toggle', handleSidebarToggle)
  }, [])

  // Close chat when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Hide chat UI if sidebar is open and on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (sidebarOpen && isMobile) return null;

  return (
    <>
      {/* Floating personality bubble */}
      {!open && (
        <div className="fixed z-50 bottom-13 right-2 md:bottom-22 md:right-8 flex flex-col items-end animate-fade-in">
          <div
            className="mb-2 flex items-center gap-2 bg-white shadow-lg rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 border border-[#008060] md:mb-4 md:gap-3"
            style={{ marginRight: '2px' }}
          >
            <span className="font-semibold text-[#008060] text-xs sm:text-sm md:text-base">Hi! Need help?</span>
            <span className="inline-block">
              <span className="inline-block animate-wiggle">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=SupportBot" alt="Support Bot" className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 border-[#008060] bg-white" />
              </span>
            </span>
          </div>
        </div>
      )}
      {/* Floating button */}
      <button
        className="fixed z-50 bottom-4 right-2 sm:bottom-4 sm:right-4 md:bottom-8 md:right-8 bg-[#008060] hover:bg-[#36c160] text-white rounded-full shadow-lg w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#008060]"
        style={{ marginRight: '2px' }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open customer care chat"
      >
        <Headset className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
      </button>
      {/* Chat box modal */}
      {open && (
        <div
          ref={chatRef}
          className="fixed z-[9999] bottom-0 right-0 sm:bottom-6 sm:right-6 pointer-events-auto"
          style={{ maxHeight: '95vh' }}
        >
          <SupportPage isFloatingChat hideTitle />
          <button
            className="absolute top-2 right-2 z-50 text-white bg-[#008060] hover:bg-[#36c160] rounded-full w-8 h-8 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-[#008060]"
            onClick={() => setOpen(false)}
            aria-label="Close support chat"
          >
            ×
          </button>
        </div>
      )}
      {/* Add keyframes for wiggle animation */}
      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite;
        }
      `}</style>
    </>
  )
}
