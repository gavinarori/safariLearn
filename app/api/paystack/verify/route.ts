import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { reference, courseId, planId } = body

    console.log("Received payload:", { reference, courseId, planId })

    if (!reference || !courseId || !planId) {
      return NextResponse.json(
        { message: "Missing reference, courseId, or planId" },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        !process.env.SUPABASE_SERVICE_ROLE_KEY ||
        !process.env.PAYSTACK_SECRET_KEY) {
      console.error("Missing environment variables")
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // Use service role key
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error("Authentication error:", authError)
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      )
    }

    console.log("Authenticated user:", user.id)

    //  Verify payment with Paystack
    console.log("Verifying payment with Paystack...")
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!paystackRes.ok) {
      console.error("Paystack API error:", paystackRes.status)
      return NextResponse.json(
        { message: "Failed to verify payment with Paystack" },
        { status: 400 }
      )
    }

    const result = await paystackRes.json()
    console.log("Paystack result:", result)

    if (!result.status || result.data?.status !== "success") {
      return NextResponse.json(
        { message: "Payment not successful" },
        { status: 400 }
      )
    }

    const amount = result.data.amount / 100
    const currency = result.data.currency

    //  Deduplicate payment
    console.log("Checking for existing payment...")
    const { data: existingPayment, error: paymentCheckError } = await supabase
      .from("payments")
      .select("id")
      .eq("reference", reference)
      .maybeSingle()

    if (paymentCheckError && paymentCheckError.code !== 'PGRST116') {
      console.error("Payment check error:", paymentCheckError)
      return NextResponse.json(
        { message: "Database error checking payment" },
        { status: 500 }
      )
    }

    if (existingPayment) {
      console.log("Payment already exists")
      return NextResponse.json({ success: true })
    }

    //  Save payment
    console.log("Saving payment...")
    const { error: paymentError } = await supabase.from("payments").insert({
      course_id: courseId,
      plan_id: planId,
      amount,
      currency,
      reference,
      status: "success",
      payment_method: "paystack",
    })

    if (paymentError) {
      console.error("Payment insert error:", paymentError)
      return NextResponse.json(
        { message: "Failed to save payment", error: paymentError.message },
        { status: 500 }
      )
    }

    //  Get user from public.users table
    console.log("Getting user from users table...")
    const { data: userData, error: userFetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single()

    if (userFetchError || !userData) {
      console.error("User not found in users table:", userFetchError)
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      )
    }

    //  Enroll user
    console.log("Enrolling user...")
    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: userData.id, // Use the UUID from public.users table
          course_id: courseId,
          status: "active",
          progress: 0,
        },
        { onConflict: "user_id,course_id" }
      )

    if (enrollmentError) {
      console.error("Enrollment error:", enrollmentError)
      return NextResponse.json(
        { message: "Payment saved but enrollment failed", error: enrollmentError.message },
        { status: 500 }
      )
    }

    console.log("Success!")
    return NextResponse.json({ success: true })
    
  } catch (err) {
    console.error("Paystack verify error:", err)
    return NextResponse.json(
      { 
        message: "Server error", 
        error: err instanceof Error ? err.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}