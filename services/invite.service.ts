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
  status: "sent" | "viewed" | "accepted" | "enrolled"
  createdAt: string
  viewedAt?: string | null
  acceptedAt?: string | null
  enrolledAt?: string | null
  course: {
    id: string
    title: string | null
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

  /** Get company-wide invite history */
  static async getCompanyInviteHistory(): Promise<InviteHistoryItem[]> {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Not authenticated")

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

    const { data, error } = await supabase
      .from("invites")
      .select(`
        id,
        email,
        status,
        created_at,
        viewed_at,
        accepted_at,
        enrolled_at,
        course:courses (
          id,
          title
        )
      `)
      .eq("company_id", userData.company_id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return (
      data?.map((invite) => ({
        id: invite.id,
        email: invite.email,
        status: invite.status,
        createdAt: invite.created_at,
        viewedAt: invite.viewed_at,
        acceptedAt: invite.accepted_at,
        enrolledAt: invite.enrolled_at,
        course: invite.course
          ? { id: invite.course.id, title: invite.course.title }
          : null,
      })) ?? []
    )
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
