import { SupabaseClient } from "@supabase/supabase-js"

export interface UserDashboardSummary {
  user_id: string
  total_courses: number
  completed_courses: number
  courses_in_progress: number
  avg_progress_percent: number
}

export type CourseStatus = "completed" | "in_progress" | "not_started"

export interface EmployeeCourseProgress {
  user_id: string
  full_name: string | null
  email: string | null
  course_id: string
  course_name: string
  progress_percent: number
  status: CourseStatus
  enrolled_at: string | null
  total_lessons: number
  completed_lessons: number
}

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

  async getCompanyEmployeesCourseProgress(): Promise<EmployeeCourseProgress[]> {

    const { data: { user }, error: authError } = await this.supabase.auth.getUser()
    if (authError || !user) {
      throw new Error("Authentication required")
    }

    const currentUserId = user.id

    const { data: adminUser, error: userError } = await this.supabase
      .from("users")
      .select("company_id, role")
      .eq("id", currentUserId)
      .single()

    if (userError || !adminUser) {
      throw new Error("Failed to fetch current user information")
    }

    if (!["company_admin", "super_admin"].includes(adminUser.role)) {
      throw new Error("Only company admins can view team progress")
    }

    if (!adminUser.company_id) {
      throw new Error("No company associated with this admin account")
    }

    const companyId = adminUser.company_id

    const { data: enrollments, error: enrollErr } = await this.supabase
      .from("enrollments")
      .select(`
        user_id,
        course_id,
        enrolled_at,
        courses!enrollments_course_id_fkey (
          title
        ),
        users!enrollments_user_id_fkey (
          full_name,
          email,
          company_id,
          role
        )
      `)
      .eq("users.company_id", companyId)
      .eq("users.role", "employee")
      .in("status", ["active", "completed"])
      .order("enrolled_at", { ascending: false })

    if (enrollErr) {
      console.error("Failed to fetch employee enrollments:", enrollErr)
      throw enrollErr
    }

    if (!enrollments || enrollments.length === 0) {
      return []
    }

    // Sort by employee name safely in JS
    const sortedEnrollments = [...enrollments].sort((a: any, b: any) => {
      const nameA = a.users?.full_name ?? ""
      const nameB = b.users?.full_name ?? ""
      return nameA.localeCompare(nameB)
    })

    const courseIds = [...new Set(sortedEnrollments.map((e: any) => e.course_id))]
    const userIds = [...new Set(sortedEnrollments.map((e: any) => e.user_id))]

    const { data: lessons, error: lessonsErr } = await this.supabase
      .from("lessons")
      .select("id, course_id")
      .in("course_id", courseIds)

    if (lessonsErr) {
      console.error("Failed to fetch lessons:", lessonsErr)
      throw lessonsErr
    }

    const lessonIds = lessons?.map(l => l.id) ?? []

    const { data: completedLessonRecords, error: progressErr } = await this.supabase
      .from("lesson_progress")
      .select("user_id, lesson_id")
      .in("user_id", userIds)
      .eq("is_completed", true)
      .in("lesson_id", lessonIds)

    if (progressErr) {
      console.error("Failed to fetch lesson progress:", progressErr)
      throw progressErr
    }

    // Map lessons by course
    const lessonsByCourse = new Map<string, string[]>()

    lessons?.forEach(lesson => {
      if (!lessonsByCourse.has(lesson.course_id)) {
        lessonsByCourse.set(lesson.course_id, [])
      }
      lessonsByCourse.get(lesson.course_id)!.push(lesson.id)
    })

    // Map lessonId -> courseId
    const lessonCourseMap = new Map<string, string>()
    lessons?.forEach(l => {
      lessonCourseMap.set(l.id, l.course_id)
    })

    // Count completed lessons per user per course
    const completedByUserCourse = new Map<string, number>()

    completedLessonRecords?.forEach(record => {
      const courseId = lessonCourseMap.get(record.lesson_id)
      if (!courseId) return

      const key = `${record.user_id}-${courseId}`
      const current = completedByUserCourse.get(key) || 0
      completedByUserCourse.set(key, current + 1)
    })

    const result: EmployeeCourseProgress[] = sortedEnrollments.map((enrollment: any) => {

      const courseId = enrollment.course_id
      const userId = enrollment.user_id
      const key = `${userId}-${courseId}`

      const totalLessons = lessonsByCourse.get(courseId)?.length ?? 0
      const completedLessons = completedByUserCourse.get(key) ?? 0

      const progressPercent =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100)

      let status: CourseStatus = "not_started"
      if (progressPercent === 100) status = "completed"
      else if (progressPercent > 0) status = "in_progress"

      return {
        user_id: userId,
        full_name: enrollment.users?.full_name ?? null,
        email: enrollment.users?.email ?? null,
        course_id: courseId,
        course_name: enrollment.courses?.title ?? "Untitled Course",
        progress_percent: progressPercent,
        status,
        enrolled_at: enrollment.enrolled_at,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
      }
    })

    return result
  }

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

    const courseIds = enrollments.map(e => e.course_id)

    const { data: lessons } = await this.supabase
      .from("lessons")
      .select("id, course_id")
      .in("course_id", courseIds)

    const lessonIds = lessons?.map(l => l.id) ?? []

    const { data: lessonProgress } = await this.supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("is_completed", true)
      .in("lesson_id", lessonIds)

    return enrollments.map((enrollment: any) => {

      const courseLessons =
        lessons?.filter(l => l.course_id === enrollment.course_id) ?? []

      const totalLessons = courseLessons.length

      const completedLessons =
        lessonProgress?.filter(lp =>
          courseLessons.some(l => l.id === lp.lesson_id)
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