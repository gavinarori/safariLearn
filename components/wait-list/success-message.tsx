"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface SuccessMessageProps {
  onReset: () => void
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 text-center">
        <div className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <CheckCircle className="w-16 h-16 text-primary relative" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">You&apos;re on the list!</h2>
            <p className="text-muted-foreground">Thanks for joining our waitlist. We&apos;ll send you updates soon.</p>
          </div>

          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-secondary-foreground">Check your email for a confirmation message</p>
          </div>

          <Button onClick={onReset} variant="outline" className="w-full h-10 bg-transparent">
            Back to Form
          </Button>
        </div>
      </Card>
    </div>
  )
}
