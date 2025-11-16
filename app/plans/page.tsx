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
      description: "Get started with basic ad clicks at no cost.",
      period: "Unlimited",
      // productLimit: "10",
      profit15: "$15",
      profit20: "$20",
      profitRange: "$15 - $20",
      isPremium: false
    },
    {
      name: "Basic",
      price: "$300",
      investment: "$300",
      description: "Ideal for beginners aiming to grow steadily.",
      period: "Unlimited",
      // productLimit: "20",
      profit15: "$45",
      profit20: "$60",
      profitRange: "$45 - $60",
      isPremium: false
    },
    {
      name: "Beginner",
      price: "$500",
      investment: "$500",
      description: "Unlock more earning opportunities.",
      period: "Unlimited",
      // productLimit: "30",
      profit15: "$75",
      profit20: "$100",
      profitRange: "$75 - $100",
      isPremium: false
    },
    {
      name: "Advanced",
      price: "$1,000",
      investment: "$1,000",
      description: "A professional-level growth plan.",
      period: "Unlimited",
      // productLimit: "50",
      profit15: "$150",
      profit20: "$200",
      profitRange: "$150 - $200",
      isPremium: true
    },
    {
      name: "Professional",
      price: "$1,500",
      investment: "$1,500",
      description: "Advanced users seeking higher limits and returns.",
      period: "Unlimited",
      // productLimit: "75",
      profit15: "$225",
      profit20: "$300",
      profitRange: "$225 - $300",
      isPremium: true
    },
    {
      name: "Premium",
      price: "$2,000",
      investment: "$2,000",
      description: "Maximum-tier plan with top earnings.",
      period: "Unlimited",
      // productLimit: "100",
      profit15: "$300",
      profit20: "$400",
      profitRange: "$300 - $400",
      isPremium: true
    }
  ];

  const handlePurchase = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-8 justify-center w-full md:w-auto">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300">About</a>
            <a href="/plans" className="text-green-600 font-medium">Plan</a>
            <a href="/faq" className="text-green-600 font-medium">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      {/* Plans Section */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-2 md:px-0">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-600 mt-1">Select the plan that best fits your goals.</p>
        </div>

        <div className="w-full max-w-7xl flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 border shadow-lg transition-all duration-200 bg-white hover:shadow-2xl hover:-translate-y-1 group overflow-hidden flex flex-col items-center ${
                  plan.isPremium
                    ? "border-yellow-400 ring-2 ring-yellow-100"
                    : "border-gray-200"
                }`}
                style={{ minHeight: 420 }}
              >
                {/* Premium Badge */}
                {plan.isPremium && (
                  <span className="absolute top-5 right-5 z-10 bg-yellow-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.505l6.914-1.004L12 2.25l3.086 6.251L22 9.505l-5.007 4.617 1.179 6.873z" /></svg>
                    PREMIUM
                  </span>
                )}

                {/* Plan Name & Price */}
                <div className="flex flex-col items-center mb-2">
                  <h3 className={`text-2xl font-extrabold tracking-tight ${plan.isPremium ? "text-yellow-700" : "text-green-700"}`}>{plan.name}</h3>
                  <p className={`text-4xl font-black mt-2 ${plan.isPremium ? "text-yellow-700" : "text-green-700"}`}>{plan.price}</p>
                </div>

                {/* Description */}
                <p className="text-center text-gray-600 mb-4 min-h-[48px]">{plan.description}</p>

                {/* Details */}
                <div className="flex justify-center gap-6 mb-4 text-sm w-full">
                  <div className="flex flex-col items-center w-1/2">
                    <span className="font-semibold text-gray-800">{plan.period}</span>
                    <span className="text-gray-400">Period</span>
                  </div>
                  {/* <div className="flex flex-col items-center w-1/2">
                    <span className="font-semibold text-gray-800">{plan.productLimit}</span>
                    <span className="text-gray-400">Product Limit</span>
                  </div> */}
                </div>

                {/* Profit Box */}
                <div className={`mt-2 p-4 rounded-xl border-2 ${plan.isPremium ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"} flex flex-col items-center w-full`}> 
                  <h4 className={`font-semibold text-sm mb-1 ${plan.isPremium ? "text-yellow-800" : "text-green-800"}`}>Expected Profit <span className="font-normal">(15–20%)</span></h4>
                  <div className="flex gap-4 text-base font-bold">
                    <span className="text-gray-700">{plan.profit15} <span className="font-normal text-xs text-gray-400">15%</span></span>
                    <span className="text-gray-700">{plan.profit20} <span className="font-normal text-xs text-gray-400">20%</span></span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">Range: {plan.profitRange}</span>
                </div>

                {/* Purchase Button */}
                {/* <button
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
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </section>

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
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
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
