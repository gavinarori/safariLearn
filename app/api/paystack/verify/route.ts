import { NextResponse } from "next/server"
import { createClient } from "@/superbase/client"



const supabaseAdmin = createClient()

export async function POST(req: Request) {
  const { reference, courseId, userId } = await req.json()


  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  )

  const result = await paystackRes.json()

  if (!result.status || result.data.status !== "success") {
    return NextResponse.json(
      { error: "Payment not successful" },
      { status: 400 }
    )
  }

  const amount = result.data.amount / 100
  const currency = result.data.currency

  await supabaseAdmin.from("payments").insert({
    course_id: courseId,
    amount,
    currency,
    status: "success",
    payment_method: "paystack",
  })

  await supabaseAdmin.from("enrollments").upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: "active",
      progress: 0,
    },
    { onConflict: "user_id,course_id" }
  )

  return NextResponse.json({ success: true })
}
