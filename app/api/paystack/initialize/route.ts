import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, amount, currency, courseId, userId, companyName } = body

    if (!email || !amount || !courseId || !userId) {
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
        metadata: {
          courseId,
          userId,
          companyName,
        },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
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
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}
