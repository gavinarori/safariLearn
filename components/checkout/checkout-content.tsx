"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaystackCheckout } from "@/components/payment/paystack-checkout"

type Props = {
  plan: {
    name: string
    price: number
    priceInCents: number
    employees: number
    description: string
  }
  planId: string
  courseId: string
  isProcessing: boolean
  setIsProcessing: (v: boolean) => void
}

export function CheckoutContent({
  plan,
  planId,
  courseId,
  isProcessing,
  setIsProcessing,
}: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <Badge variant="secondary">
                Up to {plan.employees} employees
              </Badge>
            </div>

            <div className="border-t pt-4 flex justify-between">
              <span>Total</span>
              <span className="text-xl font-bold">
                ${plan.price.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Pay with Paystack</CardTitle>
          </CardHeader>
          <CardContent>
            <PaystackCheckout
              amount={plan.price}
              planId={planId}
              courseId={courseId}   
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
