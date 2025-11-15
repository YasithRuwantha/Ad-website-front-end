import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { UserProvider } from "@/lib/user-context" // ✅ import UserProvider
import { RatingProvider } from "@/lib/rating-context" // ✅ Add RatingProvider


import "./globals.css"
import { User } from "lucide-react"
import { ProductsProvider } from "@/lib/products-context"
import { FundPaymentProvider } from "@/lib/fundPayment-context"


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shopify.com",
  description: "Modern e-commerce platform with ads, products, and referrals",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <UserProvider>
            <ProductsProvider>
              <RatingProvider>
                <FundPaymentProvider>
                  <DataProvider>
                    {children}
                  </DataProvider>
                </FundPaymentProvider>
              </RatingProvider>
            </ProductsProvider>
          </UserProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
