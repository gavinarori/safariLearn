"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { CheckoutContent } from "@/components/checkout/checkout-content"

const plans = {
  starter: {
    name: "Starter",
    price: 29.99,
    priceInCents: 2999,
    employees: 10,
    description: "Perfect for small teams",
  },
  professional: {
    name: "Professional",
    price: 99.99,
    priceInCents: 9999,
    employees: 100,
    description: "For growing companies",
  },
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planId = (searchParams.get("plan") as "starter" | "professional") || "starter"
  const paymentMethod = (searchParams.get("method") as "paystack" | "mpesa") || "paystack"

  const plan = plans[planId]

  const [isProcessing, setIsProcessing] = useState(false)

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-4">Invalid plan selected</p>
            <Link href="/pricing">
              <Button className="w-full">Back to Pricing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <a href="/pricing" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <span>← Back to Pricing</span>
          </a>
        </div>
      </div>

      <Suspense fallback={null}>
        <CheckoutContent
          plan={plan}
          paymentMethod={paymentMethod}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Suspense>
    </div>
  )
}
