import { SupabaseClient } from "@supabase/supabase-js"



export interface UserDashboardSummary {
  user_id: string
  total_courses: number
  completed_courses: number
  courses_in_progress: number
  avg_progress_percent: number
}

export type CourseStatus = "completed" | "in_progress" | "not_started"

export interface UserCourseStatus {
  user_id: string
  course_id: string
  course_name: string
  status: CourseStatus
  progress_percent: number
  enrolled_at: string
}

export interface UserProgressChart {
  user_id: string
  course: string
  progress_percent: number
}

export interface UserDashboardData {
  summary: UserDashboardSummary | null
  courses: UserCourseStatus[]
  chart: UserProgressChart[]
}



export class UserDashboardService {
  constructor(private supabase: SupabaseClient) {}


async getSummary(): Promise<UserDashboardSummary | null> {
  const { data: authData } = await this.supabase.auth.getUser()
  const userId = authData.user?.id

  if (!userId) return null

  const { data, error } = await this.supabase
    .from("user_dashboard_summary")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw error
  return data
}

  async getCourses(): Promise<UserCourseStatus[]> {
    const { data, error } = await this.supabase
      .from("user_course_status")
      .select("*")
      .order("enrolled_at", { ascending: false })

    if (error) {
      console.error("Courses fetch error:", error.message)
      throw error
    }

    return data ?? []
  }


  async getChart(): Promise<UserProgressChart[]> {
    const { data, error } = await this.supabase
      .from("user_progress_chart")
      .select("*")

    if (error) {
      console.error("Chart fetch error:", error.message)
      throw error
    }

    return data ?? []
  }


  async getDashboard(): Promise<UserDashboardData> {
    const [summary, courses, chart] = await Promise.all([
      this.getSummary(),
      this.getCourses(),
      this.getChart(),
    ])

    return {
      summary,
      courses,
      chart,
    }
  }
}