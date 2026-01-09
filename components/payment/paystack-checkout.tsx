"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/superbase/client"

const supabase = createClient()

interface PaystackCheckoutProps {
  amount: number // KES
  planId: string // courseId
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function PaystackCheckout({
  amount,
  planId,
  isProcessing,
  setIsProcessing,
}: PaystackCheckoutProps) {
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState("")

  const handlePaystackPayment = async () => {
    setError("")

    if (!companyName) {
      setError("Company name is required")
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to continue")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          amount: Math.round(amount * 100), // KES → kobo
          currency: "KES",
          courseId: planId,
          userId: user.id,
          companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment")
      }

      window.location.href = data.authorization_url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={isProcessing}
          placeholder="Your Company Ltd"
          className="mt-1"
        />
      </div>

      {error && (
        <div className="flex gap-2 text-sm text-red-600 bg-red-50 p-3 rounded">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900">
        Payments are securely processed by Paystack. We never store card details.
      </div>

      <Button
        onClick={handlePaystackPayment}
        disabled={isProcessing}
        size="lg"
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Pay with Paystack"}
      </Button>

      <div className="pt-4 border-t text-xs text-muted-foreground">
        Accepted: Visa · Mastercard · Verve · Bank Transfer
      </div>
    </div>
  )
}
