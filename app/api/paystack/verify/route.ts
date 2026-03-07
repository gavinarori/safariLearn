import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json(
        { message: "Missing reference" },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
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
        { message: "Payment not successful" },
        { status: 400 }
      )
    }

    const amount = result.data.amount / 100
    const currency = result.data.currency
    const email = result.data.customer?.email

    const metadata = result.data.metadata || {}

    const courseId = metadata.courseId
    const planId = metadata.planId
    const seats = metadata.seats
    const companyId = metadata.companyId

    if (!courseId || !email) {
      return NextResponse.json(
        { message: "Missing metadata" },
        { status: 400 }
      )
    }

    // Prevent duplicate payment
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("reference", reference)
      .maybeSingle()

    if (!existingPayment) {
      await supabase.from("payments").insert({
        course_id: courseId,
        company_id: companyId,
        plan_id: planId,
        seats,
        amount,
        currency,
        reference,
        status: "success",
        payment_method: "paystack",
      })
    }

    // Get user from public.users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      )
    }

    // Enroll user
    const { error: enrollError } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: userData.id,
          course_id: courseId,
          company_id: companyId,
          status: "active",
          progress: 0,
        },
        { onConflict: "user_id,course_id" }
      )

    if (enrollError) {
      return NextResponse.json(
        { message: "Enrollment failed", error: enrollError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      courseId
    })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    )
  }
}