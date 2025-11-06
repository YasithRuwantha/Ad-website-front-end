"use client"

import { useRouter } from "next/navigation"
import { Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"

export default function PlansPage() {
  const router = useRouter()
  const [isFooterVisible, setIsFooterVisible] = useState(false)
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

  const plans = [
    {
      name: "Starter",
      price: "$100",
      investment: "$100",
      description: "Get started with basic ad clicks at no cost!",
      period: "Unlimited",
      productLimit: "10",
      profit15: "$15",
      profit20: "$20",
      profitRange: "$15-$20",
      icon: "🎯",
      isPremium: false
    },
    {
      name: "Basic",
      price: "$300",
      investment: "$300",
      description: "Perfect for beginners looking to grow!",
      period: "Unlimited",
      productLimit: "20",
      profit15: "$45",
      profit20: "$60",
      profitRange: "$45-$60",
      icon: "🚀",
      isPremium: false
    },
    {
      name: "Beginner",
      price: "$500",
      investment: "$500",
      description: "Start earning with more opportunities!",
      period: "Unlimited",
      productLimit: "30",
      profit15: "$75",
      profit20: "$100",
      profitRange: "$75-$100",
      icon: "⭐",
      isPremium: false
    },
    {
      name: "Advanced",
      price: "$1,000",
      investment: "$1,000",
      description: "Take your earnings to the next level!",
      period: "Unlimited",
      productLimit: "50",
      profit15: "$150",
      profit20: "$200",
      profitRange: "$150-$200",
      icon: "💎",
      isPremium: true
    },
    {
      name: "Professional",
      price: "$1,500",
      investment: "$1,500",
      description: "Professional tier with maximum returns!",
      period: "Unlimited",
      productLimit: "75",
      profit15: "$225",
      profit20: "$300",
      profitRange: "$225-$300",
      icon: "👑",
      isPremium: true
    },
    {
      name: "Premium",
      price: "$2,000",
      investment: "$2,000",
      description: "Ultimate earning potential unlocked!",
      period: "Unlimited",
      productLimit: "100",
      profit15: "$300",
      profit20: "$400",
      profitRange: "$300-$400",
      icon: "🏆",
      isPremium: true
    }
  ]

  const handlePurchase = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300">About</a>
            <a href="/plans" className="text-green-600 font-medium">Plan</a>
            <a href="/faq" className="text-green-600 font-medium">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the perfect plan to start earning today</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 border-2 transition-all duration-500 transform hover:scale-105 relative ${
                plan.isPremium 
                  ? 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-yellow-400 hover:border-yellow-500 hover:shadow-2xl shadow-xl' 
                  : 'bg-white border-gray-200 hover:border-green-500 hover:shadow-2xl'
              }`}
            >
              {/* Premium Badge */}
              {plan.isPremium && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  ⭐ PREMIUM
                </div>
              )}

              {/* Icon */}
              <div className="text-5xl mb-4">{plan.icon}</div>

              {/* Plan Name */}
              <h3 className={`text-2xl font-bold mb-2 ${plan.isPremium ? 'text-yellow-900' : 'text-gray-900'}`}>
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className={`text-5xl font-bold ${plan.isPremium ? 'text-yellow-800' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
              </div>

              {/* Description */}
              <p className={`mb-6 ${plan.isPremium ? 'text-yellow-800' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    plan.isPremium ? 'bg-yellow-200' : 'bg-green-100'
                  }`}>
                    <svg className={`w-3 h-3 ${plan.isPremium ? 'text-yellow-700' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className={`text-sm ${plan.isPremium ? 'text-yellow-900' : 'text-gray-700'}`}>
                    Period: {plan.period}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    plan.isPremium ? 'bg-yellow-200' : 'bg-green-100'
                  }`}>
                    <svg className={`w-3 h-3 ${plan.isPremium ? 'text-yellow-700' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className={`text-sm ${plan.isPremium ? 'text-yellow-900' : 'text-gray-700'}`}>
                    Daily Product Limit: {plan.productLimit}
                  </span>
                </div>
              </div>

              {/* Profit Information */}
              <div className={`rounded-lg p-4 mb-6 ${
                plan.isPremium ? 'bg-yellow-100 border border-yellow-300' : 'bg-green-50 border border-green-200'
              }`}>
                <h4 className={`text-sm font-bold mb-3 ${plan.isPremium ? 'text-yellow-900' : 'text-green-900'}`}>
                  Expected Profit (15-20% Return)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${plan.isPremium ? 'text-yellow-800' : 'text-gray-600'}`}>
                      15% Profit:
                    </span>
                    <span className={`text-sm font-bold ${plan.isPremium ? 'text-yellow-900' : 'text-green-700'}`}>
                      {plan.profit15}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${plan.isPremium ? 'text-yellow-800' : 'text-gray-600'}`}>
                      20% Profit:
                    </span>
                    <span className={`text-sm font-bold ${plan.isPremium ? 'text-yellow-900' : 'text-green-700'}`}>
                      {plan.profit20}
                    </span>
                  </div>
                  <div className={`mt-2 pt-2 border-t ${plan.isPremium ? 'border-yellow-300' : 'border-green-300'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-semibold ${plan.isPremium ? 'text-yellow-900' : 'text-gray-700'}`}>
                        Profit Range:
                      </span>
                      <span className={`text-base font-bold ${plan.isPremium ? 'text-yellow-900' : 'text-green-700'}`}>
                        {plan.profitRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-105 shadow-md hover:shadow-lg ${
                  plan.isPremium
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <span>Purchase Plan</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
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
