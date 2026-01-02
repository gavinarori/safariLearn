"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PaystackCheckout } from "@/components/payment/paystack-checkout"
import { MpesaCheckout } from "@/components/payment/mpesa-checkout"

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

export function CheckoutContent() {
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{plan.name} Plan</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <Badge variant="secondary" className="w-fit">
                  Up to {plan.employees} employees
                </Badge>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly subscription</span>
                  <span className="font-medium">${plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (if applicable)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">${plan.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Billed monthly. Cancel anytime. Free 14-day trial included.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mt-4">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  You'll receive an invoice and access credentials via email immediately after payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Forms */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {paymentMethod === "paystack" ? "Pay with Paystack" : "Pay with M-Pesa"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod === "paystack" ? (
                <PaystackCheckout
                  amount={plan.priceInCents}
                  planId={planId}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              ) : (
                <MpesaCheckout
                  amount={plan.price}
                  planId={planId}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              )}
            </CardContent>
          </Card>

          {/* Other Payment Options */}
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">Want to pay differently?</p>
            <Link href={`/checkout?plan=${planId}&method=${paymentMethod === "paystack" ? "mpesa" : "paystack"}`}>
              <Button variant="outline" className="w-full bg-transparent">
                Switch to {paymentMethod === "paystack" ? "M-Pesa" : "Paystack"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
