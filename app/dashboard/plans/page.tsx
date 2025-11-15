"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const validCodes = [
    "Z4KP", "L9TX", "Q7RM", "B2HF", "V8QJ",
    "S3NK", "W5YD", "H6PX", "T1GV", "R4ZM"
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$100",
      investment: "$100",
      description: "Get started with basic ad clicks at no cost.",
      period: "Unlimited",
      productLimit: "10",
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
      productLimit: "20",
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
      productLimit: "30",
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
      productLimit: "50",
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
      productLimit: "75",
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
      productLimit: "100",
      profit15: "$300",
      profit20: "$400",
      profitRange: "$300 - $400",
      isPremium: true
    }
  ];

  const handlePurchase = (planName: string) => {
    setPendingPlan(planName);
    setPromoOpen(true);
    setPromoCode("");
    setPromoError("");
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }

    if (!validCodes.includes(promoCode.trim().toUpperCase())) {
      setPromoError("Invalid promo code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ promoCode: promoCode.trim().toUpperCase() }),
      });

      if (!res.ok) {
        setPromoError("Failed to save promo code. Try again.");
        setIsSubmitting(false);
        return;
      }

      setPromoOpen(false);
      setIsSubmitting(false);
      setPromoCode("");
      setPromoError("");
      setPendingPlan(null);
      router.push("/dashboard/add-funds");

    } catch (err) {
      setPromoError("Network error. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Promo Code Modal */}
      <Dialog open={promoOpen} onOpenChange={setPromoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Promo Code</DialogTitle>
            <DialogDescription>
              Enter a valid promo code to continue with your plan purchase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePromoSubmit} className="space-y-4">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
              disabled={isSubmitting}
              className="text-lg"
              autoFocus
            />

            {promoError && (
              <p className="text-red-600 text-sm">{promoError}</p>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? "Checking..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plans Section */}
      <div className="space-y-6 p-4 sm:p-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 mt-1">
            Select the plan that best fits your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border-2 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] ${
                plan.isPremium
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* Premium Label */}
              {plan.isPremium && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  PREMIUM
                </div>
              )}

              {/* Plan Name */}
              <h3
                className={`text-2xl font-bold ${
                  plan.isPremium ? "text-yellow-800" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <p
                className={`text-4xl font-bold mt-3 ${
                  plan.isPremium ? "text-yellow-800" : "text-gray-900"
                }`}
              >
                {plan.price}
              </p>

              {/* Description */}
              <p
                className={`mt-3 text-sm ${
                  plan.isPremium ? "text-yellow-800" : "text-gray-700"
                }`}
              >
                {plan.description}
              </p>

              {/* Details */}
              <div className="mt-5 space-y-2 text-sm text-gray-700">
                <p>Period: {plan.period}</p>
                <p>Product Limit: {plan.productLimit}</p>
              </div>

              {/* Profit Box */}
              <div
                className={`mt-5 p-4 rounded-lg border ${
                  plan.isPremium
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <h4
                  className={`font-semibold text-sm ${
                    plan.isPremium ? "text-yellow-900" : "text-green-900"
                  }`}
                >
                  Expected Profit (15–20%)
                </h4>

                <div className="mt-2 text-sm space-y-1">
                  <p>15% Profit: {plan.profit15}</p>
                  <p>20% Profit: {plan.profit20}</p>
                  <p className="font-semibold mt-2">
                    Profit Range: {plan.profitRange}
                  </p>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => handlePurchase(plan.name)}
                className={`w-full mt-6 font-semibold py-3 ${
                  plan.isPremium
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Purchase Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
