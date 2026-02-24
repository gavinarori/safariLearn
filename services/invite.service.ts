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
  /** Send course invites to multiple employees */
  static async inviteEmployeesToCourse(invites: CourseInvite) {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", auth.user.id)
      .single()

    if (userError || !userData?.company_id) {
      throw new Error("User has no company")
    }

    const companyId = userData.company_id

    const results = await Promise.all(
      invites.emails.map(async (email) => {
        // 1️⃣ Check if user exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .maybeSingle()

        // 2️⃣ If user does not exist → create invite
        if (!existingUser) {
          const token = this.generateToken()
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

          const { data: invite, error: inviteError } = await supabase
            .from("invites")
            .insert({
              email,
              company_id: companyId,
              course_id: invites.courseId,
              token,
              expires_at: expiresAt.toISOString(),
              role: "employee",
              status: "sent",
            })
            .select()
            .single()

          if (inviteError) throw inviteError

          await this.sendInviteEmail(email, token, invites.courseName, invites.message)

          return {
            email,
            status: "invited",
            inviteId: invite.id,
          }
        }

        // 3️⃣ If user exists → check enrollment
        const { data: existingEnrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", existingUser.id)
          .eq("course_id", invites.courseId)
          .maybeSingle()

        if (existingEnrollment) {
          return {
            email,
            status: "already_enrolled",
            enrollmentId: existingEnrollment.id,
          }
        }

        // 4️⃣ Create enrollment
        const { data: enrollment, error: enrollmentError } = await supabase
          .from("enrollments")
          .insert({
            company_id: companyId,
            course_id: invites.courseId,
            user_id: existingUser.id,
            status: "active",
            progress: 0,
          })
          .select()
          .single()

        if (enrollmentError) throw enrollmentError

        await this.sendEnrollmentEmail(email, invites.courseName)

        return {
          email,
          status: "enrolled",
          enrollmentId: enrollment.id,
        }
      })
    )

    return results
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

  // Fetch EVERYTHING from invites + joins
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

  // 🔎 Get related users by email
  const emails = data.map((invite) => invite.email)

  const { data: users } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .in("email", emails)

  const userMap = new Map(
    users?.map((u) => [u.email, u]) ?? []
  )

  // 🔎 Get related enrollments
  const courseIds = data.map((i) => i.course_id)

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, user_id, status, enrolled_at")
    .eq("company_id", userData.company_id)
    .in("course_id", courseIds)

  const enrollmentMap = new Map(
    enrollments?.map((e) => [`${e.course_id}-${e.user_id}`, e]) ?? []
  )

  // 🧠 Merge everything
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


  /** Send invite email */
private static async sendInviteEmail(
  email: string,
  token: string,
  courseName: string,
  customMessage?: string
) {
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/accept-invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        courseName,
        inviteLink,
        customMessage,
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to send invite email: ${err}`)
  }
}


  /** Send enrollment email */
  private static async sendEnrollmentEmail(email: string, courseName: string) {
    const courseLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/learn`

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-enrollment-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, courseName, courseLink }),
    })

    if (!response.ok) throw new Error(`Failed to send enrollment email to ${email}`)
  }

  /** Generate unique token */
  private static generateToken(): string {
    return crypto.randomUUID()
  }
}
