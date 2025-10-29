"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PlansModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PlansModal({ open, onOpenChange }: PlansModalProps) {
  const plans = [
    {
      name: "Starter",
      price: 0,
      description: "Perfect for beginners",
      features: [
        "Post 5 ads per month",
        "View all products",
        "Basic support",
        "Standard earnings rate",
        "Community access",
      ],
    },
    {
      name: "Normal",
      price: 50,
      description: "For active sellers",
      features: [
        "Post 20 ads per month",
        "Advanced analytics",
        "Priority email support",
        "1.5x earnings multiplier",
        "Featured ad slots",
        "Custom branding",
      ],
    },
    {
      name: "Premium",
      price: 150,
      description: "For professionals",
      features: [
        "Unlimited ads",
        "Full analytics dashboard",
        "24/7 priority support",
        "2x earnings multiplier",
        "Premium seller badge",
        "API access",
        "Dedicated account manager",
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary">Our Plans</DialogTitle>
          <DialogDescription>Choose the perfect plan for your needs</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {plans.map((plan) => (
            <Card key={plan.name} className="border-primary/20 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground"> USDT</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
