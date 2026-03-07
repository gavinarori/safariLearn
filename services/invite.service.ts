import { createClient } from "@/superbase/client"

const supabase = createClient()

export interface CourseInvite {
  emails: string[]
  courseId: string
  courseName: string
  message?: string
}

export interface InviteHistoryItem {
  id: string
  email: string
  role: "admin" | "employee"
  token: string
  expiresAt: string
  accepted: boolean
  status: "sent" | "viewed" | "accepted" | "enrolled"

  createdAt: string
  viewedAt?: string | null
  acceptedAt?: string | null
  enrolledAt?: string | null

  company: {
    id: string
    name: string
  } | null

  course: {
    id: string
    title: string | null
    slug: string | null
    level: string | null
    category: string | null
    price: number | null
  } | null

  enrollment?: {
    id: string
    status: string
    enrolledAt: string
  } | null

  user?: {
    id: string
    full_name: string | null
    role: string
  } | null
}

export class InviteManager {
  
  static async getAvailableSeats(): Promise<{
    totalPaidSeats: number
    usedSeats: number
    availableSeats: number
  }> {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

    // Get user's company
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", auth.user.id)
      .single()

    if (userErr || !user?.company_id) {
      throw new Error("No company found for user")
    }

    // Sum all successful payments' seats for this company
    const { data: payments, error: payErr } = await supabase
      .from("payments")
      .select("seats")
      .eq("company_id", user.company_id)
      .eq("status", "success")           // or whatever your success status is
      // .in("status", ["succeeded", "completed", "paid"])  ← adjust as needed

    if (payErr) throw payErr

    const totalPaidSeats = payments?.reduce((sum, p) => sum + (p.seats || 0), 0) ?? 0

    // Count how many invites have been sent (most accurate = count rows in invites)
    const { count: usedSeats, error: countErr } = await supabase
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("company_id", user.company_id)
      // Optionally filter by course if you want per-course limit:
      // .eq("course_id", courseId)   ← uncomment if needed

    if (countErr) throw countErr

    return {
      totalPaidSeats,
      usedSeats: usedSeats ?? 0,
      availableSeats: Math.max(0, totalPaidSeats - (usedSeats ?? 0)),
    }
  }

  static async inviteEmployeesToCourse(invites: CourseInvite) {
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-course-invites`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          emails: invites.emails,
          courseId: invites.courseId,
          courseName: invites.courseName,
          message: invites.message,
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err || "Failed to send invites")
    }

    return await response.json()
  }


  static async getCompanyInviteHistory(): Promise<InviteHistoryItem[]> {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

    // Get user company + role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("company_id, role")
      .eq("id", auth.user.id)
      .single()

    if (userError || !userData?.company_id) {
      throw new Error("User has no company")
    }

    if (!["company_admin", "super_admin"].includes(userData.role)) {
      throw new Error("Unauthorized")
    }

    // Fetch invites
    const { data, error } = await supabase
      .from("invites")
      .select(`
        *,
        company:companies (
          id,
          name
        ),
        course:courses (
          id,
          title,
          slug,
          level,
          category,
          price
        )
      `)
      .eq("company_id", userData.company_id)
      .order("created_at", { ascending: false })

    if (error) throw error
    if (!data?.length) return []

    // Get related users
    const emails = data.map((invite) => invite.email)

    const { data: users } = await supabase
      .from("users")
      .select("id, email, full_name, role")
      .in("email", emails)

    const userMap = new Map(
      users?.map((u) => [u.email, u]) ?? []
    )

    // Get related enrollments
    const courseIds = data.map((i) => i.course_id)

    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("id, course_id, user_id, status, enrolled_at")
      .eq("company_id", userData.company_id)
      .in("course_id", courseIds)

    const enrollmentMap = new Map(
      enrollments?.map((e) => [`${e.course_id}-${e.user_id}`, e]) ?? []
    )

    // Merge everything
    return data.map((invite) => {
      const user = userMap.get(invite.email)

      const enrollment =
        user &&
        enrollmentMap.get(`${invite.course_id}-${user.id}`)

      return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        token: invite.token,
        expiresAt: invite.expires_at,
        accepted: invite.accepted,
        status: invite.status,

        createdAt: invite.created_at,
        viewedAt: invite.viewed_at,
        acceptedAt: invite.accepted_at,
        enrolledAt: invite.enrolled_at,

        company: invite.company ?? null,
        course: invite.course ?? null,

        enrollment: enrollment
          ? {
              id: enrollment.id,
              status: enrollment.status,
              enrolledAt: enrollment.enrolled_at,
            }
          : null,

        user: user
          ? {
              id: user.id,
              full_name: user.full_name,
              role: user.role,
            }
          : null,
      }
    })
  }
}