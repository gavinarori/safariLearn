import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, amount, courseId, planId } = await req.json()

    if (!email || !amount || !courseId || !planId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, 
        currency: "KES",
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?courseId=${courseId}&planId=${planId}`,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Paystack init failed" },
        { status: 500 }
      )
    }

    return NextResponse.json(data.data)
  } catch (err) {
    console.error("Paystack initialize error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
