import { createClient } from "@/superbase/client";

export type InviteRole = "admin" | "employee"

const supabase = createClient();

export class InviteService {
  /**
   * Create an invite
   */
  static async createInvite(
    email: string,
    role: InviteRole = "employee"
  ) {
    const { data: session } = await supabase.auth.getSession()
    const token = session.session?.access_token

    if (!token) throw new Error("Not authenticated")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-invite`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role }),
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg)
    }

    return true
  }


  static async acceptInvite(token: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/accept-invite`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    )

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg)
    }

    return true
  }


  static async listCompanyInvites(companyId: string) {
    const { data, error } = await supabase
      .from("invites")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }


  static async revokeInvite(inviteId: string) {
    const { error } = await supabase
      .from("invites")
      .delete()
      .eq("id", inviteId)

    if (error) throw error
  }
}
