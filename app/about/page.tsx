"use client"

import { useEffect, useRef, useState } from "react"
import { Facebook, Twitter, Linkedin, Instagram, Send, Target, Users, Award, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AboutPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-gray-900">EarningHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-green-600 font-medium">About</a>
            <a href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300">Plan</a>
            <a href="/terms" className="text-gray-700 hover:text-green-600 transition-all duration-300">Terms & Condition</a>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About EarningHub</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a leading platform dedicated to helping people earn money online through product evaluations 
              and reviews. Our mission is to create opportunities for everyone to generate income from home.
            </p>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To empower individuals worldwide with flexible earning opportunities by connecting them with 
                premium brands and products. We believe everyone deserves the chance to earn money on their own 
                terms, from anywhere in the world.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the world's most trusted platform for online earning, revolutionizing how people generate 
                income through product evaluations. We aim to create a global community of successful earners who 
                achieve financial freedom.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-12 mb-16 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-green-100 text-sm md:text-base">Active Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
                <div className="text-green-100 text-sm md:text-base">Products Reviewed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">$5M+</div>
                <div className="text-green-100 text-sm md:text-base">Paid to Users</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-green-100 text-sm md:text-base">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Choose EarningHub?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Work</h3>
                <p className="text-gray-600">
                  Work anytime, anywhere. Set your own schedule and earn at your own pace. No fixed hours, complete freedom.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">High Earnings</h3>
                <p className="text-gray-600">
                  Competitive commission rates with bonus opportunities. Earn up to $200 daily with our premium plans.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h3>
                <p className="text-gray-600">
                  Your data and earnings are protected with bank-level security. Fast and reliable payment processing.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Brands</h3>
                <p className="text-gray-600">
                  Work with top luxury brands like Gucci, Louis Vuitton, Rolex, and more. Access exclusive products.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Growth Potential</h3>
                <p className="text-gray-600">
                  Start small and scale up. Multiple plan tiers to match your goals. Unlimited earning potential.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is always here to help. Get assistance whenever you need it.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Up</h3>
                <p className="text-gray-600 text-sm">
                  Create your free account and choose a plan that fits your goals
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Products</h3>
                <p className="text-gray-600 text-sm">
                  Receive daily product assignments based on your plan level
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Evaluate</h3>
                <p className="text-gray-600 text-sm">
                  Complete product evaluations and submit your reviews
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Earn Money</h3>
                <p className="text-gray-600 text-sm">
                  Get paid instantly for each completed evaluation
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful earners who are already making money with EarningHub. 
              Get started today and unlock your earning potential!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Get Started Now
              </a>
              <a
                href="/plans"
                className="bg-green-800 hover:bg-green-900 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
              >
                View Plans
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gray-900 text-white mt-auto overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className={`col-span-1 transition-all duration-1000 ease-out ${isFooterVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-white text-lg">EarningHub</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                We are a award winning multinational company. We believe quality and standard worldwide consider.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white hover:bg-green-600 rounded-full flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-white hover:bg-green-600 rounded-full flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-white hover:bg-green-600 rounded-full flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-white hover:bg-green-600 rounded-full flex items-center justify-center text-gray-900 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
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
                <li><a href="/terms" className="text-gray-400 hover:text-green-600 transition-all duration-300 text-sm hover:translate-x-1 inline-block">Terms & Condition</a></li>
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
              Copyright © 2025 <span className="text-green-600 font-semibold">EarningHub</span> All Rights Reserved
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
