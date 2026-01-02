"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

interface MpesaCheckoutProps {
  amount: number
  planId: string
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function MpesaCheckout({ amount, planId, isProcessing, setIsProcessing }: MpesaCheckoutProps) {
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    phoneNumber: "",
  })
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [mpesaPromptMessage, setMpesaPromptMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMpesaPayment = async () => {
    // Validation
    if (!formData.email || !formData.companyName || !formData.phoneNumber) {
      setError("Please fill in all fields")
      return
    }

    // Validate phone number (Kenya format)
    const phoneRegex = /^254\d{9}$/
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid Kenyan phone number (254XXXXXXXXX)")
      return
    }

    setIsProcessing(true)
    setPaymentStatus("processing")
    setError("")
    setMpesaPromptMessage("")

    try {
      // Initialize M-Pesa Payment
      const response = await fetch("/api/payments/mpesa/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          amount: Math.round(amount), // Convert to whole number (Kenyan Shillings)
          planId: planId,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize M-Pesa payment")
      }

      // Show M-Pesa prompt
      setPaymentStatus("processing")
      setMpesaPromptMessage(
        `A prompt has been sent to ${formData.phoneNumber}. Please enter your M-Pesa PIN to complete the payment.`,
      )

      // Poll for payment status
      let checkCount = 0
      const maxChecks = 30 // Check for up to 5 minutes (30 * 10 seconds)
      const statusCheckInterval = setInterval(async () => {
        checkCount++

        try {
          const statusResponse = await fetch(
            `/api/payments/mpesa/check-status?checkoutRequestId=${data.CheckoutRequestID}`,
          )
          const statusData = await statusResponse.json()

          if (statusData.ResultCode === "0") {
            // Payment successful
            setPaymentStatus("success")
            setMpesaPromptMessage("Payment successful! Redirecting to your account...")
            clearInterval(statusCheckInterval)
            setTimeout(() => {
              window.location.href = `/account?plan=${planId}`
            }, 2000)
          } else if (statusData.ResultCode === "1032") {
            // Request cancelled
            setPaymentStatus("error")
            setError("Payment request cancelled")
            clearInterval(statusCheckInterval)
            setIsProcessing(false)
          }
        } catch (err) {
          console.error("Status check error:", err)
        }

        if (checkCount >= maxChecks) {
          clearInterval(statusCheckInterval)
          setPaymentStatus("error")
          setError("Payment timeout. Please try again or contact support.")
          setIsProcessing(false)
        }
      }, 10000) // Check every 10 seconds
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

        <div>
          <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="254712345678"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={isProcessing}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Format: 254XXXXXXXXX (Kenyan number)</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
        </div>
      )}

      {/* M-Pesa Prompt Message */}
      {mpesaPromptMessage && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
          {paymentStatus === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="text-sm text-blue-900 dark:text-blue-100">{mpesaPromptMessage}</div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleMpesaPayment}
        disabled={isProcessing || !formData.email || !formData.companyName || !formData.phoneNumber}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            {mpesaPromptMessage ? "Waiting for payment..." : "Processing..."}
          </>
        ) : (
          "Send M-Pesa Prompt"
        )}
      </Button>

      {/* Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-xs text-amber-900 dark:text-amber-100">
          You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment. This is the safest
          way to pay.
        </p>
      </div>
    </div>
  )
}
