"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PaymentSuccess() {
  const params = useSearchParams()
  const router = useRouter()
  const reference = params.get("reference")
  const courseId = params.get("courseId")
  const planId = params.get("planId")

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reference || !courseId || !planId) return

    fetch("/api/paystack/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, courseId, planId }),
    })
      .then(() => router.push(`/courses/${courseId}`))
      .catch(() => router.push("/payment/error"))
  }, [reference, courseId, planId])

  return <p className="p-8">Finalizing payment...</p>
}
