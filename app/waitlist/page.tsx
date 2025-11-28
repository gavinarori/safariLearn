"use client"

import { useState } from "react"
import { WaitlistForm } from "@/components/wait-list/waitlist-form"
import { SuccessMessage } from "@/components/wait-list/success-message"

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (isSubmitted) {
    return <SuccessMessage onReset={() => setIsSubmitted(false)} />
  }

  return <WaitlistForm onSubmit={() => setIsSubmitted(true)} />
}
