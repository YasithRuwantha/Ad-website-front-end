"use client"

import { useEffect, useRef, useState } from "react"
import { Facebook, Twitter, Linkedin, Instagram, Send, Target, Users, Award, TrendingUp, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import shopifylogo  from "@/public/shopifyLogo.png"
import ShopifyFullLogo from "@/public/shopifyFullLogo.png"
import Image from "next/image"

export default function AboutPage() {
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-green-600 font-medium">About</a>
            <a href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300">Plan</a>
            <a href="/faq" className="text-green-600 font-medium">FAQ</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300 px-2 py-2">Home</a>
              <a href="/about" className="text-green-600 font-medium px-2 py-2">About</a>
              <a href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300 px-2 py-2">Plan</a>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <div className="py-6 sm:py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
            {/* <div className="inline-block mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br flex items-center justify-center mx-auto">
                <Image src={shopifylogo} alt="shopify"/>
              </div>
            </div> */}
            <h1 className="flex items-center flex-wrap justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 gap-2">
              Welcome to 
              <Image
                src={ShopifyFullLogo}
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
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 sm:mb-12 border border-green-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Who We Are</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
              Hey there! We're <span className="font-semibold text-green-600">Shopify</span>, and we're passionate about helping people like you succeed in business. 
              Since 2006, we've been on a mission to make selling online super easy—no coding skills needed!
            </p>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
              What started as a small idea in Ottawa, Canada, has grown into something amazing. Today, we're proud to serve 
              <span className="font-bold text-green-600"> millions of merchants in over 175 countries</span>. 
              From local shops to global brands, we help everyone bring their ideas to life! 
            </p>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6 border-2 border-green-200">
              <div className="flex items-center gap-2 sm:gap-4 text-center justify-around flex-wrap">
                <div className="flex-1 min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">2006</div>
                  <div className="text-xs sm:text-sm text-gray-600">Founded</div>
                </div>
                <div className="w-px h-8 sm:h-12 bg-green-200"></div>
                <div className="flex-1 min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">175+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Countries</div>
                </div>
                <div className="w-px h-8 sm:h-12 bg-green-200"></div>
                <div className="flex-1 min-w-[80px]">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">Millions</div>
                  <div className="text-xs sm:text-sm text-gray-600">of Merchants</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-green-500 rounded-full opacity-20 -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-green-800 rounded-full opacity-20 -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Our Mission </h2>
                  <p className="text-green-50 text-lg sm:text-xl leading-relaxed">
                    <span className="font-semibold">Make commerce better for everyone.</span> Simple as that!
                  </p>
                </div>
              </div>
              <p className="text-green-50 text-base sm:text-lg leading-relaxed mb-4">
                We're here to break down barriers and give you all the tools you need to succeed. Whether you're selling 
                online, in-person, or both—we've got your back! Our platform makes it easy to start, grow, and manage your 
                business, all in one place. 
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6 border border-white/20">
                <p className="text-green-50 text-base sm:text-lg italic">
                  "Because every entrepreneur deserves the chance to succeed, regardless of their technical skills or budget." 
                </p>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 sm:mb-12 border border-gray-100">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What We Do</h2>
              <p className="text-lg sm:text-xl text-gray-600">Everything you need to run your business successfully!</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Online Store Creation */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Build Your Store</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Create a stunning online store without writing a single line of code! Our drag-and-drop builder makes it fun and easy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Point of Sale */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Sell Anywhere</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Sell online and in-person seamlessly! Our POS system keeps everything in sync so you can focus on your customers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Processing */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Get Paid Easily</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Accept payments securely with Shopify Payments. Support for all major payment methods and currencies!
                    </p>
                  </div>
                </div>
              </div>

              {/* Marketing & SEO */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Grow Your Audience</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Powerful marketing tools to attract and keep customers coming back. Email, social media, SEO—we've got it all!
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping & Fulfillment */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ship with Ease</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Simplified shipping and order management. Print labels, track packages, and keep customers happy!
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Make Smart Decisions</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Real-time insights and reports to help you understand what's working and grow even faster!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Ecosystem Highlight */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Thousands of Apps at Your Fingertips!</h3>
                  <p className="text-gray-700 text-base sm:text-lg">
                    Customize your store with apps for everything—inventory, marketing, customer service, and more. 
                    Build exactly the store you've always dreamed of! 
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Technology */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Powerful Technology You Can Trust</h2>
                <p className="text-blue-50 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                  Don't worry about the technical stuff—we've got it covered! Our cloud-based platform is built for 
                  speed, security, and scalability. Whether you're getting 10 orders or 10,000, we can handle it! 
                </p>
                <p className="text-blue-50 text-base sm:text-lg leading-relaxed">
                  Plus, with our APIs and developer tools, you can customize everything to work exactly how you want. 
                  Connect your favorite apps, integrate with other systems, and make it uniquely yours! 
                </p>
              </div>
            </div>
          </div>

          {/* Our Community */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl mb-8 sm:mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="md:w-1/3 text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-green-600">1M+</div>
                <div className="text-gray-600 text-base sm:text-lg">Community Members</div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Join Our Amazing Community!</h2>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                  You're not alone on this journey! Our vibrant community includes merchants, developers, designers, 
                  and partners from all over the world. We're all here to help each other succeed! 
                </p>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                  <span className="font-semibold text-green-600">Shopify Partner Program</span> connects you with experts 
                  who can help design, build, and optimize your store. And our App Store? It's packed with thousands of 
                  apps created by talented developers just like you!
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <span className="bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"> Merchants</span>
                  <span className="bg-blue-100 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"> Developers</span>
                  <span className="bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"> Designers</span>
                  <span className="bg-orange-100 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"> Partners</span>
                  <span className="bg-pink-100 text-pink-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"> Affiliates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Our Future */}
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-teal-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white mb-8 sm:mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-500 rounded-full opacity-20 -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-teal-700 rounded-full opacity-20 -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">The Future is Bright!</h2>
              </div>
              <p className="text-green-50 text-lg sm:text-xl leading-relaxed mb-4 sm:mb-6 text-center max-w-4xl mx-auto">
                We're constantly innovating with cutting-edge technologies like <span className="font-bold">AI</span>, 
                <span className="font-bold"> AR/VR shopping experiences</span>, and 
                <span className="font-bold"> omnichannel solutions</span> to keep you ahead of the curve!
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/20">
                <p className="text-white text-xl sm:text-2xl font-semibold text-center mb-3 sm:mb-4">
                  🌍 Our Vision
                </p>
                <p className="text-green-50 text-base sm:text-lg text-center leading-relaxed">
                  Every entrepreneur, no matter where they are or who they are, should have the tools and opportunity 
                  to succeed in the global economy. That's what we're building—together! 
                </p>
              </div>
            </div>
          </div>

          
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 mb-4 text-center">
        <a
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Back to Home
        </a>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gray-900 text-white mt-auto overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className={`col-span-1 transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
              </div>
              <p className="text-gray-400 text-sm mb-6">
                We are a award winning multinational company. We believe quality and standard worldwide consider.
              </p>
            </div>

            {/* Quick Links */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">About</a></li>
                <li><a href="/plans" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Plan</a></li>
              </ul>
            </div>

            {/* Company Policy */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Company Policy
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <ul className="space-y-3">
                <li><a href="/faq" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className={`transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h3 className="text-lg font-semibold mb-4 relative inline-block">
                Newsletter
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-green-600"></span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get our offers & news in your inbox
              </p>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-white text-gray-900 border-none rounded-full pl-4 pr-12 py-6 focus:ring-2 focus:ring-green-600 transition-all duration-300"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={`border-t border-gray-800 transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Copyright © 2025 <span className="text-green-600 font-semibold">Shopify</span> All Rights Reserved
            </p>
            <div className="text-green-600 text-sm font-medium mt-2 md:mt-0">
              English
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
