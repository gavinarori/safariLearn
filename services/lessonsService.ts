import { createClient } from "@/superbase/client";

const supabase = createClient();

/* ================================
   Types
================================ */

export type LessonSection =
  | {
      type: "text";
      title: string;
      subtitle?: string;
      content: string;
      keyPoints?: string[];
      callout?: string;
    }
  | {
      type: "image";
      title: string;
      image: string;
      content?: string;
    }
  | {
      type: "example";
      title: string;
      content: string;
    };

export type LessonQuiz = {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  passScore: number;
};

export type LessonPayload = {
  course_id: string;
  title: string;
  lesson_type: "reading" | "quiz" | "mixed";
  sections?: LessonSection[];
  quiz?: LessonQuiz;
  order_index?: number;
  estimated_time?: number; // minutes
  is_preview?: boolean;
};

/* ================================
   Service
================================ */

export const LessonsService = {
  /* -------- Get lessons by course -------- */
  async getLessonsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data;
  },

  /* -------- Get single lesson -------- */
  async getLessonById(id: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  /* -------- Create lesson -------- */
  async createLesson(payload: LessonPayload) {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        ...payload,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /* -------- Update lesson -------- */
  async updateLesson(
    id: string,
    updates: Partial<LessonPayload & { status: "draft" | "published" }>
  ) {
    const { data, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /* -------- Publish all lessons in course -------- */
  async publishLessonsByCourse(courseId: string) {
    const { error } = await supabase
      .from("lessons")
      .update({ status: "published" })
      .eq("course_id", courseId);

    if (error) throw error;
    return { success: true };
  },

  /* -------- Delete lesson -------- */
  async deleteLesson(id: string) {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { message: "Lesson deleted successfully" };
  },
};
