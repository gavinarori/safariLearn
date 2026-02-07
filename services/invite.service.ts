import { createClient } from "@/superbase/client"

const supabase = createClient()

export interface CourseInvite {
  emails: string[]
  courseId: string
  courseName: string
  message?: string
}

export class InviteManager {
  /**
   * Send course invites to multiple employees
   */
  static async inviteEmployeesToCourse(invites: CourseInvite) {
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) throw new Error("Not authenticated")

      // Get company ID from user
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
          // 🔍 Check if user already exists
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle()

          if (!existingUser) {
            const token = this.generateToken()
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

            const { data: invite, error: inviteError } = await supabase
              .from("invites")
              .insert({
                email,
                company_id: companyId,
                course_id: invites.courseId, // ✅ NEW
                token,
                expires_at: expiresAt.toISOString(),
                role: "employee",
                status: "sent", // ✅ NEW
              })
              .select()
              .single()

            if (inviteError) throw inviteError

            await this.sendInviteEmail(
              email,
              token,
              invites.courseName,
              invites.message
            )

            return {
              email,
              status: "invited",
              inviteId: invite.id,
            }
          }



          // 🚫 Prevent duplicate enrollment
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
    } catch (error) {
      console.error("Error inviting employees:", error)
      throw error
    }
  }

  /**
   * Send invite email with course link
   */
  private static async sendInviteEmail(
    email: string,
    token: string,
    courseName: string,
    customMessage?: string
  ) {
    const inviteLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/invite/${token}`

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-invite-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          courseName,
          inviteLink,
          customMessage,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to send invite email to ${email}`)
    }
  }

  /**
   * Send enrollment confirmation email
   */
  private static async sendEnrollmentEmail(
    email: string,
    courseName: string
  ) {
    const courseLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/learn`

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-enrollment-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          courseName,
          courseLink,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to send enrollment email to ${email}`)
    }
  }

  /**
   * Generate secure invite token
   */
  private static generateToken(): string {
    return crypto.randomUUID()
  }
}
