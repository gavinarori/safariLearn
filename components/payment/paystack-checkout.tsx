"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

interface PaystackCheckoutProps {
  amount: number // in cents
  planId: string
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function PaystackCheckout({ amount, planId, isProcessing, setIsProcessing }: PaystackCheckoutProps) {
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
  })
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaystackPayment = async () => {
    // Validation
    if (!formData.email || !formData.companyName) {
      setError("Please fill in all fields")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")
    setError("")

    try {
      // Initialize Paystack Payment
      const response = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          amount: amount,
          planId: planId,
          companyName: formData.companyName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize payment")
      }

      // Redirect to Paystack payment page
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch (err) {
      setPaymentStatus("error")
      setError(err instanceof Error ? err.message : "Payment initialization failed")
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@company.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isProcessing}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">We'll send your access credentials here</p>
        </div>

        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Your Company Ltd"
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={isProcessing}
            className="mt-1"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
        </div>
      )}

      {/* Success State */}
      {paymentStatus === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-900 dark:text-green-100">Payment successful! Redirecting...</p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          Your payment is processed securely by Paystack. We never store your card details on our servers.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handlePaystackPayment}
        disabled={isProcessing || !formData.email || !formData.companyName}
        className="w-full"
        size="lg"
      >
        {isProcessing ? "Processing..." : "Pay with Paystack"}
      </Button>

      {/* Payment Methods Info */}
      <div className="pt-4 border-t space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Accepted by Paystack:</p>
        <div className="flex gap-2 flex-wrap">
          {["Visa", "Mastercard", "Verve", "Bank Transfer"].map((method) => (
            <div key={method} className="px-3 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
              {method}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
