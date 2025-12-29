import { createClient } from "@/superbase/client"

const supabase = createClient()

export const getCurrentUserProfile = async () => {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null

  const { data, error } = await supabase
    .from("users")
    .select("id, company_id, role")
    .eq("id", auth.user.id)
    .single()

  if (error) throw error
  return data
}
