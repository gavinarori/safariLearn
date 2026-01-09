import { createClient } from "@/superbase/client"

const supabase = createClient()

export const verifyPayment = async (
  reference: string,
  courseId: string
) => {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const res = await fetch("/api/paystack/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reference,
      courseId,
      userId: user.user.id,
    }),
  })

  if (!res.ok) {
    throw new Error("Payment verification failed")
  }

  return res.json()
}
