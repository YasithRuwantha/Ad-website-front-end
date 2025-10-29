"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 5 ads per month",
      "Basic analytics",
      "Email support",
      "Standard commission rate (15%)",
      "Access to marketplace",
    ],
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "normal",
    name: "Professional",
    price: 29,
    description: "For growing businesses",
    features: [
      "Up to 50 ads per month",
      "Advanced analytics",
      "Priority email support",
      "Reduced commission rate (10%)",
      "Featured listings",
      "Custom branding",
      "API access",
    ],
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    popular: true,
  },
  {
    id: "premium",
    name: "Enterprise",
    price: 99,
    description: "For established sellers",
    features: [
      "Unlimited ads",
      "Real-time analytics",
      "24/7 phone & email support",
      "Premium commission rate (5%)",
      "Priority featured listings",
      "White-label options",
      "Dedicated account manager",
      "Advanced API access",
    ],
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
  },
]

export default function PlansPage() {
  const { user, updateUser } = useAuth()

  const handleUpgrade = (planId: string) => {
    updateUser({ plan: planId as "starter" | "normal" | "premium" })
    alert(`Successfully upgraded to ${planId} plan!`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-2 ${plan.borderColor} ${plan.color} transition-all hover:shadow-lg ${
              plan.popular ? "md:scale-105 md:z-10" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={user?.plan === plan.id}
                className={`w-full ${plan.buttonColor} text-white ${
                  user?.plan === plan.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {user?.plan === plan.id ? "Current Plan" : "Upgrade Now"}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>Detailed feature comparison across all plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold">Starter</th>
                  <th className="text-center py-3 px-4 font-semibold">Professional</th>
                  <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Monthly Ads</td>
                  <td className="text-center">5</td>
                  <td className="text-center">50</td>
                  <td className="text-center">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Commission Rate</td>
                  <td className="text-center">15%</td>
                  <td className="text-center">10%</td>
                  <td className="text-center">5%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center">Email</td>
                  <td className="text-center">Priority Email</td>
                  <td className="text-center">24/7 Phone & Email</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">API Access</td>
                  <td className="text-center">-</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
