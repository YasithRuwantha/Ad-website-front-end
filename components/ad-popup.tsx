"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const DUMMY_ADS = [
  {
    id: "1",
    title: "Premium Laptop Sale",
    description: "Get 30% off on all premium laptops this week!",
    image: "/modern-laptop-workspace.png",
    cta: "Shop Now",
    color: "from-blue-500 to-blue-600",
    price: "$899",
    discount: "30% OFF",
    details: "High-performance laptops with latest processors, perfect for professionals and students.",
  },
  {
    id: "2",
    title: "Wireless Headphones",
    description: "Experience crystal clear sound with noise cancellation",
    image: "/diverse-people-listening-headphones.png",
    cta: "Learn More",
    color: "from-purple-500 to-purple-600",
    price: "$199",
    discount: "25% OFF",
    details: "Premium noise-cancelling headphones with 30-hour battery life and superior comfort.",
  },
  {
    id: "3",
    title: "Smart Watch Collection",
    description: "Track your fitness with our latest smartwatch models",
    image: "/modern-smartwatch.png",
    cta: "Explore",
    color: "from-pink-500 to-pink-600",
    price: "$299",
    discount: "20% OFF",
    details: "Advanced fitness tracking, heart rate monitoring, and water-resistant design.",
  },
  {
    id: "4",
    title: "Fast Charging Cables",
    description: "Durable USB-C cables with lifetime warranty",
    image: "/usb-cable.jpg",
    cta: "Buy Now",
    color: "from-green-500 to-green-600",
    price: "$29",
    discount: "15% OFF",
    details: "Heavy-duty cables with lifetime warranty, compatible with all USB-C devices.",
  },
  {
    id: "5",
    title: "Mechanical Keyboard",
    description: "Professional-grade keyboard for gaming and typing",
    image: "/mechanical-keyboard.png",
    cta: "Discover",
    color: "from-orange-500 to-orange-600",
    price: "$149",
    discount: "35% OFF",
    details: "RGB backlit mechanical keyboard with customizable switches and premium build quality.",
  },
  {
    id: "6",
    title: "4K Webcam",
    description: "Crystal clear video for streaming and conferencing",
    image: "/4k-webcam.png",
    cta: "View Details",
    color: "from-red-500 to-red-600",
    price: "$179",
    discount: "28% OFF",
    details: "Professional 4K webcam with auto-focus and built-in microphone for perfect video calls.",
  },
  {
    id: "7",
    title: "Portable SSD",
    description: "Fast and reliable storage on the go",
    image: "/portable-ssd.jpg",
    cta: "Get Now",
    color: "from-indigo-500 to-indigo-600",
    price: "$129",
    discount: "22% OFF",
    details: "1TB portable SSD with lightning-fast transfer speeds and rugged design.",
  },
  {
    id: "8",
    title: "USB Hub Pro",
    description: "Expand your connectivity with multiple ports",
    image: "/usb-hub.png",
    cta: "Shop",
    color: "from-cyan-500 to-cyan-600",
    price: "$59",
    discount: "18% OFF",
    details: "7-in-1 USB hub with high-speed data transfer and power delivery support.",
  },
]

function AdDetailModal({ ad, onClose }: { ad: (typeof DUMMY_ADS)[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className={`h-64 md:h-full bg-gradient-to-br ${ad.color} rounded-lg overflow-hidden`}>
            <img
              src={ad.image || "/placeholder.svg"}
              alt={ad.title}
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-bold text-foreground">{ad.title}</h2>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {ad.discount}
                </span>
              </div>
              <p className="text-muted-foreground">{ad.description}</p>
            </div>

            <div className="border-t border-primary/20 pt-4">
              <p className="text-sm text-muted-foreground mb-1">Details</p>
              <p className="text-foreground">{ad.details}</p>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="text-3xl font-bold text-primary">{ad.price}</p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold">{ad.cta}</Button>
              <Button onClick={onClose} variant="outline" className="flex-1 border-primary/20 bg-transparent">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdPopup() {
  const [selectedAd, setSelectedAd] = useState<(typeof DUMMY_ADS)[0] | null>(null)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const currentAd = DUMMY_ADS[currentAdIndex]

  const handleNext = () => {
    setCurrentAdIndex((prev) => (prev + 1) % DUMMY_ADS.length)
  }

  const handlePrev = () => {
    setCurrentAdIndex((prev) => (prev - 1 + DUMMY_ADS.length) % DUMMY_ADS.length)
  }

  return (
    <>
      {/* Ad Grid - Always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DUMMY_ADS.map((ad) => (
          <div
            key={ad.id}
            onClick={() => setSelectedAd(ad)}
            className="bg-white border border-primary/20 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className={`h-40 bg-gradient-to-br ${ad.color} relative overflow-hidden`}>
              <img
                src={ad.image || "/placeholder.svg"}
                alt={ad.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <span className="absolute top-2 right-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                {ad.discount}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-bold text-foreground line-clamp-2">{ad.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-primary">{ad.price}</span>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  {ad.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ad Detail Modal - Shows when ad is clicked */}
      {selectedAd && <AdDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />}
    </>
  )
}
