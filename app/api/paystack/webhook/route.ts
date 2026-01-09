import crypto from "crypto"
import { NextResponse } from "next/server"
import { createClient } from "@/superbase/client"

const supabase = createClient()

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-paystack-signature")

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex")

  if (hash !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true })
  }

  const data = event.data
  const { courseId, userId } = data.metadata


  await supabase.from("payments").insert({
    course_id: courseId,
    amount: data.amount / 100,
    currency: data.currency,
    status: "success",
    payment_method: "paystack",
  })


  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle()

  if (!existing) {
    await supabase.from("enrollments").insert({
      course_id: courseId,
      user_id: userId,
      status: "active",
      progress: 0,
    })
  }

  return NextResponse.json({ received: true })
}
