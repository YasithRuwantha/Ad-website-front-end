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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const [success, setSuccess] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [phoneError, setPhoneError] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const router = useRouter()
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  // Country codes with validation patterns
  const countryCodes = [
    { code: "+1", country: "USA", pattern: /^\d{10}$/, format: "1234567890" },
    { code: "+44", country: "UK", pattern: /^\d{10}$/, format: "1234567890" },
    { code: "+91", country: "India", pattern: /^\d{10}$/, format: "1234567890" },
    { code: "+94", country: "Sri Lanka", pattern: /^\d{9}$/, format: "771234567" },
    { code: "+61", country: "Australia", pattern: /^\d{9}$/, format: "412345678" },
    { code: "+81", country: "Japan", pattern: /^\d{10}$/, format: "9012345678" },
    { code: "+86", country: "China", pattern: /^\d{11}$/, format: "13812345678" },
    { code: "+49", country: "Germany", pattern: /^\d{10,11}$/, format: "15112345678" },
    { code: "+33", country: "France", pattern: /^\d{9}$/, format: "612345678" },
    { code: "+971", country: "UAE", pattern: /^\d{9}$/, format: "501234567" },
  ]

  // Validate phone number based on country code
  const validatePhone = (phoneNumber: string, selectedCode: string) => {
    const country = countryCodes.find(c => c.code === selectedCode)
    if (!country) return true
    
    const cleanPhone = phoneNumber.replace(/\s+/g, '')
    if (!country.pattern.test(cleanPhone)) {
      setPhoneError(`Invalid format for ${country.country}.`)
      return false
    }
    setPhoneError("")
    return true
  }

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
    setPhoneError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // Check if terms are accepted
        if (!acceptedTerms) {
          setError("You must accept the terms and conditions to create an account");
          setIsLoading(false);
          return;
        }

        // Validate password match
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        
        // Validate phone before signup
        if (!validatePhone(phone, countryCode)) {
          setIsLoading(false);
          return;
        }
        
        // Combine first and last name
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Combine country code with phone number
        const fullPhone = `${countryCode}${phone.replace(/\s+/g, '')}`;
        
        // Pass all fields including username to signup
        const message = await signup(email, password, fullName, fullPhone, referralCode, firstName, lastName, username);
        setSuccess(message);
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
                <>
                  {/* First Name and Last Name - Two columns */}
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                    />
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <Input
                  type="email"
                  placeholder={isLogin ? "Enter your email" : "Email Address"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                />
              </div>

              {!isLogin && (
                <>
                  {/* Phone number with country code */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value)
                          if (phone) validatePhone(phone, e.target.value)
                        }}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 bg-white text-sm"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.country} ({country.code})
                          </option>
                        ))}
                      </select>
                      <Input
                        type="text"
                        placeholder="Your Phone Number"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          if (e.target.value) validatePhone(e.target.value, countryCode)
                        }}
                        onBlur={() => phone && validatePhone(phone, countryCode)}
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <Input
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                />
              </div>

              {!isLogin && (
                <>
                  {/* Confirm Password */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                    />
                  </div>
                </>
              )}

              {/* {!isLogin && (
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
              )} */}

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                      I accept the{" "}
                      <a  
                        target="_blank"
                        className="text-green-600 hover:text-green-700 font-medium underline"
                      >
                        Terms and Conditions
                      </a>
                      {" "}and agree to the privacy policy
                    </label>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || (!isLogin && !acceptedTerms)}
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
                    setAcceptedTerms(false)
                    setFirstName("")
                    setLastName("")
                    setUsername("")
                    setPhone("")
                    setConfirmPassword("")
                    setPhoneError("")
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
