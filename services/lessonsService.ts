import { createClient } from "@/superbase/client"

const supabase = createClient()


export type LessonBlock = {
  id: string
  type:
    | "text"
    | "heading"
    | "image"
    | "list"
    | "callout"
    | "dropdown"
    | "quote"
    | "code"
    | "video"
    | "file"
    | "table"
    | "divider"
    | "quiz"

  content: string | null

  data: any | null

  position: number

  progress?: BlockProgress
}

export type BlockProgress = {
  is_completed: boolean
}



export type QuizOption = {
  id: string
  text: string
  is_correct: boolean
}

export type QuizQuestion = {
  id: string
  question: string
  type: "mcq" | "true_false"
  options: QuizOption[]
}

export type ModuleQuiz = {
  id: string
  passing_score: number
  is_final: boolean
  questions: QuizQuestion[]
}



export type Lesson = {
  id: string
  title: string
  order_index: number
  is_preview: boolean
  reading_time?: number | null

  blocks: LessonBlock[]

  progress?: LessonProgress
}

export type LessonProgress = {
  is_completed: boolean
}



export type CourseModule = {
  id: string
  title: string
  description?: string | null
  position: number
  banner_image_url?: string | null

  lessons: Lesson[]

  quiz?: ModuleQuiz

  progress?: ModuleProgress
}

export type ModuleProgress = {
  is_completed: boolean
}



export type CourseLessonsData = {
  modules: CourseModule[]
}



export const CourseContentService = {
  async getCourseContent(
    courseId: string,
    userId: string
  ): Promise<CourseLessonsData> {
    const { data, error } = await supabase
      .from("course_modules")
      .select(`
        id,
        title,
        description,
        banner_image_url,
        position,

        module_progress (
          is_completed,
          user_id
        ),

        lessons (
          id,
          title,
          order_index,
          is_preview,
          reading_time,

          lesson_progress (
            is_completed,
            user_id
          ),

          lesson_blocks (
            id,
            type,
            content,
            data,
            position
          )
        ),

        quizzes (
          id,
          passing_score,
          is_final,

          quiz_questions (
            id,
            question,
            type,

            quiz_options (
              id,
              text,
              is_correct
            )
          )
        )
      `)
      .eq("course_id", courseId)
      .order("position")

    if (error) throw error

    return {
      modules: (data ?? []).map((module) => {
        const quiz = module.quizzes?.[0]

        return {
          id: module.id,
          title: module.title,
          description: module.description,
          position: module.position,
          banner_image_url: module.banner_image_url ?? null,

          progress: {
            is_completed:
              module.module_progress?.find(
                (p) => p.user_id === userId
              )?.is_completed ?? false,
          },

          lessons: (module.lessons ?? [])
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              order_index: lesson.order_index,
              is_preview: lesson.is_preview,
              reading_time: lesson.reading_time,

              progress: {
                is_completed:
                  lesson.lesson_progress?.find(
                    (p) => p.user_id === userId
                  )?.is_completed ?? false,
              },

              blocks: (lesson.lesson_blocks ?? [])
                .sort((a, b) => a.position - b.position)
                .map((b) => ({
                  id: b.id,
                  type: b.type,
                  content: b.content,
                  data: b.data,
                  position: b.position,
                })),
            })),

          quiz: quiz
            ? {
                id: quiz.id,
                passing_score: quiz.passing_score,
                is_final: quiz.is_final,

                questions: quiz.quiz_questions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  type: q.type,
                  options: q.quiz_options,
                })),
              }
            : undefined,
        }
      }),
    }
  },
}

export async function markSectionCompleted(
  userId: string,
  sectionId: string,
  moduleId: string
) {
  return supabase
    .from("section_progress")
    .upsert(
      {
        user_id: userId,
        section_id: sectionId,
        module_id: moduleId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,section_id"
      }
    )
}


export const recalculateModuleProgress = async (
  userId: string,
  moduleId: string
) => {
  const { data: sections } = await supabase
    .from("module_sections")
    .select("id")
    .eq("module_id", moduleId)

  const { data: completed } = await supabase
    .from("section_progress")
    .select("id")
    .eq("module_id", moduleId)
    .eq("user_id", userId)
    .eq("is_completed", true)

  const isCompleted =
    (completed?.length ?? 0) === (sections?.length ?? 0)

  if (!isCompleted) return false

  await supabase.from("module_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,module_id" }
  )

  return true
}

export const recalculateCourseProgress = async (
  enrollmentId: string,
  userId: string
) => {
  const { data: modules } = await supabase
    .from("module_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("is_completed", true)

  const { data: totalModules } = await supabase
    .from("course_modules")
    .select("id", { count: "exact" })
    .eq("course_id",
      supabase
        .from("enrollments")
        .select("course_id")
        .eq("id", enrollmentId)
    )

  const progress =
    !totalModules || totalModules.length === 0
      ? 0
      : Math.round(
          ((modules?.length ?? 0) / totalModules.length) * 100
        )

  await supabase
    .from("enrollments")
    .update({
      progress,
      completed: progress === 100,
    })
    .eq("id", enrollmentId)

  return progress
}

