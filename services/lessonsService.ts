import { createClient } from "@/superbase/client"

const supabase = createClient()

/* ================================
   Types
================================ */

export type ModuleSection = {
  id: string
  type: "text" | "image" | "example"
  title: string
  subtitle?: string | null
  content: string
  image_url?: string | null
  key_points?: string[] | null
  callout?: string | null
  position: number
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

export type CourseModule = {
  id: string
  title: string
  description?: string | null
  position: number
  sections: ModuleSection[]
  quiz?: ModuleQuiz
}

export type Lesson = {
  id: string
  title: string
  order_index: number
  is_preview: boolean
  reading_time?: number | null
  modules: CourseModule[]
  finalQuiz?: ModuleQuiz
}

export type CourseLessonsData = {
  lessons: Lesson[]
}

/* ================================
   Service
================================ */

export const CourseContentService = {
  async getCourseContent(courseId: string): Promise<CourseLessonsData> {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select(`
        id,
        title,
        order_index,
        is_preview,
        reading_time,
        course_modules (
          id,
          title,
          description,
          position,
          module_sections (
            id,
            type,
            title,
            subtitle,
            content,
            image_url,
            key_points,
            callout,
            position
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
        )
      `)
      .eq("course_id", courseId)
      .order("order_index")

    if (error) throw error

    return {
      lessons: (lessons ?? []).map((lesson) => {
        const modules: CourseModule[] = (lesson.course_modules ?? [])
          .sort((a, b) => a.position - b.position)
          .map((module) => {
            const quiz = module.quizzes?.[0]

            return {
              id: module.id,
              title: module.title,
              description: module.description,
              position: module.position,
              sections: (module.module_sections ?? []).sort(
                (a, b) => a.position - b.position
              ),
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
          })

        const finalQuizModule = modules.find(
          (m) => m.quiz?.is_final === true
        )

        return {
          id: lesson.id,
          title: lesson.title,
          order_index: lesson.order_index,
          is_preview: lesson.is_preview,
          reading_time: lesson.reading_time,
          modules,
          finalQuiz: finalQuizModule?.quiz,
        }
      }),
    }
  },
}
