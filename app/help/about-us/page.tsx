"use client"


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Target, Users, TrendingUp, User, ChevronDown, LogOut, Settings } from "lucide-react"
import UserSidebar from "@/components/user/user-sidebar"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import shopifyFullLogo from "@/public/shopifyFullLogo.png"

export default function HelpAboutUsPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        router.push("/")
        return
      }

      const user = JSON.parse(storedUser)

      if (user.role !== "user") {
        router.push("/")
        return
      }

      setUserName(user.name || "User")
      setUserEmail(user.email || "")
      setIsChecking(false)
    } catch (err) {
      console.error("Error reading user data:", err)
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header with Profile */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-4 md:px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>

          {/* Profile Section */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Us</h1>
            <p className="text-gray-600">Learn more about Shopify</p>
          </div>

          <div className="mt-6">
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-16 animate-fade-in">
              {/* <div className="inline-block mb-4 md:mb-6">
                <div className="flex justify-center my-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-16" />
                </div>
              </div> */}
              <h1 className="flex items-center flex-wrap justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 gap-2">
              Welcome to 
              <Image
                src={shopifyFullLogo}
                alt="shopifyfulllog"
                className="inline-block w-65 h-18 m-5"
              />
            </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                Empowering millions of entrepreneurs worldwide to turn their dreams into successful businesses. 
                Join us on a journey to make commerce better for everyone!
              </p>
            </div>

            {/* Who We Are Section */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 md:mb-12 border border-green-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who We Are</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                We are <span className="font-semibold text-green-600">Shopify</span>, dedicated to helping entrepreneurs succeed in business. Since 2006, our mission has been to make selling online accessible and straightforward for everyone—no coding required.
              </p>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                What started as a small idea in Ottawa, Canada, has grown into a global platform. Today, we proudly serve <span className="font-bold text-green-600">millions of merchants in over 175 countries</span>, supporting businesses of all sizes.
              </p>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 mt-4 md:mt-6 border-2 border-green-200">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center justify-around">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">2006</div>
                    <div className="text-xs md:text-sm text-gray-600">Founded</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-green-200"></div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">175+</div>
                    <div className="text-xs md:text-sm text-gray-600">Countries</div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-green-200"></div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">Millions</div>
                    <div className="text-xs md:text-sm text-gray-600">of Merchants</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 md:mb-12 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-green-500 rounded-full opacity-20 -mr-24 -mt-24 md:-mr-32 md:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-green-800 rounded-full opacity-20 -ml-16 -mb-16 md:-ml-24 md:-mb-24"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Our Mission</h2>
                    <p className="text-green-50 text-base sm:text-lg md:text-xl leading-relaxed">
                      <span className="font-semibold">Make commerce better for everyone.</span>
                    </p>
                  </div>
                </div>
                <p className="text-green-50 text-base md:text-lg leading-relaxed mb-4">
                  We are committed to breaking down barriers and providing the tools needed for business success. Whether you sell online, in-person, or both, our platform makes it easy to start, grow, and manage your business—all in one place.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 mt-4 md:mt-6 border border-white/20">
                  <p className="text-green-50 text-base md:text-lg italic">
                    Every entrepreneur deserves the chance to succeed, regardless of technical skills or budget.
                  </p>
                </div>
              </div>
            </div>

            {/* What We Do Section */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 md:mb-12 border border-gray-100">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">What We Do...</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600">Everything you need to run your business successfully!</p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                {/* Online Store Creation */}
                <div className="bg-green-50/80 rounded-2xl shadow-2xl border-2 border-green-500 hover:border-green-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-green-800 mb-3 tracking-tight">Build Your Store</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Create a stunning online store without writing a single line of code. Our drag-and-drop builder makes it simple and efficient.
                  </p>
                </div>

                {/* Point of Sale */}
                <div className="bg-blue-50/80 rounded-2xl shadow-2xl border-2 border-blue-500 hover:border-blue-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-blue-800 mb-3 tracking-tight">Sell Anywhere</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Sell online and in-person seamlessly. Our POS system keeps everything in sync so you can focus on your customers.
                  </p>
                </div>

                {/* Payment Processing */}
                <div className="bg-purple-50/80 rounded-2xl shadow-2xl border-2 border-purple-500 hover:border-purple-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-purple-800 mb-3 tracking-tight">Get Paid Easily</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Accept payments securely with Shopify Payments. Support for all major payment methods and currencies.
                  </p>
                </div>

                {/* Marketing & SEO */}
                <div className="bg-orange-50/80 rounded-2xl shadow-2xl border-2 border-orange-500 hover:border-orange-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-orange-800 mb-3 tracking-tight">Grow Your Audience</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Powerful marketing tools to attract and retain customers. Email, social media, SEO—we provide comprehensive solutions.
                  </p>
                </div>

                {/* Shipping & Fulfillment */}
                <div className="bg-teal-50/80 rounded-2xl shadow-2xl border-2 border-teal-500 hover:border-teal-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-teal-800 mb-3 tracking-tight">Ship with Ease</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Simplified shipping and order management. Print labels, track packages, and ensure customer satisfaction.
                  </p>
                </div>

                {/* Analytics */}
                <div className="bg-pink-50/80 rounded-2xl shadow-2xl border-2 border-pink-500 hover:border-pink-700 hover:shadow-3xl transition-all duration-300 p-8 md:p-10 flex flex-col justify-between min-h-[200px] transform hover:scale-[1.03]">
                  <h3 className="text-2xl font-extrabold text-pink-800 mb-3 tracking-tight">Make Smart Decisions</h3>
                  <p className="text-lg text-gray-800 font-medium">
                    Real-time insights and reports to help you understand what is working and accelerate your growth.
                  </p>
                </div>
              </div>

              {/* App Ecosystem Highlight */}
              <div className="mt-6 md:mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-green-200">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Thousands of Apps at Your Fingertips</h3>
                    <p className="text-gray-700 text-base md:text-lg">
                      Customize your store with apps for inventory, marketing, customer service, and more. Build the store you envision with our extensive app ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Technology */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 md:mb-12 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">Powerful Technology You Can Trust</h2>
                  <p className="text-blue-50 text-base md:text-lg leading-relaxed mb-2 md:mb-4">
                    Our cloud-based platform is built for speed, security, and scalability. Whether you are processing 10 orders or 10,000, we provide reliable performance.
                  </p>
                  <p className="text-blue-50 text-base md:text-lg leading-relaxed">
                    With our APIs and developer tools, you can customize your experience, connect your favorite apps, and integrate with other systems seamlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Community */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 md:mb-12 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="md:w-1/3 text-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-green-600">1M+</div>
                  <div className="text-gray-600 text-base md:text-lg">Community Members</div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Join Our Community</h2>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-3 md:mb-4">
                    Our vibrant community includes merchants, developers, designers, and partners from all over the world. We are here to help each other succeed.
                  </p>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-3 md:mb-4">
                    <span className="font-semibold text-green-600">Shopify Partner Program</span> connects you with experts who can help design, build, and optimize your store. Our App Store is filled with thousands of apps created by talented developers.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Future */}
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-teal-600 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 text-white mb-8 md:mb-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-green-500 rounded-full opacity-20 -mr-32 -mt-32 md:-mr-48 md:-mt-48"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-teal-700 rounded-full opacity-20 -ml-24 -mb-24 md:-ml-32 md:-mb-32"></div>
              <div className="relative z-10">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">The Future is Bright</h2>
                </div>
                <p className="text-green-50 text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-6 text-center max-w-4xl mx-auto">
                  We are constantly innovating with cutting-edge technologies such as <span className="font-bold">AI</span>, <span className="font-bold">AR/VR shopping experiences</span>, and <span className="font-bold">omnichannel solutions</span> to keep you ahead of the curve.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20">
                  <p className="text-white text-xl md:text-2xl font-semibold text-center mb-3 md:mb-4">
                    Our Vision
                  </p>
                  <p className="text-green-50 text-base md:text-lg text-center leading-relaxed">
                    Every entrepreneur, regardless of location or background, should have the tools and opportunity to succeed in the global economy. That is what we are building—together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
