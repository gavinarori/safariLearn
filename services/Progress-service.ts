import { createClient } from "@/superbase/client"

const supabase = createClient()

export const ProgressService = {
  async completeSection(userId: string, sectionId: string) {
    const { error } = await supabase
      .from("section_progress")
      .upsert({
        user_id: userId,
        section_id: sectionId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })

    if (error) throw error
  },

  async recalcModule(userId: string, moduleId: string) {
    const { data: sections } = await supabase
      .from("module_sections")
      .select("id")
      .eq("module_id", moduleId)

    if (!sections?.length) return false

    const { data: completed } = await supabase
      .from("section_progress")
      .select("section_id")
      .eq("user_id", userId)
      .in(
        "section_id",
        sections.map(s => s.id)
      )
      .eq("is_completed", true)

    const done = completed?.length === sections.length

    await supabase.from("module_progress").upsert({
      user_id: userId,
      module_id: moduleId,
      is_completed: done,
      completed_at: done ? new Date().toISOString() : null,
    })

    return done
  },

  async recalcLesson(userId: string, lessonId: string) {
    const { data: modules } = await supabase
      .from("course_modules")
      .select("id")
      .eq("lesson_id", lessonId)

    if (!modules?.length) return false

    const { data: completed } = await supabase
      .from("module_progress")
      .select("module_id")
      .eq("user_id", userId)
      .in(
        "module_id",
        modules.map(m => m.id)
      )
      .eq("is_completed", true)

    const done = completed?.length === modules.length

    await supabase.from("lesson_progress").upsert({
      user_id: userId,
      lesson_id: lessonId,
      is_completed: done,
      completed_at: done ? new Date().toISOString() : null,
    })

    return done
  },

  async recalcCourse(userId: string, courseId: string) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId)

    if (!lessons?.length) return

    const { data: completed } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .in(
        "lesson_id",
        lessons.map(l => l.id)
      )
      .eq("is_completed", true)

    const percent = Math.round(
      ((completed?.length ?? 0) / lessons.length) * 100
    )

    await supabase.from("course_progress").upsert({
      user_id: userId,
      course_id: courseId,
      progress_percent: percent,
      is_completed: percent === 100,
      completed_at: percent === 100 ? new Date().toISOString() : null,
    })
  },
}
