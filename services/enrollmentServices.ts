import { createClient } from "@/superbase/client"

const supabase = createClient()



export type EnrollmentStatus = "invited" | "active" | "completed"

export type Enrollment = {
  id: string
  company_id: string
  course_id: string
  user_id: string
  status: EnrollmentStatus
  progress: number
  enrolled_at: string
}

export type EnrollmentWithCourse = Enrollment & {
  course?: {
    id: string
    title: string
    thumbnail_url: string | null
    category: string | null
    price: number | null
  }
}



export const createEnrollment = async (
  courseId: string,
  userId: string
): Promise<Enrollment | null> => {
  // 1️⃣ check seat availability (Edge Function)
  const { data: session } = await supabase.auth.getSession()
  const token = session.session?.access_token

  if (!token) throw new Error("Not authenticated")

  const seatCheck = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/check-seat-availability`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)


  if (!seatCheck.ok) {
    throw new Error("Seat limit reached")
  }

  const { data: admin } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single()

  if (!admin?.company_id) throw new Error("Admin has no company")


  const { data: existing } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle()

  if (existing) return existing


  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      company_id: admin.company_id,
      course_id: courseId,
      user_id: userId,
      status: "active",
      progress: 0,
    })
    .select()
    .single()

  if (error) throw error
  return data
}



export const getMyEnrollments = async (): Promise<
  EnrollmentWithCourse[]
> => {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return []

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      course:courses (
        id,
        title,
        thumbnail_url,
        category,
        price
      )
    `
    )
    .eq("user_id", user.user.id)
    .order("enrolled_at", { ascending: false })

  if (error) throw error
  return data || []
}


export const getEnrollment = async (
  courseId: string
): Promise<Enrollment | null> => {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return null

  const { data, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.user.id)
    .maybeSingle()

  if (error) throw error
  return data
}



export const updateEnrollmentProgress = async (
  enrollmentId: string,
  progress: number
): Promise<Enrollment | null> => {
  const status: EnrollmentStatus =
    progress >= 100 ? "completed" : "active"

  const { data, error } = await supabase
    .from("enrollments")
    .update({
      progress,
      status,
    })
    .eq("id", enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data
}


export const getCompanyEnrollments = async (
  companyId: string
): Promise<EnrollmentWithCourse[]> => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      course:courses (
        id,
        title,
        category
      )
    `
    )
    .eq("company_id", companyId)
    .order("enrolled_at", { ascending: false })

  if (error) throw error
  return data || []
}
