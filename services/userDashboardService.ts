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

  async getEnrolledCourses(): Promise<UserCourseStatus[]> {
  const { data: authData } = await this.supabase.auth.getUser()
  const userId = authData.user?.id
  if (!userId) return []


  const { data: enrollments, error } = await this.supabase
    .from("enrollments")
    .select(`
      enrolled_at,
      course_id,
      courses (
        id,
        title
      )
    `)
    .eq("user_id", userId)
    .in("status", ["active", "completed"])
    .order("enrolled_at", { ascending: false })

  if (error) throw error
  if (!enrollments) return []

  const courseIds = enrollments.map((e) => e.course_id)

  const { data: lessons } = await this.supabase
    .from("lessons")
    .select("id, course_id")
    .in("course_id", courseIds)

  const lessonIds = lessons?.map((l) => l.id) ?? []

  const { data: lessonProgress } = await this.supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("is_completed", true)
    .in("lesson_id", lessonIds)


  return enrollments.map((enrollment: any) => {
    const courseLessons =
      lessons?.filter((l) => l.course_id === enrollment.course_id) ?? []

    const totalLessons = courseLessons.length

    const completedLessons =
      lessonProgress?.filter((lp) =>
        courseLessons.some((l) => l.id === lp.lesson_id)
      ).length ?? 0

    const progress =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100)

    let status: CourseStatus = "not_started"
    if (progress === 100) status = "completed"
    else if (progress > 0) status = "in_progress"

    return {
      user_id: userId,
      course_id: enrollment.course_id,
      course_name: enrollment.courses?.title ?? "Untitled Course",
      status,
      progress_percent: progress,
      enrolled_at: enrollment.enrolled_at,

      completed_lessons: completedLessons,
      total_lessons: totalLessons,
    }
  })
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