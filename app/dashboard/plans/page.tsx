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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border shadow-lg transition-all duration-200 bg-white hover:shadow-2xl hover:-translate-y-1 group overflow-hidden ${
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
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-800">{plan.period}</span>
                  <span className="text-gray-400">Period</span>
                </div>
                {/* <div className="flex flex-col items-center">
                  <span className="font-semibold text-gray-800">{plan.productLimit}</span>
                  <span className="text-gray-400">Product Limit</span>
                </div> */}
              </div>

              {/* Profit Box */}
              <div className={`mt-2 p-4 rounded-xl border-2 ${plan.isPremium ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"} flex flex-col items-center`}> 
                <h4 className={`font-semibold text-sm mb-1 ${plan.isPremium ? "text-yellow-800" : "text-green-800"}`}>Expected Profit <span className="font-normal">(15–20%)</span></h4>
                <div className="flex gap-4 text-base font-bold">
                  <span className="text-gray-700">{plan.profit15} <span className="font-normal text-xs text-gray-400">15%</span></span>
                  <span className="text-gray-700">{plan.profit20} <span className="font-normal text-xs text-gray-400">20%</span></span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Range: {plan.profitRange}</span>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => handlePurchase(plan.name)}
                className={`w-full mt-8 font-bold py-3 rounded-full shadow-md transition-all duration-150 text-lg tracking-wide ${
                  plan.isPremium
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                } group-hover:scale-105`}
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
