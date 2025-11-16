"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Home, ChevronRight, Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import bg1 from '@/public/bg-1.webp'
import shopifyFullLogo from '@/public/shopifyFullLogo.png'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    { code: "+93", country: "Afghanistan", pattern: /^\d{9}$/, format: "701234567" },
    { code: "+355", country: "Albania", pattern: /^\d{9}$/, format: "672123456" },
    { code: "+213", country: "Algeria", pattern: /^\d{9}$/, format: "551234567" },
    { code: "+376", country: "Andorra", pattern: /^\d{6}$/, format: "312345" },
    { code: "+244", country: "Angola", pattern: /^\d{9}$/, format: "923123456" },
    { code: "+54", country: "Argentina", pattern: /^\d{10}$/, format: "1123456789" },
    { code: "+374", country: "Armenia", pattern: /^\d{8}$/, format: "77123456" },
    { code: "+61", country: "Australia", pattern: /^\d{9}$/, format: "412345678" },
    { code: "+43", country: "Austria", pattern: /^\d{10}$/, format: "6641234567" },
    { code: "+994", country: "Azerbaijan", pattern: /^\d{9}$/, format: "401234567" },
    { code: "+973", country: "Bahrain", pattern: /^\d{8}$/, format: "36001234" },
    { code: "+880", country: "Bangladesh", pattern: /^\d{10}$/, format: "1712345678" },
    { code: "+375", country: "Belarus", pattern: /^\d{9}$/, format: "291234567" },
    { code: "+32", country: "Belgium", pattern: /^\d{9}$/, format: "470123456" },
    { code: "+501", country: "Belize", pattern: /^\d{7}$/, format: "6221234" },
    { code: "+229", country: "Benin", pattern: /^\d{8}$/, format: "90123456" },
    { code: "+975", country: "Bhutan", pattern: /^\d{8}$/, format: "17123456" },
    { code: "+591", country: "Bolivia", pattern: /^\d{8}$/, format: "71234567" },
    { code: "+387", country: "Bosnia", pattern: /^\d{8}$/, format: "61123456" },
    { code: "+267", country: "Botswana", pattern: /^\d{8}$/, format: "71123456" },
    { code: "+55", country: "Brazil", pattern: /^\d{11}$/, format: "11961234567" },
    { code: "+673", country: "Brunei", pattern: /^\d{7}$/, format: "7123456" },
    { code: "+359", country: "Bulgaria", pattern: /^\d{9}$/, format: "876543210" },
    { code: "+226", country: "Burkina Faso", pattern: /^\d{8}$/, format: "70123456" },
    { code: "+257", country: "Burundi", pattern: /^\d{8}$/, format: "79123456" },
    { code: "+855", country: "Cambodia", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+237", country: "Cameroon", pattern: /^\d{9}$/, format: "671234567" },
  { code: "+1", country: "United States/Canada", pattern: /^\d{10}$/, format: "2021234567 or 2041234567" },
    { code: "+238", country: "Cape Verde", pattern: /^\d{7}$/, format: "9912345" },
    { code: "+236", country: "Central African Republic", pattern: /^\d{8}$/, format: "70123456" },
    { code: "+235", country: "Chad", pattern: /^\d{8}$/, format: "63012345" },
    { code: "+56", country: "Chile", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+86", country: "China", pattern: /^\d{11}$/, format: "13812345678" },
    { code: "+57", country: "Colombia", pattern: /^\d{10}$/, format: "3211234567" },
    { code: "+269", country: "Comoros", pattern: /^\d{7}$/, format: "3212345" },
    { code: "+506", country: "Costa Rica", pattern: /^\d{8}$/, format: "83123456" },
    { code: "+385", country: "Croatia", pattern: /^\d{9}$/, format: "921234567" },
    { code: "+53", country: "Cuba", pattern: /^\d{8}$/, format: "51234567" },
    { code: "+357", country: "Cyprus", pattern: /^\d{8}$/, format: "96123456" },
    { code: "+420", country: "Czech Republic", pattern: /^\d{9}$/, format: "601123456" },
    { code: "+243", country: "Democratic Republic of Congo", pattern: /^\d{9}$/, format: "991234567" },
    { code: "+45", country: "Denmark", pattern: /^\d{8}$/, format: "32123456" },
    { code: "+253", country: "Djibouti", pattern: /^\d{8}$/, format: "77123456" },
    { code: "+593", country: "Ecuador", pattern: /^\d{9}$/, format: "991234567" },
    { code: "+20", country: "Egypt", pattern: /^\d{10}$/, format: "1001234567" },
    { code: "+503", country: "El Salvador", pattern: /^\d{8}$/, format: "70123456" },
    { code: "+372", country: "Estonia", pattern: /^\d{7,8}$/, format: "51234567" },
    { code: "+251", country: "Ethiopia", pattern: /^\d{9}$/, format: "911234567" },
    { code: "+679", country: "Fiji", pattern: /^\d{7}$/, format: "7012345" },
    { code: "+358", country: "Finland", pattern: /^\d{9}$/, format: "412345678" },
    { code: "+33", country: "France", pattern: /^\d{9}$/, format: "612345678" },
    { code: "+995", country: "Georgia", pattern: /^\d{9}$/, format: "555123456" },
    { code: "+49", country: "Germany", pattern: /^\d{10,11}$/, format: "15112345678" },
    { code: "+233", country: "Ghana", pattern: /^\d{9}$/, format: "231234567" },
    { code: "+30", country: "Greece", pattern: /^\d{10}$/, format: "6912345678" },
    { code: "+299", country: "Greenland", pattern: /^\d{6}$/, format: "221234" },
    { code: "+502", country: "Guatemala", pattern: /^\d{8}$/, format: "51234567" },
    { code: "+224", country: "Guinea", pattern: /^\d{9}$/, format: "601123456" },
    { code: "+592", country: "Guyana", pattern: /^\d{7}$/, format: "6091234" },
    { code: "+509", country: "Haiti", pattern: /^\d{8}$/, format: "34101234" },
    { code: "+504", country: "Honduras", pattern: /^\d{8}$/, format: "91234567" },
    { code: "+852", country: "Hong Kong", pattern: /^\d{8}$/, format: "51234567" },
    { code: "+36", country: "Hungary", pattern: /^\d{9}$/, format: "201234567" },
    { code: "+354", country: "Iceland", pattern: /^\d{7}$/, format: "6111234" },
    { code: "+91", country: "India", pattern: /^\d{10}$/, format: "9876543210" },
    { code: "+62", country: "Indonesia", pattern: /^\d{10,12}$/, format: "81234567890" },
    { code: "+98", country: "Iran", pattern: /^\d{10}$/, format: "9123456789" },
    { code: "+964", country: "Iraq", pattern: /^\d{10}$/, format: "7901234567" },
    { code: "+353", country: "Ireland", pattern: /^\d{9}$/, format: "851234567" },
    { code: "+972", country: "Israel", pattern: /^\d{9}$/, format: "501234567" },
    { code: "+39", country: "Italy", pattern: /^\d{10}$/, format: "3123456789" },
    { code: "+225", country: "Ivory Coast", pattern: /^\d{10}$/, format: "0123456789" },
    { code: "+1876", country: "Jamaica", pattern: /^\d{7}$/, format: "2101234" },
    { code: "+81", country: "Japan", pattern: /^\d{10}$/, format: "9012345678" },
    { code: "+962", country: "Jordan", pattern: /^\d{9}$/, format: "790123456" },
  { code: "+76", country: "Kazakhstan", pattern: /^\d{10}$/, format: "7011234567" },
    { code: "+254", country: "Kenya", pattern: /^\d{9}$/, format: "712123456" },
    { code: "+965", country: "Kuwait", pattern: /^\d{8}$/, format: "50012345" },
    { code: "+996", country: "Kyrgyzstan", pattern: /^\d{9}$/, format: "700123456" },
    { code: "+856", country: "Laos", pattern: /^\d{9}$/, format: "2023123456" },
    { code: "+371", country: "Latvia", pattern: /^\d{8}$/, format: "21234567" },
    { code: "+961", country: "Lebanon", pattern: /^\d{7,8}$/, format: "71123456" },
    { code: "+266", country: "Lesotho", pattern: /^\d{8}$/, format: "50123456" },
    { code: "+231", country: "Liberia", pattern: /^\d{7,9}$/, format: "770123456" },
    { code: "+218", country: "Libya", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+370", country: "Lithuania", pattern: /^\d{8}$/, format: "61234567" },
    { code: "+352", country: "Luxembourg", pattern: /^\d{9}$/, format: "621123456" },
    { code: "+853", country: "Macau", pattern: /^\d{8}$/, format: "66123456" },
    { code: "+389", country: "Macedonia", pattern: /^\d{8}$/, format: "70123456" },
    { code: "+261", country: "Madagascar", pattern: /^\d{9}$/, format: "321234567" },
    { code: "+265", country: "Malawi", pattern: /^\d{9}$/, format: "991234567" },
    { code: "+60", country: "Malaysia", pattern: /^\d{9,10}$/, format: "123456789" },
    { code: "+960", country: "Maldives", pattern: /^\d{7}$/, format: "7712345" },
    { code: "+223", country: "Mali", pattern: /^\d{8}$/, format: "65012345" },
    { code: "+356", country: "Malta", pattern: /^\d{8}$/, format: "79123456" },
    { code: "+222", country: "Mauritania", pattern: /^\d{8}$/, format: "22123456" },
    { code: "+230", country: "Mauritius", pattern: /^\d{8}$/, format: "52512345" },
    { code: "+52", country: "Mexico", pattern: /^\d{10}$/, format: "5512345678" },
    { code: "+373", country: "Moldova", pattern: /^\d{8}$/, format: "69123456" },
    { code: "+377", country: "Monaco", pattern: /^\d{8}$/, format: "61234567" },
    { code: "+976", country: "Mongolia", pattern: /^\d{8}$/, format: "88123456" },
    { code: "+382", country: "Montenegro", pattern: /^\d{8}$/, format: "67123456" },
    { code: "+212", country: "Morocco", pattern: /^\d{9}$/, format: "650123456" },
    { code: "+258", country: "Mozambique", pattern: /^\d{9}$/, format: "821234567" },
    { code: "+95", country: "Myanmar", pattern: /^\d{9,10}$/, format: "912345678" },
    { code: "+264", country: "Namibia", pattern: /^\d{9}$/, format: "811234567" },
    { code: "+977", country: "Nepal", pattern: /^\d{10}$/, format: "9841234567" },
    { code: "+31", country: "Netherlands", pattern: /^\d{9}$/, format: "612345678" },
    { code: "+64", country: "New Zealand", pattern: /^\d{9,10}$/, format: "212345678" },
    { code: "+505", country: "Nicaragua", pattern: /^\d{8}$/, format: "81234567" },
    { code: "+227", country: "Niger", pattern: /^\d{8}$/, format: "93123456" },
    { code: "+234", country: "Nigeria", pattern: /^\d{10}$/, format: "8021234567" },
    { code: "+47", country: "Norway", pattern: /^\d{8}$/, format: "40612345" },
    { code: "+968", country: "Oman", pattern: /^\d{8}$/, format: "92123456" },
    { code: "+92", country: "Pakistan", pattern: /^\d{10}$/, format: "3001234567" },
    { code: "+970", country: "Palestine", pattern: /^\d{9}$/, format: "599123456" },
    { code: "+507", country: "Panama", pattern: /^\d{8}$/, format: "61234567" },
    { code: "+595", country: "Paraguay", pattern: /^\d{9}$/, format: "961234567" },
    { code: "+51", country: "Peru", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+63", country: "Philippines", pattern: /^\d{10}$/, format: "9171234567" },
    { code: "+48", country: "Poland", pattern: /^\d{9}$/, format: "501234567" },
    { code: "+351", country: "Portugal", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+974", country: "Qatar", pattern: /^\d{8}$/, format: "33123456" },
    { code: "+242", country: "Republic of Congo", pattern: /^\d{9}$/, format: "061234567" },
    { code: "+40", country: "Romania", pattern: /^\d{9}$/, format: "712345678" },
  { code: "+7", country: "Russia", pattern: /^\d{10}$/, format: "9161234567" },
    { code: "+250", country: "Rwanda", pattern: /^\d{9}$/, format: "720123456" },
    { code: "+966", country: "Saudi Arabia", pattern: /^\d{9}$/, format: "501234567" },
    { code: "+221", country: "Senegal", pattern: /^\d{9}$/, format: "701234567" },
    { code: "+381", country: "Serbia", pattern: /^\d{9}$/, format: "601234567" },
    { code: "+65", country: "Singapore", pattern: /^\d{8}$/, format: "81234567" },
    { code: "+421", country: "Slovakia", pattern: /^\d{9}$/, format: "901123456" },
    { code: "+386", country: "Slovenia", pattern: /^\d{8}$/, format: "31234567" },
    { code: "+252", country: "Somalia", pattern: /^\d{8}$/, format: "90123456" },
    { code: "+27", country: "South Africa", pattern: /^\d{9}$/, format: "711234567" },
    { code: "+82", country: "South Korea", pattern: /^\d{10}$/, format: "1012345678" },
    { code: "+211", country: "South Sudan", pattern: /^\d{9}$/, format: "977123456" },
    { code: "+34", country: "Spain", pattern: /^\d{9}$/, format: "612345678" },
    { code: "+94", country: "Sri Lanka", pattern: /^\d{9}$/, format: "771234567" },
    { code: "+249", country: "Sudan", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+597", country: "Suriname", pattern: /^\d{7}$/, format: "7412345" },
    { code: "+268", country: "Swaziland", pattern: /^\d{8}$/, format: "76123456" },
    { code: "+46", country: "Sweden", pattern: /^\d{9}$/, format: "701234567" },
    { code: "+41", country: "Switzerland", pattern: /^\d{9}$/, format: "781234567" },
    { code: "+963", country: "Syria", pattern: /^\d{9}$/, format: "944567890" },
    { code: "+886", country: "Taiwan", pattern: /^\d{9}$/, format: "912345678" },
    { code: "+992", country: "Tajikistan", pattern: /^\d{9}$/, format: "917123456" },
    { code: "+255", country: "Tanzania", pattern: /^\d{9}$/, format: "621234567" },
    { code: "+66", country: "Thailand", pattern: /^\d{9}$/, format: "812345678" },
    { code: "+228", country: "Togo", pattern: /^\d{8}$/, format: "90112345" },
    { code: "+216", country: "Tunisia", pattern: /^\d{8}$/, format: "20123456" },
    { code: "+90", country: "Turkey", pattern: /^\d{10}$/, format: "5321234567" },
    { code: "+993", country: "Turkmenistan", pattern: /^\d{8}$/, format: "65123456" },
    { code: "+971", country: "UAE", pattern: /^\d{9}$/, format: "501234567" },
    { code: "+256", country: "Uganda", pattern: /^\d{9}$/, format: "712345678" },
    { code: "+380", country: "Ukraine", pattern: /^\d{9}$/, format: "501234567" },
    { code: "+44", country: "United Kingdom", pattern: /^\d{10}$/, format: "7400123456" },
  // Removed duplicate '+1' for United States to ensure unique keys
    { code: "+598", country: "Uruguay", pattern: /^\d{8}$/, format: "94123456" },
    { code: "+998", country: "Uzbekistan", pattern: /^\d{9}$/, format: "901234567" },
    { code: "+58", country: "Venezuela", pattern: /^\d{10}$/, format: "4121234567" },
    { code: "+84", country: "Vietnam", pattern: /^\d{9,10}$/, format: "912345678" },
    { code: "+967", country: "Yemen", pattern: /^\d{9}$/, format: "712345678" },
    { code: "+260", country: "Zambia", pattern: /^\d{9}$/, format: "955123456" },
    { code: "+263", country: "Zimbabwe", pattern: /^\d{9}$/, format: "712345678" },
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
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-20 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify" className="h-8" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-all duration-300">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-all duration-300">About</Link>
            <Link href="/plans" className="text-gray-700 hover:text-green-600 transition-all duration-300">Plan</Link>
            <Link href="/faq" className="text-green-600 font-medium">FAQ</Link>
          </nav>
        </div>
      </header>

      {/* Page Title and Breadcrumb */}
      {/* <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Login</h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Home className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">Home</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-green-600 font-medium">Login</span>
          </div>
        </div>
      </div> */}

      <div className="">
        {/* Background Image with faded effect */}
        <Image
          src={bg1}
          alt="bg picture"
          className="object-cover filter brightness-50 min-h-[340px] h-[340px] w-full md:min-h-0 md:h-auto"
          priority
        />

        {/* Overlay Content */}
        <div className="pt-70 absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
          {/* Scroll Button */}
          <button
            onClick={() => window.scrollBy({ top: 400, behavior: "smooth" })}
            className="flex flex-col items-center animate-bounce mt-8"
          >
            {/* Downward arrow */}
            <span className="text-white text-3xl font-bold">↓</span>
            <span className="mt-1 text-sm uppercase tracking-widest">Scroll Down</span>
          </button>

        </div>
      </div>



      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm transition-all duration-500 hover:shadow-xl">
            {/* <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopify</h2> */}
            <Image src={shopifyFullLogo} className="h-10 w-35 mb-4" alt="shopifylogo"/>
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
                  {/* First Name and Last Name - Two columns on md+, stacked on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
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
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value)
                          if (phone) validatePhone(phone, e.target.value)
                        }}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 bg-white text-sm w-full sm:w-auto"
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
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 w-full"
                      />
                    </div>
                    {phoneError && (
                      <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                    )}
                  </div>
                </>
              )}

              {/* Password */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye icon (show)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                  ) : (
                    // Eye-off icon (hide)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.73 10.73A3.5 3.5 0 0112 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33M6.53 6.53C4.06 8.36 2.5 12 2.5 12s4 7.5 10.5 7.5c2.04 0 3.93-.37 5.53-1.03M17.47 17.47C19.94 15.64 21.5 12 21.5 12s-4-7.5-10.5-7.5c-.82 0-1.62.07-2.39.2" /></svg>
                  )}
                </button>
              </div>

              {!isLogin && (
                <>
                  {/* Confirm Password */}
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300 relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 pr-12"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 focus:outline-none"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        // Eye icon (show)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                      ) : (
                        // Eye-off icon (hide)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.73 10.73A3.5 3.5 0 0112 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33M6.53 6.53C4.06 8.36 2.5 12 2.5 12s4 7.5 10.5 7.5c2.04 0 3.93-.37 5.53-1.03M17.47 17.47C19.94 15.64 21.5 12 21.5 12s-4-7.5-10.5-7.5c-.82 0-1.62.07-2.39.2" /></svg>
                      )}
                    </button>
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
          <div className="hidden md:block relative h-full rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
            <video
              src="/videos/signup-promo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full absolute inset-0"
              poster="/videos/signup-promo-poster.jpg"
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
