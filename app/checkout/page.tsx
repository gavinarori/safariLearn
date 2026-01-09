"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
  const planId =
    (searchParams.get("plan") as keyof typeof plans) || "starter"

  const plan = plans[planId]
  const [isProcessing, setIsProcessing] = useState(false)

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Invalid plan selected</p>
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
      <div className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/pricing" className="text-sm text-muted-foreground">
            ← Back to Pricing
          </Link>
        </div>
      </div>

      <Suspense fallback={null}>
        <CheckoutContent
          plan={plan}
          planId={planId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Suspense>
    </div>
  )
}
