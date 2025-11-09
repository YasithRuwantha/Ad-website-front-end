import { useState, useRef, useEffect } from "react"
import { Headset } from "lucide-react"
import SupportPage from "@/app/support/page"

let openChatFn: (() => void) | null = null;

export function openFloatingSupportChat() {
  if (openChatFn) openChatFn();
}


export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  openChatFn = () => setOpen(true);

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

  return (
    <>
      {/* Floating personality bubble */}
      {!open && (
        <div className="fixed z-50 bottom-24 right-6 flex flex-col items-end animate-fade-in">
          <div className="mb-2 flex items-center gap-2 bg-white shadow-lg rounded-xl px-4 py-2 border border-[#008060]">
            <span className="font-semibold text-[#008060] text-sm">Hi! Need help?</span>
            <span className="inline-block">
              <span className="inline-block animate-wiggle">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=SupportBot" alt="Support Bot" className="w-8 h-8 rounded-full border-2 border-[#008060] bg-white" />
              </span>
            </span>
          </div>
        </div>
      )}
      {/* Floating button */}
      <button
        className="fixed z-50 bottom-4 right-4 bg-[#008060] hover:bg-[#36c160] text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#008060] sm:bottom-6 sm:right-6"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open customer care chat"
      >
        <Headset className="w-7 h-7" />
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
