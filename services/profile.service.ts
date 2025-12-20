

import { createClient } from "@/superbase/client";




const supabase = createClient();
export type UserRole = "trainer" | "learner"

export interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  role: UserRole
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string | null 
}



export const ProfileService = {
  async getAuthUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  async getProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProfile(
    userId: string,
    payload: Partial<Pick<UserProfile, "full_name" | "bio" | "avatar_url">>
  ) {
    const { error } = await supabase
      .from("users")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) throw error
  },


  async updateEmail(newEmail: string) {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) throw error
  },


async requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw error
},

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split(".").pop()
    const filePath = `avatars/${userId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    await this.updateProfile(userId, {
      avatar_url: data.publicUrl,
    })

    return data.publicUrl
  },

  async deleteAccount() {
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token

  const res = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) throw new Error("Delete failed")
},

  async getAchievements(userId: string) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  },



  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
}
