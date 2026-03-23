import { Course, CourseModule, Lesson, LessonBlock } from "@/lib/types/course";
import { createClient } from "@/superbase/client";

const supabase = createClient();

/**
 * Fetch a course with all modules, lessons, and lesson blocks
 */
export async function getCourseWithContent(
  courseId: string
): Promise<Course | null> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        course_modules (
          *,
          lessons (
            *,
            lesson_blocks (*)
          )
        )
      `
      )
      .eq("id", courseId)
      .order("position", { foreignTable: "course_modules" })
      .order("order_index", { foreignTable: "course_modules.lessons" })
      .order("position", {
        foreignTable: "course_modules.lessons.lesson_blocks",
      })
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return null;
    }

    return data as Course;
  } catch (error) {
    console.error("Error in getCourseWithContent:", error);
    return null;
  }
}

/**
 * Fetch a specific lesson with all its blocks
 */
export async function getLessonWithBlocks(
  lessonId: string
): Promise<Lesson | null> {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select(
        `
        *,
        lesson_blocks (*)
      `
      )
      .eq("id", lessonId)
      .order("position", { foreignTable: "lesson_blocks" })
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      return null;
    }

    return data as Lesson;
  } catch (error) {
    console.error("Error in getLessonWithBlocks:", error);
    return null;
  }
}

/**
 * Fetch all modules for a course
 */
export async function getCourseModules(
  courseId: string
): Promise<CourseModule[] | null> {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .select(
        `
        *,
        lessons (
          *,
          lesson_blocks (*)
        )
      `
      )
      .eq("course_id", courseId)
      .order("position")
      .order("order_index", { foreignTable: "lessons" })
      .order("position", { foreignTable: "lessons.lesson_blocks" });

    if (error) {
      console.error("Error fetching course modules:", error);
      return null;
    }

    return data as CourseModule[];
  } catch (error) {
    console.error("Error in getCourseModules:", error);
    return null;
  }
}

/**
 * Fetch a specific module with all its lessons and blocks
 */
export async function getModuleWithLessons(
  moduleId: string
): Promise<CourseModule | null> {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .select(
        `
        *,
        lessons (
          *,
          lesson_blocks (*)
        )
      `
      )
      .eq("id", moduleId)
      .order("order_index", { foreignTable: "lessons" })
      .order("position", { foreignTable: "lessons.lesson_blocks" })
      .single();

    if (error) {
      console.error("Error fetching module:", error);
      return null;
    }

    return data as CourseModule;
  } catch (error) {
    console.error("Error in getModuleWithLessons:", error);
    return null;
  }
}

/**
 * Fetch all lesson blocks for a lesson
 */
export async function getLessonBlocks(
  lessonId: string
): Promise<LessonBlock[] | null> {
  try {
    const { data, error } = await supabase
      .from("lesson_blocks")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("position", { ascending: true });

    if (error) {
      console.error("Error fetching lesson blocks:", error);
      return null;
    }

    return data as LessonBlock[];
  } catch (error) {
    console.error("Error in getLessonBlocks:", error);
    return null;
  }
}

/**
 * Fetch progress for all lessons in a course for a user
 */
export async function getUserCourseProgress(
  userId: string,
  courseId: string
) {
  try {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_id, is_completed, completed_at")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching progress:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserCourseProgress:", error);
    return null;
  }
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  isCompleted: boolean
) {
  try {
    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        is_completed: isCompleted,
        completed_at: isCompleted
          ? new Date().toISOString()
          : null,
      },
      {
        onConflict: "user_id,lesson_id",
      }
    );

    if (error) {
      console.error("Error updating progress:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateLessonProgress:", error);
    return false;
  }
}

/**
 * Get course progress summary
 */
export async function getCourseSummary(
  userId: string,
  courseId: string
) {
  try {
    const { data, error } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching course progress:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCourseSummary:", error);
    return null;
  }
}