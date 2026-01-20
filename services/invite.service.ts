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
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error("Not authenticated")

      // Get company ID from user
      const { data: userData } = await supabase.from("users").select("company_id").eq("id", user.user.id).single()

      if (!userData?.company_id) throw new Error("User has no company")

      // Create enrollments for each email
      const enrollmentPromises = invites.emails.map(async (email) => {
        // Check if user exists with this email
        const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).maybeSingle()

        const userId = existingUser?.id

        if (!userId) {
          // User doesn't exist yet, create invite for them
          const inviteToken = this.generateToken()
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

          const { data: invite, error: inviteError } = await supabase
            .from("invites")
            .insert({
              email,
              company_id: userData.company_id,
              token: inviteToken,
              expires_at: expiresAt.toISOString(),
              role: "employee",
            })
            .select()
            .single()

          if (inviteError) throw inviteError

          // Send email with invite link
          await this.sendInviteEmail(email, inviteToken, invites.courseName, invites.message)

          return { email, status: "invited", inviteId: invite.id }
        } else {
          // User exists, create enrollment directly
          const { data: enrollment, error: enrollmentError } = await supabase
            .from("enrollments")
            .insert({
              company_id: userData.company_id,
              course_id: invites.courseId,
              user_id: userId,
              status: "active",
              progress: 0,
            })
            .select()
            .single()

          if (enrollmentError) throw enrollmentError

          // Send enrollment confirmation email
          await this.sendEnrollmentEmail(email, invites.courseName)

          return { email, status: "enrolled", enrollmentId: enrollment.id }
        }
      })

      const results = await Promise.all(enrollmentPromises)
      return results
    } catch (error) {
      console.error("Error inviting employees:", error)
      throw error
    }
  }

  /**
   * Send invite email with course link
   */
  private static async sendInviteEmail(email: string, token: string, courseName: string, customMessage?: string) {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite/${token}`

    // Call backend email function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-invite-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        courseName,
        inviteLink,
        customMessage,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send invite email to ${email}`)
    }
  }

  /**
   * Send enrollment confirmation email
   */
  private static async sendEnrollmentEmail(email: string, courseName: string) {
    const courseLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/learn`

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-enrollment-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        courseName,
        courseLink,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send enrollment email to ${email}`)
    }
  }

  /**
   * Generate secure invite token
   */
  private static generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}
