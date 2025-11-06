"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Home, ChevronRight, Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const [success, setSuccess] = useState("")
  const [phone, setPhone] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const message = await signup(email, password, name, phone, referralCode);
        setSuccess(message); // ✅ show success message
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</a>
            <a href="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300">About</a>
            <a href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300">Plan</a>
            <a href="/faq" className="text-green-600 font-medium">FAQ</a>
          </nav>
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg font-semibold flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span>Login</span>
          </Button>
        </div>
      </header>

      {/* Page Title and Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Login</h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">Home</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-green-600 font-medium">Login</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm transition-all duration-500 hover:shadow-xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600 mb-8">Hey Enter your details to get sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  ✅ {success}
                </div>
              )}

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                />
              </div>

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                  <Input
                    type="text"
                    placeholder="+94 77 777 7777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                  <Input
                    type="text"
                    placeholder="Enter referral code if you have one"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError("")
                    setSuccess("")
                  }}
                  className="text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-300 hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Image */}
          <div className="hidden md:block relative h-[600px] rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=1000&fit=crop"
              alt="Earning Platform"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-transparent to-gray-900/30"></div>
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
